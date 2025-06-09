
import React, { useState } from 'react';
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
  Tag as TagIcon,
  Send
} from 'lucide-react';
import { MaterialDisplay } from '@/types/api';

interface MaterialViewerProps {
  material: MaterialDisplay;
  onBack: () => void;
}

const MaterialViewer = ({ material, onBack }: MaterialViewerProps) => {
  const [activeTab, setActiveTab] = useState('viewer');
  const [chatInput, setChatInput] = useState('');

  const tools = [
    { id: 'viewer', label: 'Raw File', icon: Eye, description: 'View original material' },
    { id: 'summary', label: 'Summary', icon: FileText, description: 'AI-generated summary' },
    { id: 'mindmap', label: 'Mind Map', icon: Network, description: 'Visual concept map' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, description: 'Test your knowledge' },
    { id: 'chatbot', label: 'AI Chatbot', icon: Brain, description: 'Ask questions about this material' }
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

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      console.log('Sending message:', chatInput);
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-3xl">{getFileTypeIcon(safeFileType)}</span>
              <h1 className="text-3xl font-bold text-gray-900">{material?.title || 'Untitled'}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="capitalize bg-white/60 backdrop-blur-sm">
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
        
        <div className="flex space-x-3">
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button className="bg-gradient-to-r from-pulse-500 to-pink-500 hover:from-pulse-600 hover:to-pink-600 text-white shadow-lg">
            Add to Workflow
          </Button>
        </div>
      </div>

      {/* Material Info Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Material Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {(material?.tags || []).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm bg-gradient-to-r from-pulse-100 to-pink-100 text-pulse-700 border-pulse-200">
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Key Topics</h4>
            <ul className="space-y-2">
              {(material?.headings || []).map((heading, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-pulse-500 to-pink-500 rounded-full mr-3"></span>
                  {heading}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-400px)]">
        {/* Left Side - Raw File Display */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-100/50">
            <h3 className="text-xl font-semibold text-gray-900">Display Raw File</h3>
          </div>
          <div className="p-8 h-full flex flex-col items-center justify-center text-center">
            <div className="text-8xl mb-6">{getFileTypeIcon(safeFileType)}</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{material?.title || 'Untitled'}</h3>
            <p className="text-gray-600 mb-6">
              {safeFileType.toUpperCase()} • Uploaded {new Date(safeCreatedAt).toLocaleDateString()}
            </p>
            <Button className="bg-gradient-to-r from-pulse-500 to-pink-500 hover:from-pulse-600 hover:to-pink-600 text-white shadow-lg">
              Open {safeFileType.toUpperCase()}
            </Button>
          </div>
        </div>

        {/* Right Side - AI Tools */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl shadow-xl border border-white/20 overflow-hidden text-white">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-5 bg-white/20 backdrop-blur-sm">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <TabsTrigger 
                      key={tool.id} 
                      value={tool.id}
                      className="flex flex-col items-center p-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/80"
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      <span className="text-xs">{tool.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <div className="mt-6 h-[calc(100%-80px)]">
                {tools.map((tool) => (
                  <TabsContent key={tool.id} value={tool.id} className="h-full">
                    {tool.id === 'chatbot' ? (
                      <div className="h-full flex flex-col">
                        <div className="flex-1 p-6 text-center">
                          <h3 className="text-2xl font-bold mb-4">AI Chatbot</h3>
                          <p className="text-white/80 mb-8">
                            This is where the placeholder for the chatbot, quiz, summary will show
                          </p>
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left">
                            <p className="text-sm text-white/70 mb-2">AI Assistant:</p>
                            <p className="text-white">How can I help you understand this material better?</p>
                          </div>
                        </div>
                        
                        {/* Chat Input */}
                        <div className="p-4 bg-white/10 backdrop-blur-sm">
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Ask Anything..."
                              className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button
                              onClick={handleSendMessage}
                              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 p-3 rounded-full shadow-lg"
                            >
                              <Send className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <tool.icon className="h-16 w-16 text-white/80 mb-6" />
                        <h3 className="text-2xl font-bold mb-4">{tool.label}</h3>
                        <p className="text-white/80 mb-8">{tool.description}</p>
                        <Button className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white">
                          Generate {tool.label}
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialViewer;
