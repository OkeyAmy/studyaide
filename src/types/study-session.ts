import { Quiz, QuizQuestion } from '@/services/quiz.service';
import { FlashcardSet } from '@/services/flashcard.service';

export interface StudySessionData {
  id: string;
  fileName: string;
  fileType: string;
  uploadedFile?: File;
  recordedAudio?: Blob;
  
  // Transcription and processing
  rawTranscription?: string;
  polishedNote?: string;
  
  // AI-generated content
  summary?: string;
  quiz?: Quiz;
  mindMap?: string;
  flashcards?: FlashcardSet;
  
  // Chat history for the chatbot
  chatHistory?: ChatMessage[];
  
  // Metadata
  createdAt: Date;
  lastUpdated: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StudySessionContextType {
  sessionData: StudySessionData | null;
  setSessionData: (data: StudySessionData | null | ((prev: StudySessionData | null) => StudySessionData | null)) => void;
  isGeneratingContent: boolean;
  setIsGeneratingContent: (generating: boolean) => void;
  generateSummary: () => Promise<void>;
  generateQuiz: () => Promise<void>;
  generateMindMap: () => Promise<void>;
  generateFlashcards: () => Promise<void>;
  sendChatMessage: (message: string) => Promise<string>;
} 