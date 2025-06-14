
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
}

interface ChatbotProps {
    selectedMaterialTitle: string | undefined;
}

const Chatbot = ({ selectedMaterialTitle }: ChatbotProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, type: 'ai', message: 'Hi! Ask me anything about your workflow materials!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const userMessage: ChatMessage = { id: Date.now(), type: 'user', message: chatInput.trim() };
      setChatMessages(prev => [...prev, userMessage]);
      setChatInput('');
      setIsTyping(true);
      setTimeout(() => {
        const aiMessage: ChatMessage = { id: Date.now() + 1, type: 'ai', message: `Great question about "${selectedMaterialTitle || 'your workflow'}"! Let me analyze that for you...` };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  return (
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
  );
};

export default Chatbot;
