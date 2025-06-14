import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StudySessionData, StudySessionContextType, ChatMessage } from '@/types/study-session';
import { generateSummaryFromFile, generateSummary } from '@/services/summary.service';
import { generateQuizFromFile, generateQuiz } from '@/services/quiz.service';
import { generateMindmapFromFile, generateMindmap } from '@/services/mindmap.service';
import { generateFlashcardsFromFile, generateFlashcards } from '@/services/flashcard.service';
import { generateChatbotResponse } from '@/services/chatbot.service';
import { toast } from 'sonner';

const StudySessionContext = createContext<StudySessionContextType | undefined>(undefined);

export const useStudySession = (): StudySessionContextType => {
  const context = useContext(StudySessionContext);
  if (!context) {
    throw new Error('useStudySession must be used within a StudySessionProvider');
  }
  return context;
};

interface StudySessionProviderProps {
  children: ReactNode;
}

export const StudySessionProvider: React.FC<StudySessionProviderProps> = ({ children }) => {
  const [sessionData, setSessionData] = useState<StudySessionData | null>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const generateSummaryContent = async (): Promise<void> => {
    if (sessionData?.uploadedFile) {
      console.log('Using uploaded file for summary generation:', sessionData.uploadedFile.name);
      
      setIsGeneratingContent(true);
      try {
        const summary = await generateSummaryFromFile(sessionData.uploadedFile);
        setSessionData(prev => prev ? {
          ...prev,
          summary,
          lastUpdated: new Date()
        } : null);
        toast.success('Summary generated successfully from uploaded file!');
      } catch (error) {
        console.error('Error generating summary from file:', error);
        toast.error('Failed to generate summary from file. Please try again.');
      } finally {
        setIsGeneratingContent(false);
      }
    } else if (sessionData?.polishedNote) {
      console.log('Fallback to text-based summary generation');

    setIsGeneratingContent(true);
    try {
      const summary = await generateSummary(sessionData.polishedNote);
      setSessionData(prev => prev ? {
        ...prev,
        summary,
        lastUpdated: new Date()
      } : null);
        toast.success('Summary generated successfully from text!');
    } catch (error) {
        console.error('Error generating summary from text:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsGeneratingContent(false);
      }
    } else {
      toast.error('No file or note content available for summary generation');
    }
  };

  const generateQuizContent = async (): Promise<void> => {
    if (sessionData?.uploadedFile) {
      console.log('Using uploaded file for quiz generation:', sessionData.uploadedFile.name);
      
      setIsGeneratingContent(true);
      try {
        const quiz = await generateQuizFromFile(sessionData.uploadedFile);
        setSessionData(prev => prev ? {
          ...prev,
          quiz,
          lastUpdated: new Date()
        } : null);
        toast.success('Quiz generated successfully from uploaded file!');
      } catch (error) {
        console.error('Error generating quiz from file:', error);
        toast.error('Failed to generate quiz from file. Please try again.');
      } finally {
        setIsGeneratingContent(false);
    }
    } else if (sessionData?.polishedNote) {
      console.log('Fallback to text-based quiz generation');

    setIsGeneratingContent(true);
    try {
      const quiz = await generateQuiz(sessionData.polishedNote);
      setSessionData(prev => prev ? {
        ...prev,
        quiz,
        lastUpdated: new Date()
      } : null);
        toast.success('Quiz generated successfully from text!');
    } catch (error) {
        console.error('Error generating quiz from text:', error);
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setIsGeneratingContent(false);
      }
    } else {
      toast.error('No file or note content available for quiz generation');
    }
  };

  const generateMindMapContent = async (): Promise<void> => {
    if (sessionData?.uploadedFile) {
      console.log('Using uploaded file for mind map generation:', sessionData.uploadedFile.name);
      setIsGeneratingContent(true);
      try {
        const mindMap = await generateMindmapFromFile(sessionData.uploadedFile, sessionData.id, sessionData.fileName);
        setSessionData(prev => prev ? { ...prev, mindMap, lastUpdated: new Date() } : null);
        toast.success('Mind map generated successfully from uploaded file!');
      } catch (error) {
        console.error('Error generating mind map from file:', error);
        toast.error('Failed to generate mind map from file. Please try again.');
      } finally {
        setIsGeneratingContent(false);
      }
    } else if (sessionData?.polishedNote) {
      console.log('Fallback to text-based mind map generation');
      setIsGeneratingContent(true);
      try {
        const mindMap = await generateMindmap(sessionData.polishedNote, sessionData.id, sessionData.fileName);
        setSessionData(prev => prev ? { ...prev, mindMap, lastUpdated: new Date() } : null);
        toast.success('Mind map generated successfully from text!');
      } catch (error) {
        console.error('Error generating mind map from text:', error);
        toast.error('Failed to generate mind map. Please try again.');
      } finally {
        setIsGeneratingContent(false);
      }
    } else {
      toast.error('No file or note content available for mind map generation');
    }
  };

  const generateFlashcardsContent = async (): Promise<void> => {
    if (sessionData?.uploadedFile) {
      console.log('Using uploaded file for flashcard generation:', sessionData.uploadedFile.name);
      
      setIsGeneratingContent(true);
      try {
        const flashcards = await generateFlashcardsFromFile(sessionData.uploadedFile);
        setSessionData(prev => prev ? {
          ...prev,
          flashcards,
          lastUpdated: new Date()
        } : null);
        toast.success('Flashcards generated successfully from uploaded file!');
      } catch (error) {
        console.error('Error generating flashcards from file:', error);
        toast.error('Failed to generate flashcards from file. Please try again.');
      } finally {
        setIsGeneratingContent(false);
    }
    } else if (sessionData?.polishedNote) {
      console.log('Fallback to text-based flashcard generation');

    setIsGeneratingContent(true);
    try {
      const flashcards = await generateFlashcards(sessionData.polishedNote);
      setSessionData(prev => prev ? {
        ...prev,
        flashcards,
        lastUpdated: new Date()
      } : null);
        toast.success('Flashcards generated successfully from text!');
    } catch (error) {
        console.error('Error generating flashcards from text:', error);
      toast.error('Failed to generate flashcards. Please try again.');
    } finally {
      setIsGeneratingContent(false);
      }
    } else {
      toast.error('No file or note content available for flashcard generation');
    }
  };

  const sendChatMessage = async (messageContent: string): Promise<string> => {
    if (!sessionData?.id || !sessionData.fileName || !sessionData.polishedNote) {
      toast.error('Cannot send message: session data is incomplete.');
      throw new Error('Session data (id, fileName, or polishedNote) is incomplete for chat.');
    }

    const currentChatHistory: ChatMessage[] = sessionData.chatHistory || [];
    
    // Prepare messages for AI (current history + new user message)
    // The chatbot service expects an array of { role, content }
    const messagesForAI: { role: 'user' | 'assistant'; content: string }[] = [
      ...currentChatHistory.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user' as const, content: messageContent }
    ];

    try {
      const response = await generateChatbotResponse(
        sessionData.id,
        messagesForAI,
        sessionData.fileName,
        sessionData.polishedNote
      );
      
      const userMessageEntry: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user' as const,
        content: messageContent,
        timestamp: new Date()
      };

      const assistantMessageEntry: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant' as const,
        content: response,
        timestamp: new Date()
      };

      const newHistory = [
        ...currentChatHistory,
        userMessageEntry,
        assistantMessageEntry
      ];

      setSessionData(prev => prev ? {
        ...prev,
        chatHistory: newHistory,
        lastUpdated: new Date()
      } : null);

      return response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      toast.error('Failed to send chat message. Please try again.');
      throw error;
    }
  };

  const value: StudySessionContextType = {
    sessionData,
    setSessionData,
    isGeneratingContent,
    setIsGeneratingContent,
    generateSummary: generateSummaryContent,
    generateQuiz: generateQuizContent,
    generateMindMap: generateMindMapContent,
    generateFlashcards: generateFlashcardsContent,
    sendChatMessage,
  };

  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
};
