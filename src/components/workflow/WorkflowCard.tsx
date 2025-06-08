
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Headphones, 
  Video, 
  File, 
  Clock, 
  Edit, 
  Trash2, 
  Tag as TagIcon, 
  Plus,
  Brain,
  Network,
  MessageSquare,
  MoreHorizontal,
  X,
  Check
} from 'lucide-react';

interface Material {
  id: string;
  title: string;
  type: string;
}

interface Workflow {
  id: string;
  title: string;
  description: string;
  materials: Material[];
  timeSpent: string;
  lastActivity: string;
  tags: string[];
  hasComponents: {
    summary: boolean;
    quiz: boolean;
    mindMap: boolean;
    chatbot: boolean;
  };
}

interface WorkflowCardProps {
  workflow: Workflow;
  onMaterialClick: (materialId: string) => void;
  onDelete: (workflowId: string) => void;
  onRename: (workflowId: string, newTitle: string) => void;
  onAddTag: (workflowId: string, tag: string) => void;
  onRemoveTag: (workflowId: string, tag: string) => void;
  onAddComponent: (workflowId: string, componentType: string) => void;
}

const WorkflowCard = ({
  workflow,
  onMaterialClick,
  onDelete,
  onRename,
  onAddTag,
  onRemoveTag,
  onAddComponent
}: WorkflowCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(workflow.title);
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
        return FileText;
      case 'audio':
      case 'mp3':
        return Headphones;
      case 'video':
      case 'mp4':
        return Video;
      default:
        return File;
    }
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== workflow.title) {
      onRename(workflow.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !workflow.tags.includes(newTag.trim())) {
      onAddTag(workflow.id, newTag.trim());
      setNewTag('');
      setShowAddTag(false);
    }
  };

  const components = [
    { 
      key: 'summary', 
      label: 'Summary', 
      icon: FileText, 
      color: 'text-blue-600',
      available: workflow.hasComponents.summary 
    },
    { 
      key: 'quiz', 
      label: 'Quiz', 
      icon: Brain, 
      color: 'text-purple-600',
      available: workflow.hasComponents.quiz 
    },
    { 
      key: 'mindMap', 
      label: 'Mind Map', 
      icon: Network, 
      color: 'text-green-600',
      available: workflow.hasComponents.mindMap 
    },
    { 
      key: 'chatbot', 
      label: 'Chatbot', 
      icon: MessageSquare, 
      color: 'text-orange-600',
      available: workflow.hasComponents.chatbot 
    }
  ];

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-lg font-semibold"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
                />
                <Button size="sm" onClick={handleSaveTitle}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg font-semibold">{workflow.title}</CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsEditing(true)}
                  className="p-1 h-6 w-6"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="p-2"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {showMoreOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-1">
                  <button
                    onClick={() => {
                      onDelete(workflow.id);
                      setShowMoreOptions(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-red-50 rounded-md transition-colors text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Workflow</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Time Information */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Total: {workflow.timeSpent}</span>
          </div>
          <span className="text-gray-500">Last activity: {workflow.lastActivity}</span>
        </div>

        {/* Materials Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">Materials ({workflow.materials.length})</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddComponent(workflow.id, 'material')}
              className="text-xs h-6 px-2"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-1">
            {workflow.materials.map((material) => {
              const Icon = getTypeIcon(material.type);
              return (
                <button
                  key={material.id}
                  onClick={() => onMaterialClick(material.id)}
                  className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-md transition-colors text-sm"
                >
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{material.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Components Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Study Components</h4>
          <div className="grid grid-cols-2 gap-2">
            {components.map((component) => {
              const Icon = component.icon;
              return (
                <div key={component.key} className="flex items-center justify-between">
                  <div className={`flex items-center space-x-2 ${component.available ? component.color : 'text-gray-400'}`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{component.label}</span>
                  </div>
                  {!component.available && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddComponent(workflow.id, component.key)}
                      className="text-xs h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">Tags</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddTag(!showAddTag)}
              className="text-xs h-6 px-2"
            >
              <TagIcon className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          
          {showAddTag && (
            <div className="flex items-center space-x-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter tag..."
                className="text-xs h-6"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button size="sm" onClick={handleAddTag} className="h-6 px-2">
                <Check className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1">
            {workflow.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => onRemoveTag(workflow.id, tag)}
                  className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Click outside to close more options */}
      {showMoreOptions && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setShowMoreOptions(false)}
        />
      )}
    </Card>
  );
};

export default WorkflowCard;
