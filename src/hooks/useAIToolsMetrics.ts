
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AIToolsMetrics {
  aiInteractions: number;
  timeSavedHours: number;
  accuracyImprovement: number;
  efficiencyBoost: number;
  totalMaterials: number;
  totalWorkflows: number;
  recentActivity: number;
}

export const useAIToolsMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-tools-metrics', user?.id],
    queryFn: async (): Promise<AIToolsMetrics> => {
      if (!user) {
        return {
          aiInteractions: 0,
          timeSavedHours: 0,
          accuracyImprovement: 0,
          efficiencyBoost: 0,
          totalMaterials: 0,
          totalWorkflows: 0,
          recentActivity: 0
        };
      }

      // Get activity logs for AI interactions
      const { data: activityLogs } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('action_type', 'generate');

      // Get materials count
      const { count: materialsCount } = await supabase
        .from('materials')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get workflows count
      const { count: workflowsCount } = await supabase
        .from('workflows')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get user stats for time saved
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('total_study_time')
        .eq('user_id', user.id)
        .single();

      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: recentActivityCount } = await supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      // Calculate metrics
      const aiInteractions = activityLogs?.length || 0;
      const timeSavedHours = Number(userStats?.total_study_time || 0);
      const totalMaterials = materialsCount || 0;
      const totalWorkflows = workflowsCount || 0;
      const recentActivity = recentActivityCount || 0;

      // Calculate improvements based on usage patterns
      const accuracyImprovement = Math.min(Math.round((aiInteractions * 2.3)), 50);
      const efficiencyBoost = Math.min(Math.round((totalMaterials * 3.1 + totalWorkflows * 5.2)), 80);

      return {
        aiInteractions,
        timeSavedHours,
        accuracyImprovement,
        efficiencyBoost,
        totalMaterials,
        totalWorkflows,
        recentActivity
      };
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};
