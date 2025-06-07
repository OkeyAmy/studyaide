
import React, { useState } from 'react';
import { ArrowLeft, Plus, FileText, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMaterialsData, useCreateWorkflow } from '@/hooks/useDatabase';
import { MaterialDisplay } from '@/types/api';
import { toast } from 'sonner';

interface WorkflowCreatorProps {
  onBack: () => void;
  onWorkflowCreated: (workflowId: string) => void;
}

const WorkflowCreator = ({ onBack, onWorkflowCreated }: WorkflowCreatorProps) => {
  const [workflowTitle, setWorkflowTitle] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialDisplay[]>([]);
  const [showMaterialSelector, setShowMaterialSelector] = useState(false);
  
  const { data: materialData, isLoading } = useMaterialsData();
  const createWorkflow = useCreateWorkflow();

  const handleMaterialToggle = (material: MaterialDisplay) => {
    setSelectedMaterials(prev => {
      const isSelected = prev.some(m => m.id === material.id);
      if (isSelected) {
        return prev.filter(m => m.id !== material.id);
      } else {
        return [...prev, material];
      }
    });
  };

  const handleCreateWorkflow = async () => {
    if (!workflowTitle.trim()) {
      toast.error('Please enter a workflow title');
      return;
    }

    try {
      const workflow = await createWorkflow.mutateAsync({
        title: workflowTitle,
        materialIds: selectedMaterials.map(m => m.id)
      });
      
      toast.success('Workflow created successfully!');
      onWorkflowCreated(workflow.id);
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast.error('Failed to create workflow');
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'audio': return '🎵';
      case 'video': return '🎥';
      default: return '📁';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Workflow</h1>
            <p className="text-gray-600">Build your learning journey</p>
          </div>
        </div>
      </div>

      {/* Workflow Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Title
            </label>
            <Input
              placeholder="Enter workflow title..."
              value={workflowTitle}
              onChange={(e) => setWorkflowTitle(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Workflow Graph Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6 min-h-[300px]">
            <svg viewBox="0 0 800 300" className="w-full h-full">
              {/* Start Node */}
              <g transform="translate(50, 150)">
                <circle r="25" className="fill-green-500 stroke-green-600" strokeWidth="2" />
                <text textAnchor="middle" dy="5" className="text-sm font-medium fill-white">
                  Start
                </text>
              </g>

              {/* Material Nodes */}
              {selectedMaterials.map((material, index) => {
                const x = 200 + (index * 150);
                const y = 150;
                return (
                  <g key={material.id} transform={`translate(${x}, ${y})`}>
                    {/* Connection line from previous node */}
                    <line
                      x1={index === 0 ? -125 : -125}
                      y1="0"
                      x2="-25"
                      y2="0"
                      className="stroke-gray-400"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    
                    {/* Material node */}
                    <rect
                      x="-40"
                      y="-20"
                      width="80"
                      height="40"
                      rx="8"
                      className="fill-blue-500 stroke-blue-600"
                      strokeWidth="2"
                    />
                    <text textAnchor="middle" dy="-5" className="text-xs font-medium fill-white">
                      {getFileTypeIcon(material.type)}
                    </text>
                    <text textAnchor="middle" dy="10" className="text-xs font-medium fill-white">
                      Material {index + 1}
                    </text>
                  </g>
                );
              })}

              {/* End Node */}
              {selectedMaterials.length > 0 && (
                <g transform={`translate(${350 + (selectedMaterials.length * 150)}, 150)`}>
                  <line
                    x1="-125"
                    y1="0"
                    x2="-25"
                    y2="0"
                    className="stroke-gray-400"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  <circle r="25" className="fill-purple-500 stroke-purple-600" strokeWidth="2" />
                  <text textAnchor="middle" dy="5" className="text-sm font-medium fill-white">
                    Goal
                  </text>
                </g>
              )}

              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    className="fill-gray-400"
                  />
                </marker>
              </defs>
            </svg>

            {selectedMaterials.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Add materials to see your workflow structure</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Selected Materials ({selectedMaterials.length})
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMaterialSelector(!showMaterialSelector)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showMaterialSelector ? 'Hide Materials' : 'Add Materials'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileTypeIcon(material.type)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{material.title}</h4>
                      <p className="text-sm text-gray-600 capitalize">{material.type}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMaterialToggle(material)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No materials selected yet</p>
              <p className="text-sm">Add materials from your knowledge base to build your workflow</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Material Selector */}
      {showMaterialSelector && (
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base Materials</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materialData?.materials?.map((material) => {
                  const isSelected = selectedMaterials.some(m => m.id === material.id);
                  return (
                    <div
                      key={material.id}
                      onClick={() => handleMaterialToggle(material)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-green-50 border-green-300 ring-2 ring-green-500'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getFileTypeIcon(material.type)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{material.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{material.type}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {material.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {material.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{material.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button
          onClick={handleCreateWorkflow}
          disabled={!workflowTitle.trim() || createWorkflow.isPending}
          className="bg-pulse-500 hover:bg-pulse-600"
        >
          {createWorkflow.isPending ? 'Creating...' : 'Create Workflow'}
        </Button>
      </div>
    </div>
  );
};

export default WorkflowCreator;
