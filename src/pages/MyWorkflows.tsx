import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Plus, Play, Pause, MoreHorizontal, Clock, Users, TrendingUp, Target, Mic, Upload, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsGrid from '@/components/shared/StatsGrid';
import SessionCard from '@/components/shared/SessionCard';
import WorkflowCreator from '@/components/workflow/WorkflowCreator';
import { MaterialDisplay } from '@/types/api';

const MyWorkflows = () => {
  const navigate = useNavigate();
  const [showWorkflowCreator, setShowWorkflowCreator] = useState(false);
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);

  const stats = [
    {
      label: 'Total Workflows',
      value: 12,
      icon: Target,
      color: 'bg-blue-500',
      trend: '+2 this week',
      trendDirection: 'up' as const
    },
    {
      label: 'Active Sessions',
      value: 3,
      icon: Play,
      color: 'bg-green-500',
      trend: 'In progress',
      trendDirection: 'up' as const
    },
    {
      label: 'Completed',
      value: 9,
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: 'This month',
      trendDirection: 'up' as const
    },
    {
      label: 'Study Hours',
      value: '42h',
      icon: Clock,
      color: 'bg-orange-500',
      trend: '+8h this week',
      trendDirection: 'up' as const
    }
  ];

  const workflows = [
    {
      id: '1',
      title: 'Deep Learning Fundamentals',
      description: 'Complete course on neural networks and deep learning',
      status: 'active' as const,
      progress: 68,
      materials: 5,
      timeSpent: '12h 30m',
      lastActivity: '2 hours ago',
      estimatedCompletion: '3 days',
      tags: ['AI', 'Machine Learning', 'Deep Learning']
    },
    {
      id: '2',
      title: 'Data Structures and Algorithms',
      description: 'Comprehensive study of DSA concepts',
      status: 'completed' as const,
      progress: 100,
      materials: 8,
      timeSpent: '24h 15m',
      lastActivity: '1 week ago',
      estimatedCompletion: 'Completed',
      tags: ['Computer Science', 'Algorithms', 'Programming']
    },
    {
      id: '3',
      title: 'Quantum Physics Basics',
      description: 'Introduction to quantum mechanics principles',
      status: 'active' as const,
      progress: 45,
      materials: 6,
      timeSpent: '8h 45m',
      lastActivity: '1 day ago',
      estimatedCompletion: '1 week',
      tags: ['Physics', 'Quantum Mechanics', 'Science']
    },
    {
      id: '4',
      title: 'Web Development Bootcamp',
      description: 'Full-stack web development learning path',
      status: 'paused' as const,
      progress: 32,
      materials: 12,
      timeSpent: '18h 20m',
      lastActivity: '3 days ago',
      estimatedCompletion: '2 weeks',
      tags: ['Web Development', 'JavaScript', 'React']
    }
  ];

  const handleCreateWorkflow = (title: string, selectedMaterials: MaterialDisplay[]) => {
    console.log('Creating workflow:', title, 'with materials:', selectedMaterials);
    // Here you would typically save the workflow to your backend
    setShowWorkflowCreator(false);
    setShowCreateOptions(false);
  };

  const handleWorkflowAction = (workflowId: string, action: 'play' | 'pause') => {
    if (action === 'play') {
      setActiveWorkflow(workflowId);
      setTimeout(() => {
        setActiveWorkflow(null);
        alert(`Workflow ${workflowId} started successfully!`);
      }, 2000);
    } else {
      console.log(`Pausing workflow ${workflowId}`);
    }
  };

  const handleStartRecording = () => {
    navigate('/study-session');
  };

  const handleUploadFile = () => {
    navigate('/study-session');
  };

  const handleImportFromKnowledge = () => {
    setShowCreateOptions(false);
    setShowWorkflowCreator(true);
  };

  return (
    <AppLayout activeSession="workflows">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Workflows</h1>
            <p className="text-gray-600">Manage your learning workflows and track progress</p>
          </div>
          <div className="relative">
            <Button 
              onClick={() => setShowCreateOptions(!showCreateOptions)}
              className="bg-pulse-500 hover:bg-pulse-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
            
            {/* Create Options Dropdown */}
            {showCreateOptions && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  <button
                    onClick={handleImportFromKnowledge}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Import from Knowledge Base</p>
                      <p className="text-sm text-gray-500">Use existing materials</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleStartRecording}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Mic className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Start New Recording</p>
                      <p className="text-sm text-gray-500">Record live lecture</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleUploadFile}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Upload className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Upload New Material</p>
                      <p className="text-sm text-gray-500">Add files to workflow</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <StatsGrid stats={stats} />

        {/* Workflows Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Workflows</h2>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workflows.map((workflow) => (
              <SessionCard
                key={workflow.id}
                title={workflow.title}
                description={workflow.description}
                icon={workflow.status === 'active' ? Play : workflow.status === 'paused' ? Pause : TrendingUp}
                lastActivity={workflow.lastActivity}
                className="relative"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={
                        workflow.status === 'active' ? 'default' : 
                        workflow.status === 'completed' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {workflow.status}
                    </Badge>
                    <span className="text-sm text-gray-500">{workflow.timeSpent}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{workflow.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pulse-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Materials</span>
                      <p className="font-medium">{workflow.materials} items</p>
                    </div>
                    <div>
                      <span className="text-gray-500">ETA</span>
                      <p className="font-medium">{workflow.estimatedCompletion}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {workflow.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {workflow.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{workflow.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    {workflow.status !== 'completed' && (
                      <Button
                        onClick={() => handleWorkflowAction(workflow.id, workflow.status === 'active' ? 'pause' : 'play')}
                        disabled={activeWorkflow === workflow.id}
                        className="flex-1 bg-pulse-500 hover:bg-pulse-600"
                        size="sm"
                      >
                        {activeWorkflow === workflow.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Starting...
                          </>
                        ) : workflow.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </>
                        )}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="px-3">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SessionCard>
            ))}
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {showCreateOptions && (
          <div 
            className="fixed inset-0 z-0"
            onClick={() => setShowCreateOptions(false)}
          />
        )}

        {/* Workflow Creator Modal */}
        <WorkflowCreator
          isOpen={showWorkflowCreator}
          onClose={() => setShowWorkflowCreator(false)}
          onCreateWorkflow={handleCreateWorkflow}
        />
      </div>
    </AppLayout>
  );
};

export default MyWorkflows;
