
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Brain, 
  Network, 
  HelpCircle, 
  Eye, 
  ArrowLeft,
  Download,
  Clock,
  Tag as TagIcon
} from 'lucide-react';
import { MaterialDisplay } from '@/types/api';

interface MaterialViewerProps {
  material: MaterialDisplay;
  onBack: () => void;
}

const MaterialViewer = ({ material, onBack }: MaterialViewerProps) => {
  const [activeTab, setActiveTab] = useState('viewer');

  const tools = [
    { id: 'viewer', label: 'Raw File', icon: Eye, description: 'View original material' },
    { id: 'summary', label: 'Summary', icon: FileText, description: 'AI-generated summary' },
    { id: 'mindmap', label: 'Mind Map', icon: Network, description: 'Visual concept map' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, description: 'Test your knowledge' },
    { id: 'chatbot', label: 'Q&A', icon: Brain, description: 'Ask questions about this material' }
  ];

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'audio': return '🎵';
      case 'video': return '🎥';
      default: return '📁';
    }
  };

  // Safe access to material properties with fallbacks
  const safeFileType = material?.file_type || material?.type || 'other';
  const safeStudyTime = material?.study_time || material?.studyTime || 0;
  const safeUsedInWorkflow = material?.usedInWorkflow || false;
  const safeCreatedAt = material?.created_at || material?.uploadedAt || new Date().toISOString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl">{getFileTypeIcon(safeFileType)}</span>
              <h1 className="text-2xl font-bold text-gray-900">{material?.title || 'Untitled'}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="capitalize">
                {safeFileType}
              </Badge>
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{safeStudyTime}h study time</span>
              </div>
              <Badge className={safeUsedInWorkflow ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {safeUsedInWorkflow ? 'In Workflow' : 'Standalone'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button className="bg-pulse-500 hover:bg-pulse-600">
            Add to Workflow
          </Button>
        </div>
      </div>

      {/* Material Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Material Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {(material?.tags || []).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Topics</h4>
              <ul className="space-y-1">
                {(material?.headings || []).map((heading, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-pulse-500 rounded-full mr-2"></span>
                    {heading}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Study Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <TabsTrigger 
                    key={tool.id} 
                    value={tool.id}
                    className="flex flex-col items-center p-3"
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{tool.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6">
              {tools.map((tool) => (
                <TabsContent key={tool.id} value={tool.id} className="space-y-4">
                  {tool.id === 'viewer' ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <div className="text-6xl mb-4">{getFileTypeIcon(safeFileType)}</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{material?.title || 'Untitled'}</h3>
                      <p className="text-gray-600 mb-4">
                        {safeFileType.toUpperCase()} • Uploaded {new Date(safeCreatedAt).toLocaleDateString()}
                      </p>
                      <Button className="bg-pulse-500 hover:bg-pulse-600">
                        Open {safeFileType.toUpperCase()}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <tool.icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{tool.label}</h3>
                      <p className="text-gray-600 mb-4">{tool.description}</p>
                      <Button className="bg-pulse-500 hover:bg-pulse-600">
                        Generate {tool.label}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialViewer;
