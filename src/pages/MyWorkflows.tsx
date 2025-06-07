
import React, { useState } from 'react';
import { Play, Clock, BookOpen, Plus, TrendingUp, Pause, CheckCircle, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SessionCard from '@/components/shared/SessionCard';
import StatsGrid from '@/components/shared/StatsGrid';
import WorkflowSessionView from '@/components/workflow/WorkflowSessionView';
import { Badge } from '@/components/ui/badge';
import { useWorkflowData } from '@/hooks/useDatabase';

const MyWorkflows = () => {
  const navigate = useNavigate();
  const { data: workflowData, isLoading } = useWorkflowData();
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const stats = [
    {
      label: 'Total Workflows',
      value: workflowData?.totalWorkflows || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
      trend: '+3 this week',
      trendDirection: 'up' as const
    },
    {
      label: 'Active Sessions',
      value: workflowData?.activeSessions || 0,
      icon: Play,
      color: 'bg-green-500',
      trend: '2 in progress',
      trendDirection: 'neutral' as const
    },
    {
      label: 'Completed',
      value: workflowData?.completedWorkflows || 0,
      icon: CheckCircle,
      color: 'bg-purple-500',
      trend: 'This week',
      trendDirection: 'up' as const
    },
    {
      label: 'Study Hours',
      value: `${workflowData?.studyHours || 0}h`,
      icon: Clock,
      color: 'bg-orange-500',
      trend: '+5.2h vs last week',
      trendDirection: 'up' as const
    }
  ];

  const handleContinueWorkflow = (session: any) => {
    setSelectedSession(session);
  };

  const handleCreateNew = () => {
    navigate('/study-session');
  };

  const handleBackToList = () => {
    setSelectedSession(null);
  };

  if (isLoading) {
    return <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>)}
      </div>
    </div>;
  }

  if (selectedSession) {
    return <WorkflowSessionView session={selectedSession} onBack={handleBackToList} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Workflows</h1>
          <p className="text-gray-600">Manage and continue your learning journeys</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-pulse-500 hover:bg-pulse-600">
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {/* Stats Overview */}
      <StatsGrid stats={stats} />

      {/* Active Workflows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Workflows</h2>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflowData?.recentWorkflowSessions?.map((session) => (
            <SessionCard
              key={session.id}
              title={session.title}
              description={`${session.materials?.length || 0} materials • ${session.featuresUsed?.length || 0} tools used`}
              icon={BookOpen}
              progress={session.status === 'completed' ? 100 : session.status === 'active' ? 75 : 45}
              status={session.status}
              lastActivity={new Date(session.createdAt).toLocaleDateString()}
              studyTime={`${session.timeSpent} hours`}
              onClick={() => setSelectedWorkflow(selectedWorkflow === session.id ? null : session.id)}
              onContinue={() => handleContinueWorkflow(session)}
              className={selectedWorkflow === session.id ? 'ring-2 ring-pulse-500' : ''}
            >
              {selectedWorkflow === session.id && (
                <div className="mt-4 p-4 bg-pulse-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {session.featuresUsed?.map((feature: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs capitalize">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {session.materials?.length || 0} materials • Created {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </SessionCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyWorkflows;
