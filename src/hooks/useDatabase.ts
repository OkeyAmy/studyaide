
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CreateMaterialInput } from '@/types/api';

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
        materials: materials?.map(m => ({
          ...m,
          type: m.file_type as "pdf" | "docx" | "audio" | "video" | "other",
          studyTime: m.study_time || 0,
          usedInWorkflow: (m.workflow_materials?.length || 0) > 0,
          uploadedAt: m.created_at
        })) || []
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
