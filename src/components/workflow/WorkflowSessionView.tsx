
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
  Download,
  Upload,
  Mic,
  Plus
} from 'lucide-react';
import { useMaterialsData } from '@/hooks/useDatabase';

interface WorkflowSessionViewProps {
  session: any;
  onBack: () => void;
}

const WorkflowSessionView = ({ session, onBack }: WorkflowSessionViewProps) => {
  const [activeTab, setActiveTab] = useState('materials');
  const [isInSession, setIsInSession] = useState(false);
  const { data: materialData } = useMaterialsData();
  
  // Get materials for this session
  const sessionMaterials = materialData?.materials?.filter(
    (material: any) => session.materials?.includes(material.id)
  ) || [];

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
    { id: 'materials', label: 'Materials', icon: FileText, description: 'Manage session materials' },
    { id: 'summary', label: 'Summary', icon: FileText, description: 'Combined summary of all materials' },
    { id: 'mindmap', label: 'Mind Map', icon: Network, description: 'Visual concept mapping' },
    { id: 'quiz', label: 'Quiz', icon: Brain, description: 'Interactive testing' },
    { id: 'chatbot', label: 'ChatBot', icon: MessageSquare, description: 'AI Q&A assistant' }
  ];

  const handleContinueSession = () => {
    if (sessionMaterials.length === 0) {
      // If no materials, show material adding interface
      setActiveTab('materials');
    } else {
      // If materials exist, go to summary
      setActiveTab('summary');
      setIsInSession(true);
    }
  };

  const renderMaterialsTab = () => (
    <div className="space-y-6">
      {/* Add Materials Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Materials to Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Upload className="h-6 w-6" />
              <span>Upload Files</span>
              <span className="text-xs text-gray-500">PDF, DOCX, etc.</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Mic className="h-6 w-6" />
              <span>Record Audio</span>
              <span className="text-xs text-gray-500">Live recording</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Plus className="h-6 w-6" />
              <span>Import from KB</span>
              <span className="text-xs text-gray-500">Knowledge Base</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Materials */}
      {sessionMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Materials ({sessionMaterials.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessionMaterials.map((material: any) => (
                <div key={material.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{material.title}</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {material.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {material.tags?.slice(0, 2).map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{material.studyTime}h study time</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSummaryTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Combined Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              This is an AI-generated summary combining all materials in your workflow session.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Key Topics Covered:</h3>
              <ul className="space-y-2">
                <li>• Overview of main concepts from uploaded materials</li>
                <li>• Important definitions and terminology</li>
                <li>• Core principles and methodologies</li>
                <li>• Practical applications and examples</li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>AI Insight:</strong> The materials cover complementary topics that build upon each other. Consider reviewing the mind map for visual connections.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMindMapTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mind Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
            <div>
              <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Mind Map</h3>
              <p className="text-gray-600 mb-4">Visual representation of concepts and relationships</p>
              <div className="text-sm text-gray-500">
                Graph visualization from markdown content would appear here
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuizTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
            <div>
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generated Quiz</h3>
              <p className="text-gray-600 mb-4">Test your knowledge with AI-generated questions</p>
              <Button className="bg-pulse-500 hover:bg-pulse-600">
                Start Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChatbotTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Chatbot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
            <div>
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chat with AI</h3>
              <p className="text-gray-600 mb-4">Ask questions about your materials</p>
              <div className="text-sm text-gray-500">
                Chatbot interface placeholder - ready for AI integration
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
          <Button 
            className="bg-pulse-500 hover:bg-pulse-600"
            onClick={handleContinueSession}
          >
            Continue Session
          </Button>
        </div>
      </div>

      {/* Learning Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isInSession ? 'Active Session' : 'Workflow Setup'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isAvailable = feature.id === 'materials' || sessionMaterials.length > 0;
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
              <TabsContent value="materials">
                {renderMaterialsTab()}
              </TabsContent>
              
              <TabsContent value="summary">
                {renderSummaryTab()}
              </TabsContent>
              
              <TabsContent value="mindmap">
                {renderMindMapTab()}
              </TabsContent>
              
              <TabsContent value="quiz">
                {renderQuizTab()}
              </TabsContent>
              
              <TabsContent value="chatbot">
                {renderChatbotTab()}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowSessionView;
