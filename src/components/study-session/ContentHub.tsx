import React, { useState } from 'react';
import { Brain, FileText, Network, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateMaterial, uploadFileToStorage } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { useStudySession } from '@/contexts/StudySessionContext';
import { toast } from 'sonner';
import FlashcardsTab from './tabs/FlashcardsTab';
import SummaryTab from './tabs/SummaryTab';
import MindMapTab from './tabs/MindMapTab';
import QuizTab from './tabs/QuizTab';

interface ContentHubProps {
  fileName: string;
  fileType: string;
}

type TabType = 'flashcards' | 'summary' | 'mindmap' | 'quiz';

// Utility function to extract title from polishedNote markdown headings
const extractTitleFromPolishedNote = (polishedNote: string): string | null => {
  if (!polishedNote) return null;
  
  // Look for # or ## headings at the beginning of lines
  const headingRegex = /^#{1,2}\s+(.+)$/m;
  const match = polishedNote.match(headingRegex);
  
  if (match && match[1]) {
    // Clean up the title (remove extra whitespace, limit length)
    const title = match[1].trim();
    // Limit title to 60 characters for better display
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  }
  
  return null;
};

const ContentHub = ({ fileName, fileType }: ContentHubProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('flashcards');
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const createMaterial = useCreateMaterial();
  const { user } = useAuth();
  const { sessionData } = useStudySession();

  const tabs = [
    {
      id: 'flashcards' as TabType,
      label: 'Flashcards',
      icon: Brain,
      description: 'Swipe up to level up',
      color: 'bg-pulse-500'
    },
    {
      id: 'summary' as TabType,
      label: 'Summary',
      icon: FileText,
      description: 'TL;DR of your lecture',
      color: 'bg-blue-500'
    },
    {
      id: 'mindmap' as TabType,
      label: 'Mind Map',
      icon: Network,
      description: 'See the whole picture',
      color: 'bg-green-500'
    },
    {
      id: 'quiz' as TabType,
      label: 'Quiz',
      icon: HelpCircle,
      description: 'Test your brain',
      color: 'bg-purple-500'
    }
  ];

  const handleSaveToHub = async () => {
    try {
      setIsProcessing(true);
      setProcessingStep('Preparing to save...');
      
      if (!user) {
        toast.error('You must be logged in to save to Hub');
        setIsProcessing(false);
        return;
      }

      if (!sessionData) {
        toast.error('No session data available to save');
        setIsProcessing(false);
        return;
      }

      // Extract file extension and map to supported types
      const getFileType = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
          case 'pdf': return 'pdf';
          case 'docx': case 'doc': return 'docx';
          case 'mp3': case 'wav': case 'm4a': case 'aac': case 'ogg': case 'flac': case 'wma': return 'audio';
          case 'mp4': case 'mov': case 'avi': case 'mkv': case 'webm': case 'wmv': case 'flv': case '3gp': return 'video';
          case 'jpg': case 'jpeg': case 'png': case 'gif': case 'bmp': case 'svg': case 'webp': return 'image';
          default: return 'other';
        }
      };

      // Extract proper title from polishedNote or fallback to fileName
      let materialTitle = fileName.replace(/\.[^/.]+$/, ""); // Remove file extension as fallback
      
      if (sessionData.polishedNote) {
        const extractedTitle = extractTitleFromPolishedNote(sessionData.polishedNote);
        if (extractedTitle) {
          materialTitle = extractedTitle;
        }
      }

      let fileUrl = '';
      
      // Upload the raw file to Supabase storage for direct material access
      // This ensures materials have their own file reference for the MaterialViewer
      if (sessionData.uploadedFile) {
        try {
          setProcessingStep('Uploading file to storage...');
        fileUrl = await uploadFileToStorage(sessionData.uploadedFile, user.id);
        } catch (error) {
          console.error('Error uploading file for material:', error);
          // Continue without file URL if upload fails
        }
      } else if (sessionData.recordedAudio) {
        try {
          setProcessingStep('Uploading audio to storage...');
          // Create audio file from blob for material storage
          const audioFile = new File([sessionData.recordedAudio], 'recorded-audio.webm', { 
            type: sessionData.recordedAudio.type 
          });
          fileUrl = await uploadFileToStorage(audioFile, user.id);
        } catch (error) {
          console.error('Error uploading audio for material:', error);
          // Continue without file URL if upload fails
        }
      }

      // Create content details to store with the material
      const contentDetails = {
        summary: sessionData.summary || '',
        quiz: sessionData.quiz || null,
        mindMap: sessionData.mindMap || '',
        flashcards: sessionData.flashcards || null,
        polishedNote: sessionData.polishedNote || ''
      };

      // Store the content details as a JSON string in the content_summary field
      // Both study session and material now have file access for different purposes:
      // - Study session: For processing tracking and admin purposes
      // - Material: For direct user access in MaterialViewer
      setProcessingStep('Saving to Knowledge Hub...');
      await createMaterial.mutateAsync({
        title: materialTitle, // Use extracted title or fallback to fileName
        file_type: getFileType(fileName),
        file_url: fileUrl, // Direct file access for MaterialViewer
        file_size: sessionData.uploadedFile?.size || sessionData.recordedAudio?.size,
        content_summary: JSON.stringify(contentDetails), // Store all content as JSON
        tags: ['study-session', 'ai-generated'],
        headings: sessionData.summary ? ['Summary', 'Key Concepts', 'Practice Questions'] : [],
        study_time: 1.5
      });

      setIsSaved(true);
      setIsProcessing(false);
      setProcessingStep('');
      toast.success('All study materials saved to Knowledge Hub!');
    } catch (error) {
      console.error('Error saving to Knowledge Hub:', error);
      setIsProcessing(false);
      setProcessingStep('');
      toast.error('Failed to save to Knowledge Hub. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="pulse-chip mb-4 inline-flex">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white mr-2">✓</span>
          <span>Processing Complete</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Study Materials Are Ready!
        </h1>
        <p className="text-gray-600 text-lg">
          Choose how you want to study "{fileName}"
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 min-w-0 px-6 py-4 text-center transition-all duration-300 border-b-2",
                  activeTab === tab.id
                    ? "border-pulse-500 bg-pulse-50 text-pulse-700"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    activeTab === tab.id ? tab.color : "bg-gray-200"
                  )}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'flashcards' && <FlashcardsTab />}
          {activeTab === 'summary' && <SummaryTab />}
          {activeTab === 'mindmap' && <MindMapTab />}
          {activeTab === 'quiz' && <QuizTab />}
        </div>
      </div>

      {/* Save/Archive Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Save to Knowledge Hub</h3>
            <p className="text-sm text-gray-600">
              {isProcessing 
                ? processingStep
                : isSaved 
                ? 'Your study materials have been saved to your Knowledge Hub'
                : 'Keep these study materials for future reference'
              }
            </p>
          </div>
          <button 
            onClick={handleSaveToHub}
            disabled={isSaved || isProcessing}
            className={cn(
              "px-6 py-2 rounded-lg transition-colors flex items-center space-x-2",
              isSaved 
                ? "bg-green-500 text-white cursor-not-allowed"
                : isProcessing
                  ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-pulse-500 text-white hover:bg-pulse-600"
            )}
          >
            {isProcessing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>
              {isProcessing ? 'Saving...' : isSaved ? 'Saved ✓' : 'Add to Hub'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentHub;
