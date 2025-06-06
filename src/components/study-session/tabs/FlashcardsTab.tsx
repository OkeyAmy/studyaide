
import React, { useState } from 'react';
import { ChevronUp, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const FlashcardsTab = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Mock flashcard data
  const flashcards = [
    {
      question: "What is Hebbian Learning?",
      answer: "A theory stating that neurons that fire together wire together, strengthening the synaptic connections between them.",
      source: "Chapter 5, Neuroinformatics Lecture"
    },
    {
      question: "Define Neural Plasticity",
      answer: "The brain's ability to reorganize itself by forming new neural connections throughout life, allowing adaptation to new experiences.",
      source: "Chapter 3, Brain Development"
    },
    {
      question: "What are Action Potentials?",
      answer: "Electrical impulses that travel along neurons to transmit information throughout the nervous system.",
      source: "Chapter 2, Neural Communication"
    }
  ];

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

  return (
    <div className="space-y-6">
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
                <div className="text-sm text-gray-500">
                  {flashcards[currentCard].source}
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <Tag className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute inset-0 w-full h-full bg-pulse-50 rounded-xl shadow-lg border border-pulse-200 p-6 flex flex-col justify-center rotate-y-180 backface-hidden">
              <div className="text-center space-y-4">
                <div className="text-sm text-pulse-600 font-medium">Answer</div>
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
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={nextCard}
          className="px-4 py-2 bg-pulse-500 text-white rounded-lg hover:bg-pulse-600 transition-colors"
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
    </div>
  );
};

export default FlashcardsTab;
