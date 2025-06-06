
import React, { useState } from 'react';
import { Play, Clock, BookOpen, Plus, TrendingUp, Pause, CheckCircle, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SessionCard from '@/components/shared/SessionCard';
import StatsGrid from '@/components/shared/StatsGrid';
import WorkflowSessionView from '@/components/workflow/WorkflowSessionView';
import { Badge } from '@/components/ui/badge';
import { mockWorkflowData } from '@/data/mockApi';
import { WorkflowSession } from '@/types/api';

const MyWorkflows = () => {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<WorkflowSession | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);

  const stats = [
    {
      label: 'Total Workflows',
      value: mockWorkflowData.totalWorkflows,
      icon: BookOpen,
      color: 'bg-blue-500',
      trend: '+3 this week',
      trendDirection: 'up' as const
    },
    {
      label: 'Active Sessions',
      value: mockWorkflowData.activeSessions,
      icon: Play,
      color: 'bg-green-500',
      trend: '2 in progress',
      trendDirection: 'neutral' as const
    },
    {
      label: 'Completed',
      value: mockWorkflowData.completedWorkflows,
      icon: CheckCircle,
      color: 'bg-purple-500',
      trend: 'This week',
      trendDirection: 'up' as const
    },
    {
      label: 'Study Hours',
      value: `${mockWorkflowData.studyHours}h`,
      icon: Clock,
      color: 'bg-orange-500',
      trend: '+5.2h vs last week',
      trendDirection: 'up' as const
    }
  ];

  const handleContinueWorkflow = (session: WorkflowSession) => {
    setSelectedSession(session);
  };

  const handleCreateNew = () => {
    navigate('/study-session');
  };

  const handleBackToList = () => {
    setSelectedSession(null);
  };

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
          {mockWorkflowData.recentWorkflowSessions.map((session) => (
            <SessionCard
              key={session.id}
              title={session.title}
              description={`${session.materials.length} materials • ${session.featuresUsed.length} tools used`}
              icon={BookOpen}
              progress={session.status === 'completed' ? 100 : session.status === 'active' ? 75 : 45}
              status={session.status}
              lastActivity={new Date(session.createdAt).toLocaleDateString()}
              studyTime={`${session.timeSpent} hours`}
              onClick={() => setSelectedWorkflow(selectedWorkflow === parseInt(session.id.split('_')[1]) ? null : parseInt(session.id.split('_')[1]))}
              onContinue={() => handleContinueWorkflow(session)}
              className={selectedWorkflow === parseInt(session.id.split('_')[1]) ? 'ring-2 ring-pulse-500' : ''}
            >
              {selectedWorkflow === parseInt(session.id.split('_')[1]) && (
                <div className="mt-4 p-4 bg-pulse-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {session.featuresUsed.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs capitalize">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {session.materials.length} materials • Created {new Date(session.createdAt).toLocaleDateString()}
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
