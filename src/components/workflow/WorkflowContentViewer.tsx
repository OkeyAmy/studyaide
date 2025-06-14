import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  FileText, 
  Network, 
  MessageSquare, 
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Play,
  CheckCircle,
  Users,
  Calendar,
  BarChart3,
  Target,
  ChevronRight,
  Layers,
  Send,
  Bot,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowContentViewerProps {
  workflow: any;
  onBack: () => void;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
}

const WorkflowContentViewer = ({ workflow, onBack }: WorkflowContentViewerProps) => {
  const navigate = useNavigate();
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, type: 'ai', message: 'Hi! Ask me anything about your workflow materials!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // The materials are already in the workflow object.
  const workflowMaterials = workflow.materials || [];

  // Auto-select first material if none selected
  React.useEffect(() => {
    if (workflowMaterials.length > 0 && !selectedMaterial) {
      setSelectedMaterial(workflowMaterials[0]);
    }
  }, [workflowMaterials, selectedMaterial]);

  const handleMaterialSelect = (material: any) => {
    setSelectedMaterial(material);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const userMessage: ChatMessage = { id: Date.now(), type: 'user', message: chatInput.trim() };
      setChatMessages(prev => [...prev, userMessage]);
      setChatInput('');
      setIsTyping(true);
      setTimeout(() => {
        const aiMessage: ChatMessage = { id: Date.now() + 1, type: 'ai', message: `Great question about "${selectedMaterial?.title || 'your workflow'}"! Let me analyze that for you...` };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const tools = [
    { id: 'summary', label: 'Summary', icon: FileText, color: 'text-blue-600' },
    { id: 'quiz', label: 'Quiz', icon: CheckCircle, color: 'text-green-600' },
    { id: 'flashcards', label: 'Flashcards', icon: Brain, color: 'text-orange-600' },
    { id: 'mindmap', label: 'Mind Map', icon: Network, color: 'text-purple-600' },
  ];

  const MaterialCard = ({ material, isSelected }: { material: any; isSelected: boolean }) => (
    <div
      onClick={() => handleMaterialSelect(material)}
      className={cn(
        "group p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2",
        isSelected 
          ? "bg-gradient-to-br from-orange-100 to-amber-100 border-orange-300 shadow-lg" 
          : "bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-xl flex items-center justify-center",
          isSelected ? "bg-gradient-to-br from-orange-500 to-amber-500" : "bg-gray-100"
        )}>
          <FileText className={cn("h-5 w-5", isSelected ? "text-white" : "text-gray-600")} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{material.title}</h4>
          <p className="text-sm text-gray-500">{material.file_type} • {material.pages || 0} pages</p>
        </div>
        <ChevronRight className={cn("h-4 w-4 transition-transform", isSelected ? "rotate-90 text-orange-600" : "text-gray-400")} />
      </div>
    </div>
  );

  const StudyToolContent = ({ tool }: { tool: any }) => {
    const savedContent = selectedMaterial?.parsedContent || {};
    
    switch (tool.id) {
      case 'summary':
        return (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <h3 className="font-semibold text-blue-900 mb-3">AI Summary</h3>
              <p className="text-blue-800">
                {savedContent.summary || "Generate an AI-powered summary of this material to get the key insights and main points."}
              </p>
            </div>
            {!savedContent.summary && (
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl">
                <Brain className="h-4 w-4 mr-2" />
                Generate Summary
              </Button>
            )}
          </div>
        );
      case 'quiz':
        return (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <h3 className="font-semibold text-green-900 mb-3">Practice Quiz</h3>
              <p className="text-green-800 mb-4">
                Test your knowledge with AI-generated questions based on this material.
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-white/70 rounded-xl">
                  <p className="font-medium text-gray-900">Sample Question 1</p>
                  <p className="text-sm text-gray-600">What are the main concepts covered in this material?</p>
                </div>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl">
              <CheckCircle className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
          </div>
        );
      case 'flashcards':
        return (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
              <h3 className="font-semibold text-orange-900 mb-3">Flashcards</h3>
              <p className="text-orange-800 mb-4">
                Study with interactive flashcards for active recall and retention.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/70 rounded-xl text-center">
                  <div className="h-16 flex items-center justify-center">
                    <p className="text-sm font-medium">Front</p>
                  </div>
                </div>
                <div className="p-3 bg-white/70 rounded-xl text-center">
                  <div className="h-16 flex items-center justify-center">
                    <p className="text-sm font-medium">Back</p>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl">
              <Brain className="h-4 w-4 mr-2" />
              Study Flashcards
            </Button>
          </div>
        );
      case 'mindmap':
        return (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl">
              <h3 className="font-semibold text-purple-900 mb-3">Mind Map</h3>
              <p className="text-purple-800 mb-4">
                Visualize concepts and their relationships in an interactive mind map.
              </p>
              <div className="h-32 bg-white/70 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Network className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Mind map preview</p>
                </div>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-2xl">
              <Network className="h-4 w-4 mr-2" />
              View Mind Map
            </Button>
          </div>
        );
      default:
        return <div>Select a tool to get started</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{workflow.title}</h1>
            <p className="text-gray-600 mt-1">{workflow.description}</p>
          </div>
        </div>

        {/* Main Content - 2 Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Materials List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Materials ({workflowMaterials.length})</h2>
              </div>
              
              <div className="space-y-3 overflow-y-auto max-h-[calc(100%-80px)]">
                {workflowMaterials.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No materials in this workflow</p>
                  </div>
                ) : (
                  workflowMaterials.map((material) => (
                    <MaterialCard 
                      key={material.id} 
                      material={material} 
                      isSelected={selectedMaterial?.id === material.id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Study Tools */}
          <div className="lg:col-span-3">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg h-full flex flex-col">
              {selectedMaterial ? (
                <>
                  {/* Material Header */}
                  <div className="p-6 border-b border-gray-200/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedMaterial.title}</h3>
                        <p className="text-gray-600">{selectedMaterial.file_type} • Study Tools</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/knowledge?material=${selectedMaterial.id}`)}
                        className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Full View
                      </Button>
                    </div>
                  </div>

                  {/* Study Tools Tabs */}
                  <div className="flex-1 flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                      <div className="p-4">
                        <TabsList className="grid w-full grid-cols-4 gap-2 bg-orange-100/50 p-2 rounded-2xl">
                          {tools.map((tool) => (
                            <TabsTrigger 
                              key={tool.id} 
                              value={tool.id} 
                              className="text-sm font-semibold text-orange-900/70 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg rounded-xl flex items-center gap-2 py-3 transition-all duration-300"
                            >
                              <tool.icon className="h-4 w-4" />
                              {tool.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-6">
                        {tools.map((tool) => (
                          <TabsContent key={tool.id} value={tool.id} className="m-0 h-full">
                            <StudyToolContent tool={tool} />
                          </TabsContent>
                        ))}
                      </div>
                    </Tabs>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Material</h3>
                    <p className="text-gray-600">Choose a material from the left panel to access study tools</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Chatbot */}
        <div className="fixed bottom-6 right-6 z-50">
          {!isChatOpen ? (
            <Button
              onClick={() => setIsChatOpen(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-2xl hover:shadow-blue-200 transition-all duration-300 hover:scale-110"
            >
              <Bot className="h-6 w-6 text-white" />
            </Button>
          ) : (
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 w-80 h-96 flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5" />
                  <span className="font-semibold">Study Assistant</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className={cn("flex", message.type === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm",
                      message.type === 'user' 
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none" 
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    )}>
                      {message.message}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200/60 bg-white/50">
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your materials..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isTyping}
                    className="w-full bg-gray-100 border-transparent rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-400"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={isTyping || !chatInput.trim()}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-gradient-to-br from-blue-500 to-indigo-600 hover:shadow-lg rounded-full p-0"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .typing-indicator span { 
          height: 6px; 
          width: 6px; 
          background-color: #9ca3af; 
          border-radius: 50%; 
          display: inline-block; 
          margin: 0 1px; 
          animation: bounce 0.6s infinite alternate; 
        }
        .typing-indicator span:nth-of-type(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-of-type(3) { animation-delay: 0.4s; }
        @keyframes bounce { 
          to { 
            opacity: 0.3; 
            transform: translate3d(0, -3px, 0); 
          } 
        }
      `}</style>
    </div>
  );
};

export default WorkflowContentViewer;
