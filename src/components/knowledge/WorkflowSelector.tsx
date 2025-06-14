
import React, { useState } from 'react';
import { Plus, X, Search, Target, Workflow, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWorkflowData, useCreateWorkflow } from '@/hooks/useDatabase';
import { MaterialDisplay } from '@/types/api';
import { toast } from 'sonner';

interface WorkflowSelectorProps {
  isOpen: boolean;
  material: MaterialDisplay | null;
  onClose: () => void;
}

const WorkflowSelector = ({ isOpen, material, onClose }: WorkflowSelectorProps) => {
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newWorkflowTitle, setNewWorkflowTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: workflowData } = useWorkflowData();
  const createWorkflow = useCreateWorkflow();

  const existingWorkflows = workflowData?.recentWorkflowSessions?.filter(w => 
    w.status === 'active' || w.status === 'paused'
  ) || [];

  const filteredWorkflows = existingWorkflows.filter(workflow =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToExistingWorkflow = async (workflowId: string, workflowTitle: string) => {
    if (!material) return;
    
    try {
      // Here you would call an API to add the material to the existing workflow
      // For now, we'll simulate this with a delay and success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`"${material.title}" has been added to "${workflowTitle}"`);
      onClose();
    } catch (error) {
      toast.error('Failed to add material to workflow. Please try again.');
      console.error('Error adding material to workflow:', error);
    }
  };

  const handleCreateNewWorkflow = async () => {
    if (!material || !newWorkflowTitle.trim()) return;
    
    try {
      await createWorkflow.mutateAsync({
        title: newWorkflowTitle,
        materialIds: [material.id]
      });
      
      toast.success(`New workflow "${newWorkflowTitle}" created with "${material.title}"`);
      setNewWorkflowTitle('');
      setShowCreateNew(false);
      onClose();
    } catch (error) {
      toast.error('Failed to create workflow. Please try again.');
      console.error('Error creating workflow:', error);
    }
  };

  if (!isOpen || !material) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add to Workflow</h2>
              <p className="text-sm text-gray-600 mt-1">Add "{material.title}" to a workflow</p>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {!showCreateNew ? (
            <>
              {/* Search Existing Workflows */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Existing Workflows</h3>
                  <Button
                    onClick={() => setShowCreateNew(true)}
                    size="sm"
                    className="bg-pulse-500 hover:bg-pulse-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </Button>
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search workflows..."
                    className="pl-10"
                  />
                </div>

                {/* Workflow List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {filteredWorkflows.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {existingWorkflows.length === 0 
                        ? "No active workflows found. Create a new one to get started."
                        : "No workflows match your search."
                      }
                    </div>
                  ) : (
                    filteredWorkflows.map((workflow) => (
                      <div
                        key={workflow.id}
                        onClick={() => handleAddToExistingWorkflow(workflow.id, workflow.title)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-pulse-500 to-orange-600 rounded-lg flex items-center justify-center">
                              <Target className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{workflow.title}</h4>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Workflow className="h-3 w-3 mr-1" />
                                  {workflow.materials.length} materials
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {workflow.timeSpent}h spent
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {workflow.featuresUsed.slice(0, 2).map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {workflow.featuresUsed.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{workflow.featuresUsed.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={workflow.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {workflow.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Create New Workflow Form */
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowCreateNew(false)}
                  variant="ghost"
                  size="sm"
                >
                  ← Back
                </Button>
                <h3 className="text-lg font-medium text-gray-900">Create New Workflow</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Title
                </label>
                <Input
                  value={newWorkflowTitle}
                  onChange={(e) => setNewWorkflowTitle(e.target.value)}
                  placeholder="Enter workflow title..."
                  className="w-full"
                  autoFocus
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Material to be added:</h4>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {material.type === 'pdf' ? '📄' :
                     material.type === 'docx' ? '📝' :
                     material.type === 'audio' ? '🎵' :
                     material.type === 'video' ? '🎥' : '📁'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{material.title}</p>
                    <p className="text-sm text-gray-500 capitalize">{material.type}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {showCreateNew 
                ? "This will create a new workflow with the selected material"
                : "Select a workflow to add this material to"
              }
            </p>
            <div className="flex space-x-3">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              {showCreateNew && (
                <Button
                  onClick={handleCreateNewWorkflow}
                  disabled={!newWorkflowTitle.trim() || createWorkflow.isPending}
                  className="bg-pulse-500 hover:bg-pulse-600"
                >
                  {createWorkflow.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Workflow'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSelector;
