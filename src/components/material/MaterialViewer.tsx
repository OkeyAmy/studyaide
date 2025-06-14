import React, { useState, useEffect } from 'react';
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
  Trash2,
  ExternalLink,
  Plus,
  Send,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { MaterialDisplay } from '@/types/api';
import FilePreviewer from './FilePreviewer';
import MaterialSummaryTab from './tabs/MaterialSummaryTab';
import MaterialQuizTab from './tabs/MaterialQuizTab';
import MaterialFlashcardsTab from './tabs/MaterialFlashcardsTab';
import MaterialMindMapTab from './tabs/MaterialMindMapTab';
import { useDeleteMaterial } from '@/hooks/useDatabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MaterialViewerProps {
  material: MaterialDisplay;
  onBack: () => void;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
}

const MaterialViewer = ({ material, onBack }: MaterialViewerProps) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [chatInput, setChatInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, type: 'ai', message: `Hey! How can I help you with "${material?.title || 'this material'}"?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const deleteMaterial = useDeleteMaterial();
  const [fileLoading, setFileLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const tools = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'flashcards', label: 'Flashcards', icon: Brain },
    { id: 'mindmap', label: 'Mind Map', icon: Network },
    { id: 'chatbot', label: 'Chat', icon: MessageSquare },
  ];

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'audio': return '🎵';
      case 'video': return '🎥';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  const safeFileType = material?.file_type || material?.type || 'other';
  const safeCreatedAt = material?.created_at || material?.uploadedAt || new Date().toISOString();
  const savedContent = material?.parsedContent || {};
  const hasContent = savedContent && Object.keys(savedContent).length > 0;

  useEffect(() => {
    if (material?.file_url) {
      setFileLoading(true);
      setLoadError(false);
      
      const timer = setTimeout(() => {
        setFileLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [material?.file_url]);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const userMessage: ChatMessage = { id: Date.now(), type: 'user', message: chatInput.trim() };
      setChatMessages(prev => [...prev, userMessage]);
      setChatInput('');
      setIsTyping(true);
      setTimeout(() => {
        const aiMessage: ChatMessage = { id: Date.now() + 1, type: 'ai', message: `That's a great question! Let me check the document...` };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleDownload = () => {
    if (material?.file_url) window.open(material.file_url, '_blank');
  };

  const handleDelete = async () => {
    if (!material?.id) return;
    try {
      await deleteMaterial.mutateAsync(material.id);
      toast.success('Material deleted successfully');
      onBack();
    } catch (error) { toast.error('Failed to delete material'); }
    setShowDeleteConfirm(false);
  };

  const docs = material?.file_url ? [{ uri: material.file_url, fileName: material.title || 'document', fileType: safeFileType }] : [];

  return (
    <div className="bg-orange-50/30 p-4 h-screen w-full flex flex-col font-sans">
      {/* Header - Redesigned with white background */}
      <header className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-4 mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
              size="icon" 
            onClick={onBack} 
              className="bg-orange-50 hover:bg-orange-100 rounded-full h-10 w-10 text-orange-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
            
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{material?.title || 'Untitled'}</h1>
                <p className="text-sm text-gray-500">Added {new Date(safeCreatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(true)} 
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200/80 hover:border-red-300 rounded-full hidden sm:flex"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
            <Button 
              className="bg-gradient-to-br from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-orange-200 transition-shadow rounded-full font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" /> Add to Workflow
          </Button>
          </div>
        </div>
      </header>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete Material</h3>
            <p className="text-gray-600 my-2">Are you sure you want to delete "{material?.title}"? This cannot be undone.</p>
            <div className="flex space-x-3 justify-end mt-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="rounded-full">Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteMaterial.isPending} className="rounded-full">
                {deleteMaterial.isPending ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left Panel: File Viewer */}
        <div className="bg-white/60 rounded-3xl border border-gray-200/80 shadow-lg shadow-orange-100/50 flex flex-col overflow-hidden">
            {material?.file_url ? (
              <div className="w-full h-full relative">
                {fileLoading ? (
                  <FilePreviewer 
                    fileUrl={material.file_url} 
                    fileName={material.title} 
                    fileType={safeFileType} 
                    isLoading={true} 
                  />
                ) : safeFileType === 'pdf' ? (
                  <iframe
                    src={`${material.file_url}#view=fitH&toolbar=0`} 
                    className="w-full h-full border-0"
                    title={material.title}
                    onError={() => setLoadError(true)}
                  />
                ) : safeFileType === 'video' ? (
                    <video
                      src={material.file_url}
                      controls
                    className="w-full h-full object-contain bg-gray-900"
                    onError={() => setLoadError(true)}
                  />
                ) : safeFileType === 'audio' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50 p-8">
                    <div className="text-6xl mb-4">🎵</div>
                    <audio
                      src={material.file_url}
                      controls
                      className="w-full max-w-md"
                      onError={() => setLoadError(true)}
                    />
                  </div>
                ) : safeFileType === 'image' ? (
                    <img
                      src={material.file_url}
                      alt={material.title}
                    className="w-full h-full object-contain p-2" 
                    onError={() => setLoadError(true)}
                  />
                ) : (
                  <FilePreviewer 
                    fileUrl={material.file_url!} 
                    fileName={material.title} 
                    fileType={safeFileType} 
                    loadError={loadError} 
                  />
                )}
                {!fileLoading && !loadError && safeFileType !== 'other' && (
                  <Button size="sm" onClick={() => window.open(material.file_url, '_blank')} className="absolute bottom-4 right-4 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 rounded-full">
                    <ExternalLink className="h-4 w-4 mr-2" /> Open Original
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center justify-center text-center h-full text-gray-500">
                <Eye className="h-16 w-16 mb-4 text-orange-300" />
                <h3 className="font-semibold text-gray-700">No Preview Available</h3>
                <p className="text-sm">We can't display this file, but you can download it.</p>
              </div>
            )}
        </div>

        {/* Right Panel: Study Tools */}
        <div className="bg-white/60 rounded-3xl border border-gray-200/80 shadow-lg shadow-orange-100/50 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="p-3 border-b border-gray-200/60">
                <TabsList className="grid w-full grid-cols-5 gap-2 bg-orange-100/50 p-1.5 rounded-full">
                    {tools.map((tool) => (
                        <TabsTrigger key={tool.id} value={tool.id} className="text-sm font-semibold text-orange-900/70 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md rounded-full flex items-center gap-2 py-2 transition-all duration-300">
                            <tool.icon className="h-4 w-4" /> {tool.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                        </div>
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="summary"><MaterialSummaryTab content={savedContent} material={material} /></TabsContent>
              <TabsContent value="quiz"><MaterialQuizTab content={savedContent} material={material} /></TabsContent>
              <TabsContent value="flashcards"><MaterialFlashcardsTab content={savedContent} material={material} /></TabsContent>
              <TabsContent value="mindmap"><MaterialMindMapTab content={savedContent} material={material} /></TabsContent>
              <TabsContent value="chatbot" className="m-0 h-full">
                      <div className="h-full flex flex-col">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map((message) => (
                          <div key={message.id} className={cn("flex items-end gap-2", message.type === 'user' ? "justify-end" : "justify-start")}>
                            {message.type === 'ai' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white flex-shrink-0"><Brain size={16}/></div>}
                            <div className={cn("max-w-[80%] p-3 px-4 rounded-2xl", message.type === 'user' ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none")}>
                              <p className="text-sm">{message.message}</p>
                            </div>
                          </div>
                        ))}
                        {isTyping && <div className="flex justify-start"><div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none"><div className="typing-indicator"><span></span><span></span><span></span></div></div></div>}
                              </div>
                      <div className="p-4 border-t border-gray-200/60 bg-white/50">
                          <div className="relative">
                            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask anything..." onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} disabled={isTyping} className="w-full bg-gray-100 border-transparent rounded-full py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-orange-400" />
                            <Button size="icon" onClick={handleSendMessage} disabled={isTyping || !chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-gradient-to-br from-orange-500 to-amber-500 hover:shadow-lg hover:shadow-orange-200 rounded-full transition-all">
                              <Send className="h-4 w-4" />
                            </Button>
                        </div>
                      </div>
                      </div>
                  </TabsContent>
              </div>
            </Tabs>
          </div>
      </main>
      <style>{`
        .typing-indicator span { height: 8px; width: 8px; background-color: #fdb971; border-radius: 50%; display: inline-block; margin: 0 1px; animation: bounce 0.6s infinite alternate; }
        .typing-indicator span:nth-of-type(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-of-type(3) { animation-delay: 0.4s; }
        @keyframes bounce { to { opacity: 0.3; transform: translate3d(0, -5px, 0); } }
      `}</style>
    </div>
  );
};

export default MaterialViewer;