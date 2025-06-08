
import React, { useState } from 'react';
import { Plus, X, Search, FileText, Headphones, Video, File, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMaterials } from '@/hooks/useDatabase';
import { MaterialDisplay } from '@/types/api';

interface WorkflowCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkflow: (title: string, selectedMaterials: MaterialDisplay[]) => void;
}

const WorkflowCreator = ({ isOpen, onClose, onCreateWorkflow }: WorkflowCreatorProps) => {
  const [workflowTitle, setWorkflowTitle] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: materialsData } = useMaterials();

  const getTypeIcon = (type: MaterialDisplay['type']) => {
    switch (type) {
      case 'pdf':
      case 'docx':
        return FileText;
      case 'audio':
        return Headphones;
      case 'video':
        return Video;
      default:
        return File;
    }
  };

  const filteredMaterials = materialsData?.materials?.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

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

  const handleCreateWorkflow = () => {
    if (workflowTitle.trim() && selectedMaterials.length > 0) {
      onCreateWorkflow(workflowTitle, selectedMaterials);
      // Reset form
      setWorkflowTitle('');
      setSelectedMaterials([]);
      onClose();
    }
  };

  const renderWorkflowGraph = () => {
    if (selectedMaterials.length === 0) return null;

    const nodeWidth = 120;
    const nodeHeight = 60;
    const spacing = 150;
    const totalWidth = Math.max(400, selectedMaterials.length * spacing);
    const totalHeight = 300;

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Workflow Structure</h3>
        <div className="overflow-x-auto">
          <svg width={totalWidth} height={totalHeight} className="border border-gray-200 rounded bg-white">
            {/* Render connections between materials */}
            {selectedMaterials.map((_, index) => {
              if (index === selectedMaterials.length - 1) return null;
              const x1 = 60 + index * spacing + nodeWidth;
              const x2 = 60 + (index + 1) * spacing;
              const y = totalHeight / 2;
              
              return (
                <line
                  key={`connection-${index}`}
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="#6366f1"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

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
                  fill="#6366f1"
                />
              </marker>
            </defs>

            {/* Render material nodes */}
            {selectedMaterials.map((material, index) => {
              const x = 60 + index * spacing;
              const y = totalHeight / 2 - nodeHeight / 2;
              const Icon = getTypeIcon(material.type);
              
              return (
                <g key={material.id}>
                  {/* Node background */}
                  <rect
                    x={x}
                    y={y}
                    width={nodeWidth}
                    height={nodeHeight}
                    rx="8"
                    fill="#f8fafc"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  
                  {/* Node content */}
                  <foreignObject x={x + 8} y={y + 8} width={nodeWidth - 16} height={nodeHeight - 16}>
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Icon className="h-4 w-4 text-pulse-600 mb-1" />
                      <span className="text-xs font-medium text-gray-900 truncate w-full">
                        {material.title}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Start and end nodes */}
            <g>
              <circle cx="30" cy={totalHeight / 2} r="15" fill="#10b981" />
              <text x="30" y={totalHeight / 2 + 4} textAnchor="middle" className="fill-white text-xs font-medium">
                Start
              </text>
            </g>
            
            <g>
              <circle cx={totalWidth - 30} cy={totalHeight / 2} r="15" fill="#ef4444" />
              <text x={totalWidth - 30} y={totalHeight / 2 + 4} textAnchor="middle" className="fill-white text-xs font-medium">
                End
              </text>
            </g>

            {/* Connection lines to start/end */}
            {selectedMaterials.length > 0 && (
              <>
                <line
                  x1="45"
                  y1={totalHeight / 2}
                  x2="60"
                  y2={totalHeight / 2}
                  stroke="#10b981"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-start)"
                />
                <line
                  x1={60 + (selectedMaterials.length - 1) * spacing + nodeWidth}
                  y1={totalHeight / 2}
                  x2={totalWidth - 45}
                  y2={totalHeight / 2}
                  stroke="#ef4444"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-end)"
                />
              </>
            )}

            {/* Additional arrow markers */}
            <defs>
              <marker id="arrowhead-start" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
              </marker>
              <marker id="arrowhead-end" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create New Workflow</h2>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Workflow Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Title
            </label>
            <Input
              value={workflowTitle}
              onChange={(e) => setWorkflowTitle(e.target.value)}
              placeholder="Enter workflow title..."
              className="w-full"
            />
          </div>

          {/* Material Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Materials ({selectedMaterials.length} selected)
            </label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search materials..."
                className="pl-10"
              />
            </div>

            {/* Selected Materials */}
            {selectedMaterials.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Materials:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterials.map((material) => (
                    <Badge
                      key={material.id}
                      variant="default"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {material.title}
                      <button
                        onClick={() => handleMaterialToggle(material)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Available Materials */}
            <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
              {filteredMaterials.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No materials found. Upload some materials first.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredMaterials.map((material) => {
                    const Icon = getTypeIcon(material.type);
                    const isSelected = selectedMaterials.some(m => m.id === material.id);
                    
                    return (
                      <div
                        key={material.id}
                        onClick={() => handleMaterialToggle(material)}
                        className={`p-3 cursor-pointer transition-colors ${
                          isSelected ? 'bg-pulse-50 border-l-4 border-pulse-500' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-pulse-600' : 'text-gray-400'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${isSelected ? 'text-pulse-900' : 'text-gray-900'}`}>
                              {material.title}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="inline-flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {material.studyTime}h study time
                              </span>
                              <span className="text-xs text-gray-500">
                                {material.file_type?.toUpperCase() || 'FILE'}
                              </span>
                            </div>
                            {material.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {material.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    <Tag className="h-2 w-2 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                                {material.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{material.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Workflow Visualization */}
          {renderWorkflowGraph()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedMaterials.length} material{selectedMaterials.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex space-x-3">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleCreateWorkflow}
                disabled={!workflowTitle.trim() || selectedMaterials.length === 0}
                className="bg-pulse-500 hover:bg-pulse-600"
              >
                Create Workflow
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCreator;
