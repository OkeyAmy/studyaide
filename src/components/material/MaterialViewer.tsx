
import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelRightClose,
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
import { useIsMobile } from '@/hooks/use-mobile';

interface MaterialViewerProps {
  material: MaterialDisplay;
  onBack: () => void;
  onAddToWorkflow?: (material: MaterialDisplay) => void;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
}

const MaterialViewer = ({ material, onBack, onAddToWorkflow }: MaterialViewerProps) => {
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
  const isMobile = useIsMobile();
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [showLeftPanel, setShowLeftPanel] = useState(true);

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

  const handleAddToWorkflow = () => {
    if (onAddToWorkflow && material) {
      onAddToWorkflow(material);
    }
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      tabsListRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-orange-50/30 p-2 sm:p-4 h-screen w-full flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-md p-3 sm:p-4 mb-2 sm:mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="bg-orange-50 hover:bg-orange-100 rounded-full h-9 w-9 sm:h-10 sm:w-10 text-orange-600"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white flex-shrink-0">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="max-w-[150px] sm:max-w-xs md:max-w-md">
                <h1 className="text-base sm:text-xl font-bold text-gray-800 truncate" title={material?.title}>{material?.title || 'Untitled'}</h1>
                <p className="text-xs sm:text-sm text-gray-500">Added {new Date(safeCreatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button 
              variant="outline" 
              size={isMobile ? "icon" : "default"}
              onClick={() => setShowDeleteConfirm(true)} 
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200/80 hover:border-red-300 rounded-full"
              title="Delete Material"
            >
              <Trash2 className={cn("h-4 w-4", !isMobile && "mr-2")} /> <span className={cn(isMobile && "sr-only")}>Delete</span>
          </Button>
            <Button 
              size={isMobile ? "icon" : "default"}
              onClick={handleAddToWorkflow}
              className="bg-gradient-to-br from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-orange-200 transition-shadow rounded-full font-semibold"
              title="Add to Workflow"
            >
              <Plus className={cn("h-4 w-4", !isMobile && "mr-2")} /> <span className={cn(isMobile && "sr-only")}>Add to Workflow</span>
          </Button>
          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              className="rounded-full"
              title={showLeftPanel ? "Hide Preview" : "Show Preview"}
            >
              {showLeftPanel ? <PanelLeftClose className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
            </Button>
          )}
          </div>
        </div>
      </header>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 max-w-md w-full mx-auto shadow-xl">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete Material</h3>
            <p className="text-sm text-gray-600 my-2">Are you sure you want to delete "{material?.title}"? This cannot be undone.</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-end mt-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="rounded-lg sm:rounded-full w-full sm:w-auto">Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteMaterial.isPending} className="rounded-lg sm:rounded-full w-full sm:w-auto">
                {deleteMaterial.isPending ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 flex-1 min-h-0">
        {/* Left Panel: File Viewer */}
        <div className={cn(
          "bg-white/60 rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-lg shadow-orange-100/50 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
          isMobile && !showLeftPanel && "hidden",
          isMobile && showLeftPanel && "h-[calc(50vh-4rem)]", // Adjust height for mobile when both panels are shown
           !isMobile && "lg:col-span-1"
        )}>
            {material?.file_url ? (
              <div className="w-full h-full relative">
                {fileLoading ? (
                  <FilePreviewer 
                    fileUrl={material.file_url} 
                    fileName={material.title} 
                    fileType={safeFileType} 
                    isLoading={true} 
                  />
                ) : loadError ? (
                   <FilePreviewer 
                    fileUrl={material.file_url!} 
                    fileName={material.title} 
                    fileType={safeFileType} 
                    loadError={true} 
                  />
                ) : safeFileType === 'pdf' ? (
                  <iframe
                    src={`${material.file_url}#view=fitH&toolbar=0`} 
                    className="w-full h-full border-0"
                    title={material.title}
                    onError={() => { console.error("iframe load error"); setLoadError(true); }}
                  />
                ) : safeFileType === 'video' ? (
                    <video
                      src={material.file_url}
                      controls
                    className="w-full h-full object-contain bg-gray-900"
                    onError={() => { console.error("video load error"); setLoadError(true); }}
                  />
                ) : safeFileType === 'audio' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50 p-4 sm:p-8">
                    <div className="text-5xl sm:text-6xl mb-4">🎵</div>
                    <audio
                      src={material.file_url}
                      controls
                      className="w-full max-w-xs sm:max-w-md"
                      onError={() => { console.error("audio load error"); setLoadError(true); }}
                    />
                  </div>
                ) : safeFileType === 'image' ? (
                    <img
                      src={material.file_url}
                      alt={material.title}
                    className="w-full h-full object-contain p-1 sm:p-2" 
                    onError={() => { console.error("image load error"); setLoadError(true); }}
                  />
                ) : ( // Fallback for other types or if no specific viewer
                  <FilePreviewer 
                    fileUrl={material.file_url!} 
                    fileName={material.title} 
                    fileType={safeFileType} 
                    loadError={loadError} // Pass loadError to this generic previewer
                  />
                )}
                {!fileLoading && !loadError && material.file_url && safeFileType !== 'other' && (
                  <Button size="sm" onClick={() => window.open(material.file_url, '_blank')} className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 rounded-full text-xs px-3 py-1.5">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Open Original
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-4 sm:p-8 flex flex-col items-center justify-center text-center h-full text-gray-500">
                <Eye className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4 text-orange-300" />
                <h3 className="font-semibold text-gray-700 text-sm sm:text-base">No Preview Available</h3>
                {material?.file_url ? (
                    <p className="text-xs sm:text-sm">Could not load preview. You can try to <Button variant="link" size="sm" className="p-0 h-auto text-xs sm:text-sm" onClick={handleDownload}>download it</Button>.</p>
                ) : (
                    <p className="text-xs sm:text-sm">No file has been uploaded for this material.</p>
                )}
              </div>
            )}
        </div>

        {/* Right Panel: Study Tools */}
        <div className={cn(
          "bg-white/60 rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-lg shadow-orange-100/50 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
          isMobile && showLeftPanel && "h-[calc(50vh-3.5rem)]", // Adjust height for mobile
          isMobile && !showLeftPanel && "h-full", // Full height when preview is hidden
          !isMobile && "lg:col-span-1"
        )}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="p-2 sm:p-3 border-b border-gray-200/60 relative">
                {isMobile && (
                  <Button variant="ghost" size="icon" onClick={() => scrollTabs('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full rounded-none bg-white/30 hover:bg-white/50">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}
                <TabsList ref={tabsListRef} className={cn("grid w-full gap-1 sm:gap-2 bg-orange-100/50 p-1 sm:p-1.5 rounded-full", isMobile ? "grid-flow-col auto-cols-max overflow-x-auto no-scrollbar px-8" : "grid-cols-5")}>
                    {tools.map((tool) => (
                        <TabsTrigger 
                            key={tool.id} 
                            value={tool.id} 
                            className="text-xs sm:text-sm font-semibold text-orange-900/70 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md rounded-full flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 whitespace-nowrap transition-all duration-300"
                        >
                            <tool.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" /> {!isMobile || activeTab === tool.id ? tool.label : ''}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {isMobile && (
                  <Button variant="ghost" size="icon" onClick={() => scrollTabs('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full rounded-none bg-white/30 hover:bg-white/50">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="summary" className="p-3 sm:p-4"><MaterialSummaryTab content={savedContent} material={material} /></TabsContent>
              <TabsContent value="quiz" className="p-3 sm:p-4"><MaterialQuizTab content={savedContent} material={material} /></TabsContent>
              <TabsContent value="flashcards" className="p-3 sm:p-4"><MaterialFlashcardsTab content={savedContent} material={material} /></TabsContent>
              <TabsContent value="mindmap" className="p-3 sm:p-4"><MaterialMindMapTab content={savedContent} material={material} /></TabsContent>
              <TabsContent value="chatbot" className="m-0 h-full">
                      <div className="h-full flex flex-col">
                      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                        {chatMessages.map((message) => (
                          <div key={message.id} className={cn("flex items-end gap-2", message.type === 'user' ? "justify-end" : "justify-start")}>
                            {message.type === 'ai' && <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white flex-shrink-0"><Brain size={isMobile ? 14 : 16}/></div>}
                            <div className={cn("max-w-[80%] p-2.5 px-3 sm:p-3 sm:px-4 rounded-xl sm:rounded-2xl", message.type === 'user' ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none")}>
                              <p className="text-sm">{message.message}</p>
                            </div>
                          </div>
                        ))}
                        {isTyping && <div className="flex justify-start"><div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none"><div className="typing-indicator"><span></span><span></span><span></span></div></div></div>}
                              </div>
                      <div className="p-3 sm:p-4 border-t border-gray-200/60 bg-white/50">
                          <div className="relative">
                            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask anything..." onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} disabled={isTyping} className="w-full bg-gray-100 border-transparent rounded-full py-2.5 pl-3 pr-10 sm:py-3 sm:pl-4 sm:pr-12 text-sm focus:ring-2 focus:ring-orange-400" />
                            <Button size="icon" onClick={handleSendMessage} disabled={isTyping || !chatInput.trim()} className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-9 sm:w-9 bg-gradient-to-br from-orange-500 to-amber-500 hover:shadow-lg hover:shadow-orange-200 rounded-full transition-all">
                              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .typing-indicator span { height: ${isMobile ? '6px' : '8px'}; width: ${isMobile ? '6px' : '8px'}; background-color: #fdb971; border-radius: 50%; display: inline-block; margin: 0 1px; animation: bounce 0.6s infinite alternate; }
        .typing-indicator span:nth-of-type(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-of-type(3) { animation-delay: 0.4s; }
        @keyframes bounce { to { opacity: 0.3; transform: translate3d(0, -5px, 0); } }
      `}</style>
    </div>
  );
};

export default MaterialViewer;
