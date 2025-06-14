import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAIClient, isAIAvailable, generateStructuredResponse, generateJSONResponse, delay } from './ai.service';
import { generateFlashcardsFromFile, FlashcardSet, generateFlashcards } from './flashcard.service';
import { generateSummaryFromFile, generateSummary } from './summary.service';
import { generateQuizFromFile, Quiz, generateQuiz } from './quiz.service';
import { generateMindmapFromFile, generateMindmap } from './mindmap.service';
import { StudySessionData } from '@/types/study-session';

// Native Gemini client for multimodal support
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const googleGenAI = geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here' 
    ? new GoogleGenerativeAI(geminiApiKey) 
    : null;

export interface ProcessedContent {
  transcription?: string;
  polishedNote: string;
  summary: string;
  quiz: Quiz;
  mindMap: string;
  flashcards: FlashcardSet;
  fileMetadata: {
    name: string;
    type: string;
    size: number;
    processedAt: Date;
  };
}

export interface FileProcessorOptions {
  isRecordedLive?: boolean;
  generateAll?: boolean;
}

/**
 * Fallback data when AI generation fails
 */
const getFallbackData = (fileName: string, content: string) => ({
  summary: `**Study Summary for ${fileName}**\n\n• Main content has been processed\n• Review the polished notes for detailed information\n• AI-generated study materials are available`,
  quiz: {
    title: `Quiz: ${fileName}`,
    questions: [
      {
        question: "What is the main topic of this material?",
        options: ["General study content", "AI-generated material", "Educational resource", "All of the above"],
        correctAnswer: 3,
        explanation: "This material covers general study content that has been processed for learning."
      }
    ]
  },
  mindMap: `# ${fileName}\n\n## Content\n- Main Topics\n- Key Points\n\n## Study Materials\n- Notes\n- References\n\n## Review\n- Practice\n- Assessment`,
  flashcards: {
    title: `Flashcards: ${fileName}`,
    cards: [
      {
        question: "What does this material cover?",
        answer: content.substring(0, 100) + "...",
        source: fileName
      }
    ]
  }
});

/**
 * Processes different types of files using appropriate Gemini API endpoints
 */
export class FileProcessorService {
  
  /**
   * Main entry point for processing any file type
   */
  async processFile(
    file: File | Blob, 
    fileName: string, 
    options: FileProcessorOptions = {}
  ): Promise<ProcessedContent> {
    console.log(`Processing file: ${fileName}, type: ${file.type}`);
    
    if (!googleGenAI || !isAIAvailable()) {
      throw new Error("AI service not configured. Please set VITE_GEMINI_API_KEY in your environment.");
    }

    const fileType = this.getFileType(file, fileName);
    const fileMetadata = {
      name: fileName,
      type: file.type || this.getMimeType(fileName),
      size: file.size,
      processedAt: new Date()
    };

    let content: string;
    let transcription: string | undefined;

    try {
    // Process file based on type
    switch (fileType) {
      case 'audio':
          console.log('Processing audio file...');
        const audioResult = await this.processAudio(file as Blob, options.isRecordedLive);
        content = audioResult.polished;
        transcription = audioResult.transcription;
        break;
      
      case 'image':
          console.log('Processing image file...');
        content = await this.processImage(file as File);
        break;
      
      case 'text':
      case 'pdf':
      case 'document':
          console.log('Processing document file...');
        content = await this.processTextDocument(file as File);
        break;
      
      case 'video':
          console.log('Processing video file...');
        const videoResult = await this.processVideo(file as File);
        content = videoResult.polished;
        transcription = videoResult.transcription;
        break;
      
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

      // Generate study materials one at a time with delays between to avoid rate limiting
      console.log('Generating study materials with rate limiting...');
      
      // Generate summary
      const summary = await this.generateSummaryWithFallback(file, fileName, content);
      await delay(1000);
      
      const quiz = await this.generateQuizWithFallback(file, fileName, content);
      await delay(1000);
      
      const mindMap = await this.generateMindmapWithFallback(file, fileName, content);
      await delay(1000);
      
      const flashcards = await this.generateFlashcardsWithFallback(file, fileName, content);

      return {
        transcription,
        polishedNote: content,
        summary,
        quiz,
        mindMap,
        flashcards,
        fileMetadata
      };
    } catch (error) {
      console.error(`Error processing ${fileType} file:`, error);
      throw new Error(`Failed to process ${fileType}. Please try again with a different file.`);
    }
  }

  /**
   * Generate summary with fallback
   */
  private async generateSummaryWithFallback(file: File | Blob, fileName: string, content: string): Promise<string> {
    try {
      if (file instanceof File) {
        console.log('Using direct file upload for summary generation');
        return await generateSummaryFromFile(file);
      } else {
        console.log('Using text-based summary generation for Blob data');
        return await generateSummary(content);
      }
    } catch (error) {
      console.warn('Failed to generate summary, using fallback:', error);
      return getFallbackData(fileName, content).summary;
    }
  }

  /**
   * Generate quiz with fallback
   */
  private async generateQuizWithFallback(file: File | Blob, fileName: string, content: string): Promise<Quiz> {
    try {
      if (file instanceof File) {
        console.log('Using direct file upload for quiz generation');
        return await generateQuizFromFile(file);
      } else {
        console.log('Using text-based quiz generation for Blob data');
        return await generateQuiz(content);
      }
    } catch (error) {
      console.warn('Failed to generate quiz, using fallback:', error);
      return getFallbackData(fileName, content).quiz;
    }
  }

  /**
   * Generate mindmap with fallback
   */
  private async generateMindmapWithFallback(file: File | Blob, fileName: string, content: string): Promise<string> {
    try {
      if (file instanceof File) {
        console.log('Using direct file upload for mindmap generation');
        return await generateMindmapFromFile(file, undefined, fileName);
      } else {
        console.log('Using text-based mindmap generation for Blob data');
        return await generateMindmap(content, undefined, fileName);
      }
    } catch (error) {
      console.warn('Failed to generate mindmap, using fallback:', error);
      return getFallbackData(fileName, content).mindMap;
    }
  }

  /**
   * Generate flashcards with fallback
   */
  private async generateFlashcardsWithFallback(file: File | Blob, fileName: string, content: string): Promise<FlashcardSet> {
    try {
      if (file instanceof File) {
        console.log('Using direct file upload for flashcard generation');
        return await generateFlashcardsFromFile(file);
      } else {
        console.log('Using text-based flashcard generation for Blob data');
        return await generateFlashcards(content);
      }
    } catch (error) {
      console.warn('Failed to generate flashcards, using fallback:', error);
      return getFallbackData(fileName, content).flashcards;
    }
  }

  /**
   * Process audio files (recorded live or uploaded)
   */
  private async processAudio(audioBlob: Blob, isRecordedLive: boolean = false): Promise<{transcription: string, polished: string}> {
    try {
    // Convert to base64
      console.log('Sending audio for transcription...');
    const base64Audio = await this.blobToBase64(audioBlob);
    
    // Use native Gemini for audio transcription
    const model = googleGenAI!.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const transcriptionPrompt = isRecordedLive 
      ? "Please transcribe this live recorded audio accurately. Clean up filler words, 'ums', and repeated phrases while preserving the meaning. Return only the cleaned transcription."
      : "Please transcribe this audio file accurately. Return only the transcribed text without any additional commentary.";

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Audio,
          mimeType: audioBlob.type,
        },
      },
      transcriptionPrompt
    ]);

    const transcription = await result.response.text();
      console.log('Transcription completed, polishing text...');
    
      // Polish the transcription using the new AI service
    const polished = await this.polishText(transcription, isRecordedLive);
    
    return { transcription, polished };
    } catch (error) {
      console.error('Error processing audio:', error);
      throw new Error('Failed to process audio. Please try again with a different file.');
    }
  }

  /**
   * Process image files
   */
  private async processImage(file: File): Promise<string> {
    const base64Image = await this.fileToBase64(file);
    
    const model = googleGenAI!.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      },
      "Analyze this image and extract all text, diagrams, charts, and educational content. Provide a comprehensive description that could be used for studying. Include any formulas, concepts, or key information visible in the image."
    ]);

    const content = await result.response.text();
    return this.polishText(content);
  }

  /**
   * Process video files
   */
  private async processVideo(file: File): Promise<{transcription: string, polished: string}> {
    // For video files, we'll extract audio and process it
    const base64Video = await this.fileToBase64(file);
    
    const model = googleGenAI!.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Video,
          mimeType: file.type,
        },
      },
      "Extract and transcribe all audio content from this video. Also describe any visual educational content, diagrams, or text shown in the video. Provide a comprehensive study-friendly summary."
    ]);

    const transcription = await result.response.text();
    const polished = await this.polishText(transcription);
    
    return { transcription, polished };
  }

  /**
   * Process text documents (PDF, TXT, etc.)
   */
  private async processTextDocument(file: File): Promise<string> {
    let text: string;
    
    if (file.type === 'application/pdf') {
      // For PDF files, we can use Gemini's PDF processing capability
      const base64Pdf = await this.fileToBase64(file);
      
      const model = googleGenAI!.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Pdf,
            mimeType: 'application/pdf',
          },
        },
        "Extract all text content from this PDF document. Preserve the structure and formatting as much as possible. Include any important diagrams or chart descriptions."
      ]);

      text = await result.response.text();
    } else {
      // For other text files, read directly
      text = await file.text();
    }
    
    return this.polishText(text);
  }

  /**
   * Polish text using the new AI service
   */
  private async polishText(rawText: string, isRecordedLive: boolean = false): Promise<string> {
    const prompt = isRecordedLive 
      ? `Polish this live recorded transcription into well-formatted, coherent notes. Fix grammar, remove filler words, improve structure, and make it suitable for studying. Preserve all important content and context:

${rawText}`
      : `Polish the following text into well-formatted study notes. Fix grammar, punctuation, and structure while preserving the original meaning and content. Make it clear and readable:

${rawText}`;

    return await generateStructuredResponse(prompt, 0.3);
  }

  /**
   * Utility functions
   */
  private getFileType(file: File | Blob, fileName: string): string {
    const mimeType = file.type || this.getMimeType(fileName);
    
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('text/')) return 'text';
    
    // No longer supporting DOCX as requested
    // Removed: if (mimeType.includes('document') || mimeType.includes('text')) return 'document';
    
    return 'unknown';
  }

  private getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'm4a': 'audio/mp4',
      'webm': 'audio/webm',
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      // Removed DOCX support as requested
      // 'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // 'doc': 'application/msword',
      'txt': 'text/plain'
    };
    
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

// Export singleton instance
export const fileProcessorService = new FileProcessorService();
