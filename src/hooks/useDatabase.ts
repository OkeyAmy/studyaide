import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CreateMaterialInput } from '@/types/api';

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

      // Get all workflows with materials
      const { data: workflows } = await supabase
        .from('workflows')
        .select(`
          *,
          workflow_materials(
            material_id,
            materials(id, title)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const totalWorkflows = workflows?.length || 0;
      const activeSessions = workflows?.filter(w => w.status === 'active').length || 0;
      const completedWorkflows = workflows?.filter(w => w.status === 'completed').length || 0;
      const studyHours = workflows?.reduce((acc, w) => acc + (w.time_spent || 0), 0) || 0;

      const recentWorkflowSessions = workflows?.slice(0, 10).map(w => ({
        id: w.id,
        title: w.title,
        materials: w.workflow_materials?.map((wm: any) => wm.material_id) || [],
        featuresUsed: w.features_used || [],
        timeSpent: w.time_spent || 0,
        status: w.status as "active" | "paused" | "completed",
        createdAt: w.created_at
      })) || [];

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
        materials: materials?.map(m => {
          // Try to parse the content_summary as JSON if it exists
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
            usedInWorkflow: (m.workflow_materials?.length || 0) > 0,
            uploadedAt: m.created_at,
            parsedContent
          };
        }) || []
      };
    },
    enabled: !!user
  });
};

// Create workflow mutation
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ title, materialIds = [] }: { title: string; materialIds?: string[] }) => {
      if (!user) throw new Error('User not authenticated');

      // Create workflow
      const { data: workflow, error } = await supabase
        .from('workflows')
        .insert({
          user_id: user.id,
          title,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Add materials to workflow if provided
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

// Add material to workflow mutation
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

      const { data, error } = await supabase
        .from('workflow_materials')
        .insert({
          workflow_id: workflowId,
          material_id: materialId,
        })
        .select()
        .single();

      if (error) throw error;

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
