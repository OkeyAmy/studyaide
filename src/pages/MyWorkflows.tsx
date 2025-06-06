
import React, { useState } from 'react';
import { Play, Clock, BookOpen, Plus, TrendingUp, Pause, CheckCircle, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SessionCard from '@/components/shared/SessionCard';
import StatsGrid from '@/components/shared/StatsGrid';
import { Badge } from '@/components/ui/badge';

const MyWorkflows = () => {
  const navigate = useNavigate();
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);

  const stats = [
    {
      label: 'Total Workflows',
      value: 12,
      icon: BookOpen,
      color: 'bg-blue-500',
      trend: '+3 this week',
      trendDirection: 'up' as const
    },
    {
      label: 'Active Sessions',
      value: 5,
      icon: Play,
      color: 'bg-green-500',
      trend: '2 in progress',
      trendDirection: 'neutral' as const
    },
    {
      label: 'Completed',
      value: 3,
      icon: CheckCircle,
      color: 'bg-purple-500',
      trend: 'This week',
      trendDirection: 'up' as const
    },
    {
      label: 'Study Hours',
      value: '24.5h',
      icon: Clock,
      color: 'bg-orange-500',
      trend: '+5.2h vs last week',
      trendDirection: 'up' as const
    }
  ];

  const recentWorkflows = [
    {
      id: 1,
      title: "Psychology 101 - Learning Theories",
      description: "Exploring behaviorism, cognitivism, and constructivism theories",
      lastModified: "2 hours ago",
      progress: 75,
      studyMaterials: 12,
      status: "active" as const,
      timeSpent: "4.5 hours",
      nextSession: "Cognitive Load Theory"
    },
    {
      id: 2,
      title: "Advanced Mathematics - Calculus",
      description: "Differential and integral calculus fundamentals",
      lastModified: "1 day ago",
      progress: 45,
      studyMaterials: 8,
      status: "paused" as const,
      timeSpent: "3.2 hours",
      nextSession: "Integration by Parts"
    },
    {
      id: 3,
      title: "History - World War II",
      description: "European theater and Pacific campaigns analysis",
      lastModified: "3 days ago",
      progress: 90,
      studyMaterials: 15,
      status: "completed" as const,
      timeSpent: "7.8 hours",
      nextSession: "Final Review"
    }
  ];

  const handleContinueWorkflow = (workflowId: number) => {
    navigate('/study-session', { state: { workflowId } });
  };

  const handleCreateNew = () => {
    navigate('/study-session');
  };

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
          {recentWorkflows.map((workflow) => (
            <SessionCard
              key={workflow.id}
              title={workflow.title}
              description={workflow.description}
              icon={BookOpen}
              progress={workflow.progress}
              status={workflow.status}
              lastActivity={workflow.lastModified}
              studyTime={workflow.timeSpent}
              onClick={() => setSelectedWorkflow(selectedWorkflow === workflow.id ? null : workflow.id)}
              onContinue={() => handleContinueWorkflow(workflow.id)}
              className={selectedWorkflow === workflow.id ? 'ring-2 ring-pulse-500' : ''}
            >
              {selectedWorkflow === workflow.id && (
                <div className="mt-4 p-4 bg-pulse-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Next Session</h4>
                  <p className="text-sm text-gray-600 mb-3">{workflow.nextSession}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {workflow.studyMaterials} materials
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {workflow.status}
                    </Badge>
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
