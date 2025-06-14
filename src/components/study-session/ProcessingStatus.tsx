import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white/30 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-8 w-32 h-32 bg-gradient-to-r from-pulse-400/20 to-orange-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-8 left-12 w-40 h-40 bg-gradient-to-l from-pink-300/15 to-pulse-300/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end mb-8 relative z-10">
          <button
            onClick={onCancel}
            className="p-3 text-gray-400 hover:text-gray-600 rounded-2xl hover:bg-white/50 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20 shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Animated Document */}
        <div className="flex justify-center mb-10 relative z-10">
          <div className="relative">
            <div className="w-40 h-48 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl shadow-2xl transform transition-all duration-1000 hover:rotate-1 relative overflow-hidden">
              {/* Folded corner with gradient */}
              <div 
                className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-pulse-500 to-orange-500 transform origin-bottom-left transition-all duration-1000 shadow-lg"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                  transform: `scale(${progress / 100}) rotate(${progress * 0.5}deg)`
                }}
              />
              
              {/* Document content lines */}
              <div className="p-6 space-y-3">
                <div className="h-2 bg-gradient-to-r from-pulse-200 to-orange-200 rounded animate-pulse" />
                <div className="h-2 bg-gradient-to-r from-pulse-200 to-orange-200 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="h-2 bg-gradient-to-r from-pulse-200 to-orange-200 rounded animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="h-2 bg-gradient-to-r from-pulse-200 to-orange-200 rounded animate-pulse w-3/4" style={{ animationDelay: '0.6s' }} />
              </div>

              {/* Sparkle effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-1 h-1 bg-pulse-400 rounded-full animate-ping" />
                <div className="absolute top-12 right-6 w-0.5 h-0.5 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
              </div>
            </div>

            {/* Floating sparkles around document */}
            <div className="absolute -top-2 -left-2">
              <Sparkles className="h-6 w-6 text-pulse-500 animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <Sparkles className="h-4 w-4 text-orange-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-6 mb-10 relative z-10">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <Progress 
              value={progress} 
              className="h-3 bg-gradient-to-r from-gray-200 to-gray-300"
              style={{
                background: `linear-gradient(to right, 
                  #FE5C02 0%, 
                  #ff7525 ${progress}%, 
                  #e5e7eb ${progress}%, 
                  #e5e7eb 100%)`
              }}
            />
            <div className="text-center mt-4">
              <p className="text-lg font-semibold bg-gradient-to-r from-pulse-600 to-orange-600 bg-clip-text text-transparent">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>
        </div>

        {/* File Name & Status */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pulse-100/80 to-orange-100/80 backdrop-blur-sm text-pulse-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-pulse-200/50 shadow-lg">
            <div className="w-5 h-5 bg-gradient-to-r from-pulse-500 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white animate-pulse" />
            </div>
            <span>Processing in progress</span>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-pulse-600 via-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Processing "{fileName}"
          </h3>
        </div>

        {/* Status Stages */}
        <div className="space-y-4 mb-8 relative z-10">
          {stages.map((stage, index) => (
            <div
              key={index}
              className={`flex items-center justify-center space-x-4 transition-all duration-500 p-4 rounded-2xl backdrop-blur-sm border ${
                index === currentStage 
                  ? 'bg-gradient-to-r from-pulse-50/80 to-orange-50/80 border-pulse-200/50 text-pulse-700 font-semibold shadow-lg scale-105' 
                  : index < currentStage 
                    ? 'bg-green-50/80 border-green-200/50 text-green-700 font-medium' 
                    : 'bg-white/40 border-white/30 text-gray-500'
              }`}
            >
              <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
                index === currentStage 
                  ? 'bg-gradient-to-r from-pulse-500 to-orange-500 animate-pulse shadow-lg' 
                  : index < currentStage 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-md' 
                    : 'bg-gray-300'
              }`} />
              <span className="text-sm font-medium">{stage.label}</span>
            </div>
          ))}
        </div>

        {/* Fun Message */}
        <div className="relative z-10">
          <div className="bg-gradient-to-r from-pulse-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl p-6 border border-pulse-200/50 shadow-lg">
            <p className="text-center text-pulse-700 font-medium text-lg">
              Hang tight—your brain's about to get lit! ✨🧠🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
