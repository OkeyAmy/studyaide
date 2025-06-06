
import React, { useState } from 'react';
import { Plus, Mic, Upload, Brain, BookOpen, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  activeSession: string;
}

const QuickActions = ({ activeSession }: QuickActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: Upload,
      label: 'Upload File',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => navigate('/study-session')
    },
    {
      icon: Mic,
      label: 'Record Live',
      color: 'bg-red-500 hover:bg-red-600',
      action: () => navigate('/study-session', { state: { startRecording: true } })
    },
    {
      icon: Brain,
      label: 'AI Tools',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => navigate('/dashboard', { state: { activeSession: 'ai-tools' } })
    },
    {
      icon: BookOpen,
      label: 'Knowledge Base',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => navigate('/dashboard', { state: { activeSession: 'knowledge' } })
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col-reverse items-end space-y-reverse space-y-3">
        {/* Action Buttons */}
        {isExpanded && actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              onClick={() => {
                action.action();
                setIsExpanded(false);
              }}
              className={cn(
                "h-12 w-12 rounded-full shadow-lg transition-all duration-300 transform",
                action.color,
                "animate-scale-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="h-5 w-5 text-white" />
            </Button>
          );
        })}

        {/* Main Toggle Button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "h-14 w-14 rounded-full bg-pulse-500 hover:bg-pulse-600 shadow-lg transition-all duration-300",
            isExpanded && "rotate-45"
          )}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default QuickActions;
