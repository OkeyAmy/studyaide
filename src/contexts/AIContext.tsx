
import React, { createContext, useContext, ReactNode } from 'react';
import { noteService } from '@/services/note.service';
import { summaryService } from '@/services/summary.service';
import { quizService } from '@/services/quiz.service';
import { mindmapService } from '@/services/mindmap.service';
import { chatbotService } from '@/services/chatbot.service';
import { flashcardService } from '@/services/flashcard.service';

interface AIContextType {
  noteService: typeof noteService;
  summaryService: typeof summaryService;
  quizService: typeof quizService;
  mindmapService: typeof mindmapService;
  chatbotService: typeof chatbotService;
  flashcardService: typeof flashcardService;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const value: AIContextType = {
    noteService,
    summaryService,
    quizService,
    mindmapService,
    chatbotService,
    flashcardService,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
