import React, { useState } from 'react';
import { ChevronUp, Tag, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudySession } from '@/contexts/StudySessionContext';

const FlashcardsTab = () => {
  const { sessionData, generateFlashcards, isGeneratingContent } = useStudySession();
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Get flashcards from session data or use fallback
  const flashcards = sessionData?.flashcards?.cards || [
    {
      question: "What is the main topic of this material?",
      answer: "This study material covers various educational concepts and topics that have been processed for learning.",
      source: sessionData?.fileName || "Study Material"
    }
  ];

  const flashcardTitle = sessionData?.flashcards?.title || `Flashcards: ${sessionData?.fileName || 'Study Material'}`;

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSwipe = (e: React.TouchEvent) => {
    // Simple swipe detection
    const touch = e.changedTouches[0];
    if (touch) {
      nextCard();
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!sessionData?.polishedNote) {
      return;
    }
    await generateFlashcards();
    setCurrentCard(0);
    setIsFlipped(false);
  };

  if (!sessionData?.polishedNote) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Sparkles className="h-12 w-12 mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">No Content Available</p>
        <p className="text-sm text-center">Upload a file or record audio to generate flashcards</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{flashcardTitle}</h3>
          <p className="text-sm text-gray-600">{flashcards.length} cards available</p>
        </div>
        {!sessionData.flashcards && (
          <button
            onClick={handleGenerateFlashcards}
            disabled={isGeneratingContent}
            className="flex items-center space-x-2 px-4 py-2 bg-pulse-500 text-white rounded-lg hover:bg-pulse-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={cn("h-4 w-4", isGeneratingContent && "animate-spin")} />
            <span>{isGeneratingContent ? 'Generating...' : 'Generate Flashcards'}</span>
          </button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Card {currentCard + 1} of {flashcards.length}
        </span>
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-pulse-500 transition-all duration-300"
            style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center">
        <div 
          className="relative w-full max-w-md h-80 cursor-pointer"
          onClick={handleCardClick}
          onTouchEnd={handleSwipe}
        >
          <div className={cn(
            "absolute inset-0 w-full h-full transition-transform duration-500 preserve-3d",
            isFlipped && "rotate-y-180"
          )}>
            {/* Front of card */}
            <div className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col justify-center backface-hidden">
              <div className="text-center space-y-4">
                <div className="text-sm text-pulse-600 font-medium">Question</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {flashcards[currentCard].question}
                </h3>
                {flashcards[currentCard].source && (
                  <div className="text-sm text-gray-500">
                    {flashcards[currentCard].source}
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 right-4">
                <Tag className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute inset-0 w-full h-full bg-pulse-50 rounded-xl shadow-lg border border-pulse-200 p-6 flex flex-col justify-center rotate-y-180 backface-hidden">
              <div className="text-center space-y-4">
                {/* <div className="text-sm text-pulse-600 font-medium">Answer</div> */}
                <p className="text-lg text-gray-900 leading-relaxed">
                  {flashcards[currentCard].answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={prevCard}
          disabled={flashcards.length <= 1}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={nextCard}
          disabled={flashcards.length <= 1}
          className="px-4 py-2 bg-pulse-500 text-white rounded-lg hover:bg-pulse-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Swipe Hint */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <ChevronUp className="h-4 w-4" />
          <span>Swipe up for next • Tap to flip</span>
        </div>
      </div>

      {/* Regenerate Button */}
      {sessionData.flashcards && (
        <div className="text-center">
          <button
            onClick={handleGenerateFlashcards}
            disabled={isGeneratingContent}
            className="text-sm text-pulse-600 hover:text-pulse-700 underline disabled:opacity-50"
          >
            {isGeneratingContent ? 'Regenerating...' : 'Regenerate Flashcards'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardsTab;
