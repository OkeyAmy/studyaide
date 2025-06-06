
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UploadInterface from '@/components/study-session/UploadInterface';
import ProcessingStatus from '@/components/study-session/ProcessingStatus';
import ContentHub from '@/components/study-session/ContentHub';

export type SessionStage = 'upload' | 'processing' | 'content';

const StudySession = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<SessionStage>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setStage('processing');
    
    // Simulate processing time
    setTimeout(() => {
      setStage('content');
    }, 3000);
  };

  const handleAudioRecord = (audioBlob: Blob) => {
    setRecordedAudio(audioBlob);
    setStage('processing');
    
    // Simulate processing time
    setTimeout(() => {
      setStage('content');
    }, 3000);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pulse-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">S</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Study Session</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {stage === 'upload' && (
          <UploadInterface 
            onFileUpload={handleFileUpload}
            onAudioRecord={handleAudioRecord}
          />
        )}
        
        {stage === 'processing' && (
          <ProcessingStatus 
            fileName={uploadedFile?.name || 'Recorded Audio'}
            onCancel={() => setStage('upload')}
          />
        )}
        
        {stage === 'content' && (
          <ContentHub 
            fileName={uploadedFile?.name || 'Recorded Audio'}
            fileType={uploadedFile?.type || 'audio/webm'}
          />
        )}
      </div>
    </div>
  );
};

export default StudySession;
