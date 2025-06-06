
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  FileText, 
  Network, 
  MessageSquare, 
  Eye, 
  Clock, 
  Play, 
  Pause,
  CheckCircle,
  ArrowLeft,
  Download
} from 'lucide-react';
import { WorkflowSession, Material } from '@/types/api';
import { mockMaterialData } from '@/data/mockApi';

interface WorkflowSessionViewProps {
  session: WorkflowSession;
  onBack: () => void;
}

const WorkflowSessionView = ({ session, onBack }: WorkflowSessionViewProps) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  // Get materials for this session
  const sessionMaterials = mockMaterialData.materials.filter(
    material => session.materials.includes(material.id)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const features = [
    { id: 'summary', label: 'Summary', icon: FileText, description: 'AI-generated summaries' },
    { id: 'mindmap', label: 'Mind Map', icon: Network, description: 'Visual concept mapping' },
    { id: 'quiz', label: 'Quiz', icon: Brain, description: 'Interactive testing' },
    { id: 'chatbot', label: 'ChatBot', icon: MessageSquare, description: 'AI Q&A assistant' },
    { id: 'viewer', label: 'Raw Files', icon: Eye, description: 'Original materials' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-2">
                {getStatusIcon(session.status)}
                <Badge className={getStatusColor(session.status)}>
                  {session.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{session.timeSpent}h studied</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Session
          </Button>
          <Button className="bg-pulse-500 hover:bg-pulse-600">
            Continue Session
          </Button>
        </div>
      </div>

      {/* Materials Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionMaterials.map((material) => (
              <div key={material.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 truncate">{material.title}</h4>
                  <Badge variant="outline" className="text-xs capitalize">
                    {material.type}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
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
                <p className="text-xs text-gray-500">{material.studyTime}h study time</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Learning Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isAvailable = session.featuresUsed.includes(feature.id as any) || feature.id === 'viewer';
                return (
                  <TabsTrigger 
                    key={feature.id} 
                    value={feature.id}
                    disabled={!isAvailable}
                    className="flex flex-col items-center p-3"
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{feature.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6">
              {features.map((feature) => (
                <TabsContent key={feature.id} value={feature.id} className="space-y-4">
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <feature.icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.label}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    {session.featuresUsed.includes(feature.id as any) || feature.id === 'viewer' ? (
                      <Button className="bg-pulse-500 hover:bg-pulse-600">
                        Open {feature.label}
                      </Button>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Not available for this session
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowSessionView;
