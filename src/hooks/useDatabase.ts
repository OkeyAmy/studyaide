import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CreateMaterialInput, MaterialDisplay } from '@/types/api';

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
    const bucketName = 'study_materials'; // Make sure this bucket exists and has correct policies
    
  const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
  
  if (error) {
    // Check if the error is due to bucket not found, and provide a more specific message
    if (error.message.includes('Bucket not found')) {
        console.error(`Storage bucket "${bucketName}" not found. Please ensure it's created in Supabase.`);
        throw new Error(`Storage bucket "${bucketName}" not found. Please create it in your Supabase project.`);
    }
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
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (statsError && statsError.code !== 'PGRST116') { // PGRST116: 'Searched for a single row, but found no rows' (not an error for optional stats)
        console.error('Error fetching user stats:', statsError);
        // Decide if this should throw or return default/empty stats
      }

      // Get active workflows count
      const { count: activeWorkflows, error: workflowsError } = await supabase
        .from('workflows')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');
      if (workflowsError) {
          console.error('Error fetching active workflows count:', workflowsError);
      }

      return {
        loginStreak: stats?.login_streak || 0,
        timeSavedHours: stats?.total_study_time || 0, // Assuming total_study_time is in hours
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
      const { data: workflows, error } = await supabase
        .from('workflows')
        .select(`
          id,
          title,
          status,
          time_spent,
          features_used,
          created_at,
          workflow_materials(
            material_id,
            materials(id, title) 
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        throw error; // Or handle more gracefully
      }
      
      if (!workflows) return {
        totalWorkflows: 0,
        activeSessions: 0,
        completedWorkflows: 0,
        studyHours: 0,
        recentWorkflowSessions: []
      };

      const totalWorkflows = workflows.length;
      const activeSessions = workflows.filter(w => w.status === 'active').length;
      const completedWorkflows = workflows.filter(w => w.status === 'completed').length;
      // Ensure time_spent is treated as a number
      const studyHours = workflows.reduce((acc, w) => acc + (Number(w.time_spent) || 0), 0);

      const recentWorkflowSessions = workflows.slice(0, 10).map(w => ({
        id: w.id,
        title: w.title,
        // Ensure materials are mapped correctly, accessing nested material title if needed
        materials: w.workflow_materials?.map((wm: any) => wm.materials?.title || wm.material_id) || [],
        featuresUsed: w.features_used || [],
        timeSpent: Number(w.time_spent) || 0,
        status: w.status as "active" | "paused" | "completed", // Assuming status is one of these
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

      const { data: materials, error } = await supabase
        .from('materials')
        .select(`
          *,
          workflow_materials(workflow_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching materials:', error);
        throw error;
      }

      return {
        totalItems: materials?.length || 0,
        materials: materials?.map((m): MaterialDisplay => { // Ensure returned type is MaterialDisplay
          let parsedContent: any = undefined;
          if (m.content_summary) {
            try {
              parsedContent = JSON.parse(m.content_summary);
            } catch (e) {
              console.warn(`Failed to parse content_summary as JSON for material ${m.id}, treating as legacy text`);
              parsedContent = {
                summary: m.content_summary,
                quiz: null,
                mindMap: null,
                flashcards: null,
                polishedNote: m.content_summary // or m.raw_transcription or similar if available
              };
            }
          }
          
          const status = (m.status === 'active' || m.status === 'archived') ? m.status : 'active';

          return {
            id: m.id,
            user_id: m.user_id,
            title: m.title,
            file_type: m.file_type as "pdf" | "docx" | "audio" | "video" | "other",
            file_url: m.file_url,
            content_summary: m.content_summary,
            raw_transcription: m.raw_transcription,
            tags: m.tags || [],
            status: status as "active" | "archived", // Correctly type status
            study_time: m.study_time || 0,
            created_at: m.created_at,
            updated_at: m.updated_at,
            // Properties for MaterialDisplay conformity based on typical structure
            type: m.file_type as "pdf" | "docx" | "audio" | "video" | "other", // duplicate but fine for now
            studyTime: m.study_time || 0,
            usedInWorkflow: (m.workflow_materials?.length || 0) > 0,
            uploadedAt: m.created_at, // duplicate but fine
            parsedContent: parsedContent,
            // These might be specific to MaterialDisplay and not directly on 'm'
            // If MaterialDisplay has more fields, they need to be mapped here or made optional
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
          status: 'active' // Default status for new workflow
        })
        .select()
        .single();

      if (error) throw error;

      // Add materials to workflow if provided
      if (materialIds.length > 0) {
        const workflowMaterials = materialIds.map(materialId => ({
          workflow_id: workflow.id,
          material_id: materialId,
          user_id: user.id // Assuming workflow_materials also needs user_id for RLS
        }));
        
        const { error: materialsError } = await supabase
          .from('workflow_materials')
          .insert(workflowMaterials);

        if (materialsError) {
            // If workflow creation succeeded but adding materials failed,
            // consider if the workflow should be deleted or if user should be notified to add manually.
            // For now, throw the error.
            console.error('Error adding materials to workflow:', materialsError);
            throw materialsError;
        }
      }

      // Log activity
      try {
        await supabase.rpc('log_activity', {
          p_user_id: user.id, // Ensure RPC parameters match definition
          p_action_type: 'create',
          p_entity_type: 'workflow',
          p_entity_id: workflow.id,
          p_details: { title, material_count: materialIds.length }
        });
      } catch (rpcError) {
        console.warn('Failed to log activity for workflow creation:', rpcError);
      }


      return workflow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['materials', user?.id] }); // Invalidate materials too if workflow association is shown
    },
    onError: (error) => {
        console.error('Error creating workflow:', error);
        // Potentially show a toast message to the user
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
          user_id: user.id, // Ensure user_id is explicitly set
          title: materialData.title,
          file_type: materialData.file_type,
          file_url: materialData.file_url,
          content_summary: materialData.content_summary,
          raw_transcription: materialData.raw_transcription,
          tags: materialData.tags || [],
          status: materialData.status || 'active', // Default status
          study_time: materialData.study_time || 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Update user stats (ensure RPC exists and parameters are correct)
      try {
        await supabase.rpc('update_user_stats', { p_user_id: user.id });
      } catch(rpcError) {
        console.warn('Failed to update user stats after material creation:', rpcError);
      }
      

      // Log activity (ensure RPC exists and parameters are correct)
      try {
        await supabase.rpc('log_activity', {
          p_user_id: user.id,
          p_action_type: 'create',
          p_entity_type: 'material',
          p_entity_id: material.id,
          p_details: { title: materialData.title, file_type: materialData.file_type }
        });
      } catch (rpcError) {
          console.warn('Failed to log activity for material creation:', rpcError);
      }


      return material;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', user?.id] });
    },
    onError: (error) => {
        console.error('Error creating material:', error);
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
        .select('id, user_id, title, file_type, file_url') // Select only necessary fields
        .eq('id', materialId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError; // Could be "No rows found" which is fine if material doesn't exist or unauthorized
      if (!material) throw new Error('Material not found or you do not have permission to delete it.');


      // Delete from workflow_materials table first (referential integrity)
      // This assumes RLS allows this user to delete these entries.
      const { error: workflowMaterialError } = await supabase
        .from('workflow_materials')
        .delete()
        .eq('material_id', materialId);
      
      if (workflowMaterialError) {
          console.error('Error deleting material from workflows:', workflowMaterialError);
          throw workflowMaterialError; // Or handle more gracefully
      }


      // Delete the material
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', materialId)
        .eq('user_id', user.id); // Redundant user_id check if RLS is properly configured, but good for safety

      if (error) throw error;

      // Try to delete associated file from storage if it exists
      if (material.file_url) {
        try {
          const bucketName = 'study_materials'; // Ensure this matches uploadFileToStorage
          // Extract the file path part of the URL. Supabase public URLs are typically:
          // https://<project-ref>.supabase.co/storage/v1/object/public/<bucket-name>/<user-id>/<timestamp>-<filename>
          // We need the path starting from <user-id>/...
          const urlParts = material.file_url.split('/');
          const filePath = urlParts.slice(urlParts.indexOf(bucketName) + 1).join('/');
          
          if (filePath) {
            const { error: storageErrorData } = await supabase.storage
              .from(bucketName)
              .remove([filePath]); // Pass the full path within the bucket
            if (storageErrorData) throw storageErrorData;
          }
        } catch (storageError: any) {
          console.warn(`Could not delete file ${material.file_url} from storage: ${storageError.message}`);
          // Don't throw error for storage cleanup failure, but log it.
        }
      }

      // Log activity
      try {
        await supabase.rpc('log_activity', {
          p_user_id: user.id,
          p_action_type: 'delete',
          p_entity_type: 'material',
          p_entity_id: materialId, // Use materialId directly as entity_id
          p_details: { title: material.title, file_type: material.file_type }
        });
      } catch(rpcError) {
        console.warn('Failed to log activity for material deletion:', rpcError);
      }


      return material; // Return the deleted material object
    },
    onSuccess: (data, variables) => { // variables = materialId
      queryClient.invalidateQueries({ queryKey: ['materials', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.id] }); // Workflows might have referenced this material
      // Optionally, remove specific queries if needed, e.g., for the deleted material itself if cached individually
      // queryClient.removeQueries({ queryKey: ['material', variables] }); 
    },
    onError: (error) => {
        console.error('Error deleting material:', error);
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

      const { data: activities, error } = await supabase
        .from('activity_logs') // Ensure this table exists and RLS is set up
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
          console.error('Error fetching activity logs:', error);
          throw error;
      }

      return activities || [];
    },
    enabled: !!user
  });
};

// Helper function to save study session to database
// This function seems to be intended for inserting into a `study_sessions` table.
// Ensure this table and the RPC function `insert_study_session` exist and are correctly defined.
export const saveStudySessionToDb = async (sessionData: {
  userId: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  fileUrl?: string;
  rawTranscription?: string;
  polishedNote?: string;
  aiSummary?: string;
  aiQuiz?: any; // JSON or string
  aiMindmap?: string; // Text or JSON string for Markmap
  aiFlashcards?: any; // JSON array or string
  processingTimeMs?: number;
  featuresGenerated?: string[]; // Array of strings
}) => {
  // It's generally better to insert directly into tables with typed objects if possible,
  // rather than relying on RPCs for simple inserts, unless the RPC does more (e.g., complex validation, related inserts).
  // Assuming 'insert_study_session' RPC is preferred for now.
  // Ensure parameter names match the RPC definition.
  const { data, error } = await supabase.rpc('insert_study_session', {
    p_user_id: sessionData.userId, // Supabase RPCs often prefix params
    p_file_name: sessionData.fileName,
    p_file_type: sessionData.fileType,
    p_file_size: sessionData.fileSize,
    p_file_url: sessionData.fileUrl,
    p_raw_transcription: sessionData.rawTranscription,
    p_polished_note: sessionData.polishedNote,
    p_ai_summary: sessionData.aiSummary,
    p_ai_quiz: sessionData.aiQuiz,
    p_ai_mindmap: sessionData.aiMindmap,
    p_ai_flashcards: sessionData.aiFlashcards,
    p_processing_time_ms: sessionData.processingTimeMs,
    p_features_generated: sessionData.featuresGenerated,
    p_status: 'completed', // Default status, or pass as param if variable
    p_processing_completed_at: new Date().toISOString()
  });

  if (error) {
    console.error('Error saving study session via RPC:', error);
    throw error;
  }

  return data; // RPC might return the inserted row or a status
};
