
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
import { useWorkflowsData, useMaterialsData } from '@/hooks/useDatabase';

const MyWorkflows = () => {
  const navigate = useNavigate();
  const [showWorkflowCreator, setShowWorkflowCreator] = useState(false);
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);

  // Get data from database
  const { data: workflowData, isLoading: workflowsLoading } = useWorkflowsData();
  const { data: materialData } = useMaterialsData();

  const stats = [
    {
      label: 'Total Workflows',
      value: workflowData?.totalItems || 0,
      icon: Target,
      color: 'bg-gradient-to-r from-pulse-500 to-orange-600',
      trend: '+2 this week',
      trendDirection: 'up' as const
    },
    {
      label: 'Active Sessions',
      value: workflowData?.workflows?.filter(w => w.status === 'active').length || 0,
      icon: Play,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      trend: 'In progress',
      trendDirection: 'up' as const
    },
    {
      label: 'Completed',
      value: workflowData?.workflows?.filter(w => w.status === 'completed').length || 0,
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-purple-500 to-violet-600',
      trend: 'This month',
      trendDirection: 'up' as const
    },
    {
      label: 'Study Hours',
      value: `${workflowData?.workflows?.reduce((acc, w) => acc + (w.time_spent || 0), 0) || 0}h`,
      icon: Clock,
      color: 'bg-gradient-to-r from-pink-500 to-rose-600',
      trend: '+8h this week',
      trendDirection: 'up' as const
    }
  ];

  const handleCreateWorkflow = (title: string, selectedMaterials: MaterialDisplay[]) => {
    console.log('Creating workflow:', title, 'with materials:', selectedMaterials);
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

  if (workflowsLoading) {
    return (
      <AppLayout activeSession="workflows">
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-6">
          <div className="space-y-8">
            <div className="animate-pulse">
              <div className="h-8 bg-white/60 rounded-2xl w-1/3 mb-2"></div>
              <div className="h-4 bg-white/40 rounded-xl w-1/4"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/60 rounded-3xl animate-pulse"></div>)}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeSession="workflows">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Workflows</h1>
              <p className="text-gray-600 text-lg">Manage your learning workflows and track progress</p>
            </div>
            <div className="relative">
              <Button 
                onClick={() => setShowCreateOptions(!showCreateOptions)}
                className="bg-gradient-to-r from-pulse-500 to-orange-600 hover:from-pulse-600 hover:to-orange-700 text-white shadow-lg rounded-2xl px-6 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Workflow
              </Button>
              
              {/* Create Options Dropdown */}
              {showCreateOptions && (
                <div className="absolute right-0 mt-3 w-72 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 z-20 overflow-hidden">
                  <div className="p-3">
                    <button
                      onClick={handleImportFromKnowledge}
                      className="w-full flex items-center space-x-4 px-4 py-4 text-left hover:bg-gradient-to-r hover:from-pulse-50 hover:to-orange-50 rounded-2xl transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FolderOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Import from Knowledge Base</p>
                        <p className="text-sm text-gray-600">Use existing materials</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleStartRecording}
                      className="w-full flex items-center space-x-4 px-4 py-4 text-left hover:bg-gradient-to-r hover:from-pulse-50 hover:to-orange-50 rounded-2xl transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mic className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Start New Recording</p>
                        <p className="text-sm text-gray-600">Record live lecture</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleUploadFile}
                      className="w-full flex items-center space-x-4 px-4 py-4 text-left hover:bg-gradient-to-r hover:from-pulse-50 hover:to-orange-50 rounded-2xl transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Upload New Material</p>
                        <p className="text-sm text-gray-600">Add files to workflow</p>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Recent Workflows</h2>
              <Button variant="outline" size="sm" className="bg-white/70 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-xl">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {(workflowData?.workflows || []).map((workflow) => (
                <div
                  key={workflow.id}
                  className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/80 hover:shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pulse-500 to-orange-600 rounded-2xl flex items-center justify-center">
                          {workflow.status === 'active' ? (
                            <Play className="h-6 w-6 text-white" />
                          ) : workflow.status === 'paused' ? (
                            <Pause className="h-6 w-6 text-white" />
                          ) : (
                            <TrendingUp className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-xl">{workflow.title}</h3>
                          <p className="text-gray-600">Workflow progress tracking</p>
                        </div>
                      </div>
                      <Badge 
                        variant={workflow.status === 'active' ? 'default' : workflow.status === 'completed' ? 'secondary' : 'outline'}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          workflow.status === 'active' 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200' 
                            : workflow.status === 'completed'
                            ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200'
                            : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {workflow.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div className="space-y-2">
                        <span className="text-gray-500 font-medium">Time Spent</span>
                        <p className="font-bold text-lg text-gray-900">{workflow.time_spent || 0}h</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-gray-500 font-medium">Features Used</span>
                        <p className="font-bold text-lg text-gray-900">{workflow.features_used?.length || 0} tools</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(workflow.features_used || []).slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gradient-to-r from-pulse-50 to-orange-50 text-pulse-700 border-pulse-200 rounded-full">
                          {feature}
                        </Badge>
                      ))}
                      {(workflow.features_used?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-pulse-50 to-orange-50 text-pulse-700 border-pulse-200 rounded-full">
                          +{(workflow.features_used?.length || 0) - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-2">
                      {workflow.status !== 'completed' && (
                        <Button
                          onClick={() => handleWorkflowAction(workflow.id, workflow.status === 'active' ? 'pause' : 'play')}
                          disabled={activeWorkflow === workflow.id}
                          className="flex-1 bg-gradient-to-r from-pulse-500 to-orange-600 hover:from-pulse-600 hover:to-orange-700 text-white shadow-lg rounded-2xl"
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
                      <Button variant="outline" size="sm" className="px-4 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-2xl">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                      Updated {new Date(workflow.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!workflowData?.workflows || workflowData.workflows.length === 0) && (
              <div className="text-center py-16">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">No workflows yet</h3>
                  <p className="text-gray-600 mb-6">Create your first learning workflow to get started.</p>
                  <Button 
                    onClick={() => setShowCreateOptions(true)}
                    className="bg-gradient-to-r from-pulse-500 to-orange-600 hover:from-pulse-600 hover:to-orange-700 text-white shadow-lg rounded-2xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Click outside to close dropdown */}
          {showCreateOptions && (
            <div 
              className="fixed inset-0 z-10"
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
      </div>
    </AppLayout>
  );
};

export default MyWorkflows;
