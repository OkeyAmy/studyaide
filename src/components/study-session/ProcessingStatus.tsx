
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProcessingStatusProps {
  fileName: string;
  onCancel: () => void;
}

const ProcessingStatus = ({ fileName, onCancel }: ProcessingStatusProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { label: 'Transcribing... preserving your lecture\'s nuance', duration: 1000 },
    { label: 'Analyzing content structure...', duration: 800 },
    { label: 'Crafting summaries & flashcards...', duration: 700 },
    { label: 'Building mind maps & quizzes...', duration: 500 }
  ];

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let stageTimeout: NodeJS.Timeout;

    const startProgress = () => {
      let currentProgress = 0;
      let stageIndex = 0;

      const advanceStage = () => {
        if (stageIndex < stages.length) {
          setCurrentStage(stageIndex);
          stageIndex++;
          stageTimeout = setTimeout(advanceStage, stages[stageIndex - 1]?.duration || 500);
        }
      };

      progressInterval = setInterval(() => {
        currentProgress += 2;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          clearTimeout(stageTimeout);
        }
      }, 60);

      advanceStage();
    };

    startProgress();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stageTimeout);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        {/* Cancel Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Folded Page Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-40 bg-white border-2 border-gray-300 rounded-lg shadow-lg transform transition-all duration-1000 hover:rotate-1">
              <div 
                className="absolute top-0 right-0 w-8 h-8 bg-pulse-500 transform origin-bottom-left transition-all duration-1000"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                  transform: `scale(${progress / 100})`
                }}
              />
              <div className="p-4 space-y-2">
                <div className="h-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4 mb-8">
          <Progress value={progress} className="h-2" />
          <div className="text-center">
            <p className="text-sm text-gray-500">{Math.round(progress)}% complete</p>
          </div>
        </div>

        {/* Status Messages */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Processing "{fileName}"
          </h3>
          
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div
                key={index}
                className={`flex items-center justify-center space-x-3 transition-all duration-300 ${
                  index === currentStage 
                    ? 'text-pulse-600 font-medium' 
                    : index < currentStage 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                }`}
              >
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentStage 
                    ? 'bg-pulse-500 animate-pulse' 
                    : index < currentStage 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                }`} />
                <span className="text-sm">{stage.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-pulse-50 rounded-lg">
            <p className="text-sm text-pulse-700">
              Hang tight—your brain's about to get lit! ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
