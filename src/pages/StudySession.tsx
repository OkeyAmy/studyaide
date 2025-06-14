import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UploadInterface from '@/components/study-session/UploadInterface';
import ProcessingStatus from '@/components/study-session/ProcessingStatus';
import ContentHub from '@/components/study-session/ContentHub';
import { StudySessionProvider, useStudySession } from '@/contexts/StudySessionContext';
import { StudySessionData } from '@/types/study-session';
import { fileProcessorService, FileProcessorOptions } from '@/services/file-processor.service';
import { activityLogger } from '@/services/activity-logger.service';
import { toast } from 'sonner';
import { saveStudySessionToDb, uploadFileToStorage } from '@/hooks/useDatabase';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type SessionStage = 'upload' | 'processing' | 'content';

const StudySessionContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessionData, setSessionData, isGeneratingContent, setIsGeneratingContent } = useStudySession();
  const [stage, setStage] = useState<SessionStage>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

  const getFileProcessingType = (file: File | Blob, fileName: string): 'audio' | 'image' | 'video' | 'document' | 'text' | 'pdf' | 'unknown' => {
    const mimeType = file.type || '';
    
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('document') || mimeType.includes('text')) return 'document';
    if (mimeType.startsWith('text/')) return 'text';
    
    // Fallback based on file extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension) {
      if (['mp3', 'wav', 'm4a', 'webm'].includes(extension)) return 'audio';
      if (['mp4', 'mov', 'avi'].includes(extension)) return 'video';
      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
      if (extension === 'pdf') return 'pdf';
      if (['docx', 'doc', 'txt'].includes(extension)) return 'document';
    }
    
    return 'unknown';
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setStage('processing');
    
    const startTime = Date.now();
    
    // Create session data
    const newSessionData: StudySessionData = {
      id: `session-${Date.now()}`,
      fileName: file.name,
      fileType: file.type,
      uploadedFile: file,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    setSessionData(newSessionData);
    
    try {
      // Process the file with comprehensive content generation
      const options: FileProcessorOptions = {
        isRecordedLive: false,
        generateAll: true
      };
      
      const result = await fileProcessorService.processFile(file, file.name, options);
      const processingTime = Date.now() - startTime;

      if (!user) throw new Error('User not authenticated.');

      // Upload file to storage for study session tracking
      // Note: File will be uploaded again in ContentHub for direct material access
      // This dual approach ensures both study session tracking and material access work
      let fileUrl = '';
      if (file) {
        fileUrl = await uploadFileToStorage(file, user.id);
      }

      // Save study session to database with all AI-generated content
      await saveStudySessionToDb({
        userId: user.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: fileUrl,
        rawTranscription: result.transcription,
        polishedNote: result.polishedNote,
        aiSummary: result.summary,
        aiQuiz: result.quiz,
        aiMindmap: result.mindMap,
        aiFlashcards: result.flashcards,
        processingTimeMs: processingTime,
        featuresGenerated: ['summary', 'quiz', 'mindmap', 'flashcards']
      });
      
      // Update session data with all generated content
      const updatedSessionData: StudySessionData = {
        ...newSessionData,
        rawTranscription: result.transcription,
        polishedNote: result.polishedNote,
        summary: result.summary,
        quiz: result.quiz,
        mindMap: result.mindMap,
        flashcards: result.flashcards,
        lastUpdated: new Date()
      };
      
      setSessionData(updatedSessionData);
      
      // Log activities
      await activityLogger.logFileUpload(file.name, file.type, file.size, result);
      await activityLogger.logFileProcessing(
        file.name, 
        file.type, 
        getFileProcessingType(file, file.name), 
        true, 
        undefined, 
        processingTime
      );
      
      // Log study session creation
      await activityLogger.logStudySessionCreation({
        fileName: file.name,
        fileType: file.type,
        hasContent: true,
        featuresGenerated: ['summary', 'quiz', 'mindmap', 'flashcards']
      });
      
      setStage('content');
      toast.success('File processed and study materials generated successfully!');
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('Error processing file:', error);
      
      // Log failed processing
      await activityLogger.logFileProcessing(
        file.name, 
        file.type, 
        'unknown', 
        false, 
        error instanceof Error ? error.message : 'Unknown error',
        processingTime
      );
      
      toast.error('Failed to process file. Please try again.');
      setStage('upload');
    }
  };

  const handleAudioRecord = async (audioBlob: Blob) => {
    setRecordedAudio(audioBlob);
    setStage('processing');
    
    const startTime = Date.now();
    
    // Create session data
    const newSessionData: StudySessionData = {
      id: `session-${Date.now()}`,
      fileName: 'Recorded Audio',
      fileType: audioBlob.type,
      recordedAudio: audioBlob,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    setSessionData(newSessionData);
    
    try {
      // Process the recorded audio with live recording flag
      const options: FileProcessorOptions = {
        isRecordedLive: true,
        generateAll: true
      };
      
      const result = await fileProcessorService.processFile(audioBlob, 'Recorded Audio', options);
      const processingTime = Date.now() - startTime;
      
      if (!user) throw new Error('User not authenticated.');

      // Create audio file from blob for study session storage
      // Note: Audio will be uploaded again in ContentHub for direct material access
      // This dual approach ensures both study session tracking and material access work
      const audioFile = new File([audioBlob], 'recorded-audio.webm', { type: audioBlob.type });
      let fileUrl = '';
      try {
        fileUrl = await uploadFileToStorage(audioFile, user.id);
      } catch (error) {
        console.warn('Failed to upload audio file:', error);
      }

      // Save study session to database with all AI-generated content
      await saveStudySessionToDb({
        userId: user.id,
        fileName: 'Recorded Audio',
        fileType: audioBlob.type,
        fileSize: audioBlob.size,
        fileUrl: fileUrl,
        rawTranscription: result.transcription,
        polishedNote: result.polishedNote,
        aiSummary: result.summary,
        aiQuiz: result.quiz,
        aiMindmap: result.mindMap,
        aiFlashcards: result.flashcards,
        processingTimeMs: processingTime,
        featuresGenerated: ['summary', 'quiz', 'mindmap', 'flashcards']
      });

      // Update session data with all generated content
      const updatedSessionData: StudySessionData = {
        ...newSessionData,
        rawTranscription: result.transcription,
        polishedNote: result.polishedNote,
        summary: result.summary,
        quiz: result.quiz,
        mindMap: result.mindMap,
        flashcards: result.flashcards,
        lastUpdated: new Date()
      };
      
      setSessionData(updatedSessionData);
      
      // Log activities
      await activityLogger.logAudioRecord(audioBlob.type, undefined, result);
      await activityLogger.logFileProcessing(
        'Recorded Audio', 
        audioBlob.type, 
        'audio', 
        true, 
        undefined, 
        processingTime
      );
      
      // Log study session creation
      await activityLogger.logStudySessionCreation({
        fileName: 'Recorded Audio',
        fileType: audioBlob.type,
        hasContent: true,
        featuresGenerated: ['summary', 'quiz', 'mindmap', 'flashcards']
      });
      
      setStage('content');
      toast.success('Audio processed and study materials generated successfully!');
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('Error processing audio:', error);
      
      // Log failed processing
      await activityLogger.logFileProcessing(
        'Recorded Audio', 
        audioBlob.type, 
        'audio', 
        false, 
        error instanceof Error ? error.message : 'Unknown error',
        processingTime
      );
      
      toast.error('Failed to process audio. Please try again.');
      setStage('upload');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pulse-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-r from-pulse-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-l from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-t from-orange-300/25 to-pulse-300/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-gray-700 hover:text-pulse-600 transition-all duration-300 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 hover:bg-white/30 hover:scale-105 shadow-lg border border-white/20"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pulse-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pulse-600 to-orange-600 bg-clip-text text-transparent">Study Session</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {stage === 'upload' && (
          <div className="animate-fadeInUp">
            <UploadInterface 
              onFileUpload={handleFileUpload}
              onAudioRecord={handleAudioRecord}
            />
          </div>
        )}
        
        {stage === 'processing' && (
          <div className="animate-fadeInUp">
            <ProcessingStatus 
              fileName={uploadedFile?.name || 'Recorded Audio'}
              onCancel={() => setStage('upload')}
            />
          </div>
        )}
        
        {stage === 'content' && (
          <div className="animate-fadeInUp">
            <ContentHub 
              fileName={uploadedFile?.name || 'Recorded Audio'}
              fileType={uploadedFile?.type || 'audio/webm'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const StudySession = () => {
  return (
    <StudySessionProvider>
      <StudySessionContent />
    </StudySessionProvider>
  );
};

export default StudySession;
