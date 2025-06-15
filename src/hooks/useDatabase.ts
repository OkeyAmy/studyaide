import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CreateMaterialInput, MaterialDisplay } from '@/types/api';
import WorkflowAIService from '@/services/workflow/ai.service';

// Utility function to sanitize filename for storage
function sanitizeFileName(fileName: string): string {
  return fileName
    // Remove emojis and special unicode characters
    .replace(/[\u{1F600}-\u{1F6FF}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map Symbols
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Regional indicator symbols
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Miscellaneous symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    // Replace problematic characters with safe alternatives
    .replace(/[–—]/g, '-')                   // Em dash, en dash to hyphen
    .replace(/['']/g, "'")                   // Smart quotes to regular quotes
    .replace(/[""]/g, '"')                   // Smart double quotes
    .replace(/[^\w\s\-_.()]/g, '')          // Remove other special chars, keep alphanumeric, spaces, hyphens, underscores, dots, parentheses
    .replace(/\s+/g, '_')                    // Replace spaces with underscores
    .replace(/_{2,}/g, '_')                  // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '')                 // Remove leading/trailing underscores
    .trim();
}

// Utility function to upload file to Supabase storage
export async function uploadFileToStorage(file: File, userId: string): Promise<string> {
  try {
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = `${userId}/${Date.now()}-${sanitizedFileName}`;
  
    // Use existing bucket name that matches your Supabase storage
    const bucketName = 'study_materials';
    
  const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
  
  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
  
    // Get public URL
  const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
  
  return publicUrl;
  } catch (error) {
    console.error('Error uploading file to storage:', error);
    throw error;
  }
}

// Utility function to map raw material data to MaterialDisplay type
function toMaterialDisplay(m: any, usedInWorkflow: boolean): MaterialDisplay {
  let parsedContent = undefined;
  if (m.content_summary) {
    try {
      parsedContent = JSON.parse(m.content_summary);
    } catch (e) {
      // If it's not valid JSON, treat it as legacy plain text summary
      console.warn(`Failed to parse content_summary as JSON for material ${m.id}, treating as legacy text`);
      parsedContent = {
        summary: m.content_summary, // Use the plain text as summary
        quiz: null,
        mindMap: null,
        flashcards: null,
        polishedNote: m.content_summary
      };
    }
  }

  return {
    ...m,
    type: m.file_type as "pdf" | "docx" | "audio" | "video" | "other",
    status: ((m.status === 'active' || m.status === 'archived') ? m.status : 'active') as "active" | "archived",
    studyTime: m.study_time || 0,
    usedInWorkflow,
    uploadedAt: m.created_at,
    parsedContent
  };
}

// Dashboard data hook
export const useDashboardData = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get active workflows count
      const { count: activeWorkflows } = await supabase
        .from('workflows')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');

      return {
        loginStreak: stats?.login_streak || 0,
        timeSavedHours: stats?.total_study_time || 0,
        materialsProcessed: stats?.materials_processed || 0,
        activeWorkflows: activeWorkflows || 0
      };
    },
    enabled: !!user
  });
};

// Workflows data hook
export const useWorkflowData = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['workflows', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get all workflows
      const { data: workflows } = await supabase
        .from('workflows')
        .select(`*`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const totalWorkflows = workflows?.length || 0;
      const activeSessions = workflows?.filter(w => w.status === 'active').length || 0;
      const completedWorkflows = workflows?.filter(w => w.status === 'completed').length || 0;
      const studyHours = workflows?.reduce((acc, w) => acc + (w.time_spent || 0), 0) || 0;

      const recentWorkflowSessions = workflows?.slice(0, 10).map(w => {
        let materials: any[] = [];
        // Handle new object format and old array format for backwards compatibility
        const materialsData = w.materials_data;
        if (materialsData && typeof materialsData === 'object' && !Array.isArray(materialsData) && materialsData !== null && 'materials' in materialsData && Array.isArray((materialsData as any).materials)) {
          materials = (materialsData as any).materials;
        } else if (Array.isArray(materialsData)) {
          materials = materialsData;
        }
        
        return {
          id: w.id,
          title: w.title,
          materials: materials.map((m: any) => toMaterialDisplay(m, true)),
          featuresUsed: w.features_used || [],
          timeSpent: w.time_spent || 0,
          status: w.status as "active" | "paused" | "completed",
          createdAt: w.created_at
        };
      }) || [];

      return {
        totalWorkflows,
        activeSessions,
        completedWorkflows,
        studyHours,
        recentWorkflowSessions
      };
    },
    enabled: !!user
  });
};

// Materials data hook
export const useMaterialsData = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['materials', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data: materials } = await supabase
        .from('materials')
        .select(`
          *,
          workflow_materials(workflow_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return {
        totalItems: materials?.length || 0,
        materials: materials?.map(m => toMaterialDisplay(m, (m.workflow_materials?.length || 0) > 0)) || []
      };
    },
    enabled: !!user
  });
};

// Create workflow mutation with AI generation
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ title, materialIds = [] }: { title: string; materialIds?: string[] }) => {
      if (!user) throw new Error('User not authenticated');

      // Fetch material data if IDs are provided
      let materialsData: any[] = [];
      if (materialIds.length > 0) {
        const { data: materials, error: fetchError } = await supabase
          .from('materials')
          .select('*')
          .in('id', materialIds);

        if (fetchError) throw fetchError;
        materialsData = materials || [];
      }

      // Create workflow with materials_data as an object
      const { data: workflow, error } = await supabase
        .from('workflows')
        .insert({
          user_id: user.id,
          title,
          status: 'active',
          materials_data: {
            materials: materialsData,
          },
        })
        .select()
        .single();

      if (error) throw error;

      // Add materials to workflow_materials join table if provided
      if (materialIds.length > 0) {
        const { error: materialsError } = await supabase
          .from('workflow_materials')
          .insert(
            materialIds.map(materialId => ({
              workflow_id: workflow.id,
              material_id: materialId
            }))
          );

        if (materialsError) throw materialsError;

        // Generate AI content for the workflow if materials are provided
        try {
          console.log('🚀 Starting AI content generation for new workflow...');
          const materialDisplays = materialsData.map((m: any) => toMaterialDisplay(m, true));
          
          const { summary, quiz, flashcards, mindMap } = await WorkflowAIService.generateWorkflowContent(materialDisplays);
          
          const aiContent = {
            summary,
            quiz,
            flashcards,
            mindMap
          };
          
          // Update workflow with AI-generated content
          const { error: updateError } = await supabase
            .from('workflows')
            .update({
              features_used: ['summary', 'quiz', 'flashcards', 'mindmap'],
              materials_data: {
                ...((typeof workflow.materials_data === 'object' && !Array.isArray(workflow.materials_data) && workflow.materials_data !== null) ? workflow.materials_data : {}),
                ai_content: aiContent
              }
            })
            .eq('id', workflow.id);

          if (updateError) {
            console.warn('Failed to update workflow with AI content:', updateError);
          } else {
            console.log('✅ AI content generated and saved for workflow');
          }
        } catch (aiError) {
          console.warn('AI content generation failed, but workflow was created:', aiError);
          // Don't throw error here - workflow creation should succeed even if AI fails
        }
      }

      // Log activity
      await supabase.rpc('log_activity', {
        action_type: 'create',
        entity_type: 'workflow',
        entity_id: workflow.id,
        details: { title, material_count: materialIds.length }
      });

      return workflow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
};

// Create material mutation
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (materialData: CreateMaterialInput) => {
      if (!user) throw new Error('User not authenticated');

      const { data: material, error } = await supabase
        .from('materials')
        .insert({
          user_id: user.id,
          ...materialData
        })
        .select()
        .single();

      if (error) throw error;

      // Update user stats
      await supabase.rpc('update_user_stats');

      // Log activity
      await supabase.rpc('log_activity', {
        action_type: 'create',
        entity_type: 'material',
        entity_id: material.id,
        details: { title: materialData.title, file_type: materialData.file_type }
      });

      return material;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
};

// Add material to workflow mutation with AI generation
export const useAddMaterialToWorkflow = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ workflowId, materialId }: { workflowId: string; materialId: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: existing, error: checkError } = await supabase
        .from('workflow_materials')
        .select('id')
        .eq('workflow_id', workflowId)
        .eq('material_id', materialId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        throw new Error("Material is already in this workflow.");
      }

      // Fetch material to be added
      const { data: materialData, error: materialError } = await supabase
        .from('materials')
        .select('*')
        .eq('id', materialId)
        .single();
      
      if (materialError) throw materialError;
      if (!materialData) throw new Error('Material to add not found');

      // Fetch current workflow data
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflows')
        .select('materials_data')
        .eq('id', workflowId)
        .single();
      
      if (workflowError) throw workflowError;
      if (!workflowData) throw new Error('Workflow not found');
      
      let currentMaterials: any[] = [];
      const materialsData = workflowData.materials_data;
      if (materialsData && typeof materialsData === 'object' && !Array.isArray(materialsData) && materialsData !== null && 'materials' in materialsData && Array.isArray((materialsData as any).materials)) {
        currentMaterials = (materialsData as any).materials;
      } else if (Array.isArray(materialsData)) {
        // Backwards compatibility for old array format
        currentMaterials = materialsData;
      }
      
      const newMaterialsList = [...currentMaterials, materialData];
      
      // Also insert into join table for consistency with other parts of the app
      const { data, error } = await supabase
        .from('workflow_materials')
        .insert({
          workflow_id: workflowId,
          material_id: materialId,
        })
        .select()
        .single();

      if (error) throw error;

      // Generate updated AI content for the workflow and update
      try {
        console.log('🚀 Regenerating AI content for updated workflow...');
        const materialDisplays = newMaterialsList.map((m: any) => toMaterialDisplay(m, true));
        const aiContent = await WorkflowAIService.generateWorkflowContent(materialDisplays);
        
        // Prepare new data object for workflow
        const newWorkflowDataObject = {
          ...((typeof workflowData.materials_data === 'object' && !Array.isArray(workflowData.materials_data) && workflowData.materials_data !== null) ? workflowData.materials_data : {}),
          materials: newMaterialsList,
          ai_content: aiContent
        };

        // Update workflow with new materials data and new AI-generated content
        const { error: aiUpdateError } = await supabase
          .from('workflows')
          .update({
            features_used: ['summary', 'quiz', 'flashcards', 'mindmap'],
            materials_data: newWorkflowDataObject
          })
          .eq('id', workflowId);

        if (aiUpdateError) {
          console.warn('Failed to update workflow with new AI content:', aiUpdateError);
        } else {
          console.log('✅ AI content regenerated and saved for updated workflow');
        }
      } catch (aiError) {
        console.warn('AI content regeneration failed, but material was added:', aiError);
        
        // Still update workflow with the new material even if AI fails
        const newWorkflowDataObject = {
          ...((typeof workflowData.materials_data === 'object' && !Array.isArray(workflowData.materials_data) && workflowData.materials_data !== null) ? workflowData.materials_data : {}),
          materials: newMaterialsList,
        };
        await supabase
          .from('workflows')
          .update({ materials_data: newWorkflowDataObject })
          .eq('id', workflowId);
      }

      await supabase.rpc('log_activity', {
        action_type: 'update',
        entity_type: 'workflow',
        entity_id: workflowId,
        details: { added_material_id: materialId }
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    }
  });
};

// Delete material mutation
export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (materialId: string) => {
      if (!user) throw new Error('User not authenticated');

      // First get the material to ensure user owns it and to get file_url for cleanup
      const { data: material, error: fetchError } = await supabase
        .from('materials')
        .select('*')
        .eq('id', materialId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;
      if (!material) throw new Error('Material not found or unauthorized');

      // Delete from workflow_materials table first (referential integrity)
      await supabase
        .from('workflow_materials')
        .delete()
        .eq('material_id', materialId);

      // Delete the material
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', materialId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Try to delete associated file from storage if it exists
      if (material.file_url) {
        try {
          const bucketName = 'study-files';
          const fileName = material.file_url.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from(bucketName)
              .remove([`${user.id}/${fileName}`]);
          }
        } catch (storageError) {
          console.warn('Could not delete file from storage:', storageError);
          // Don't throw error for storage cleanup failure
        }
      }

      // Log activity
      await supabase.rpc('log_activity', {
        action_type: 'delete',
        entity_type: 'material',
        entity_id: materialId,
        details: { title: material.title, file_type: material.file_type }
      });

      return material;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });
};

// Activity logs hook
export const useActivityLogs = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['activity', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data: activities } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      return activities || [];
    },
    enabled: !!user
  });
};

// Helper function to save study session to database
export const saveStudySessionToDb = async (sessionData: {
  userId: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  fileUrl?: string;
  rawTranscription?: string;
  polishedNote?: string;
  aiSummary?: string;
  aiQuiz?: any;
  aiMindmap?: string;
  aiFlashcards?: any;
  processingTimeMs?: number;
  featuresGenerated?: string[];
}) => {
  // For now, we'll directly insert using a raw SQL approach until the table types are updated
  const { data, error } = await supabase.rpc('insert_study_session', {
    user_id: sessionData.userId,
    file_name: sessionData.fileName,
    file_type: sessionData.fileType,
    file_size: sessionData.fileSize,
    file_url: sessionData.fileUrl,
    raw_transcription: sessionData.rawTranscription,
    polished_note: sessionData.polishedNote,
    ai_summary: sessionData.aiSummary,
    ai_quiz: sessionData.aiQuiz,
    ai_mindmap: sessionData.aiMindmap,
    ai_flashcards: sessionData.aiFlashcards,
    processing_time_ms: sessionData.processingTimeMs,
    features_generated: sessionData.featuresGenerated,
    status: 'completed',
    processing_completed_at: new Date().toISOString()
  });

  if (error) {
    console.error('Error saving study session:', error);
    throw error;
  }

  return data;
};
