
import React, { useState } from 'react';
import { Check, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const QuizTab = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      type: 'multiple-choice',
      question: 'What does Hebbian learning state?',
      options: [
        'Neurons that fire together wire together',
        'Neurons work independently of each other',
        'Learning only occurs during sleep',
        'All neurons fire at the same rate'
      ],
      correct: 0,
      explanation: 'Hebbian learning is the principle that synaptic connections strengthen when neurons fire simultaneously.'
    },
    {
      type: 'true-false',
      question: 'Neural plasticity only occurs in young brains.',
      options: ['True', 'False'],
      correct: 1,
      explanation: 'Neural plasticity continues throughout life, allowing for lifelong learning and adaptation.'
    },
    {
      type: 'multiple-choice',
      question: 'What are action potentials?',
      options: [
        'Chemical signals between neurons',
        'Electrical impulses that travel along neurons',
        'Physical connections between brain regions',
        'Memories stored in the brain'
      ],
      correct: 1,
      explanation: 'Action potentials are electrical impulses that neurons use to transmit information.'
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    setShowResult(true);
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const isCorrect = selectedAnswer === questions[currentQuestion].correct;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Question */}
          <div className="mb-6">
            <div className="text-sm text-purple-600 font-medium mb-2">
              {questions[currentQuestion].type === 'true-false' ? 'True or False' : 'Multiple Choice'}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {questions[currentQuestion].question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                  showResult
                    ? index === questions[currentQuestion].correct
                      ? "border-green-500 bg-green-50 text-green-800"
                      : index === selectedAnswer && index !== questions[currentQuestion].correct
                        ? "border-red-500 bg-red-50 text-red-800"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    : selectedAnswer === index
                      ? "border-purple-500 bg-purple-50 text-purple-800"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-25"
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && (
                    <div>
                      {index === questions[currentQuestion].correct && (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
                      {index === selectedAnswer && index !== questions[currentQuestion].correct && (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          {!showResult && selectedAnswer !== null && (
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Submit Answer
            </button>
          )}

          {/* Result & Explanation */}
          {showResult && (
            <div className={cn(
              "p-4 rounded-lg border-2",
              isCorrect
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            )}>
              <div className="flex items-center space-x-2 mb-2">
                {isCorrect ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
                <span className={cn(
                  "font-medium",
                  isCorrect ? "text-green-800" : "text-red-800"
                )}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className={cn(
                "text-sm",
                isCorrect ? "text-green-700" : "text-red-700"
              )}>
                {questions[currentQuestion].explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {showResult && currentQuestion < questions.length - 1 && (
            <button
              onClick={handleNext}
              className="w-full mt-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center"
            >
              Next Question
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          )}

          {/* Final Score */}
          {showResult && currentQuestion === questions.length - 1 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-center">
                <h4 className="font-semibold text-blue-900 mb-2">Quiz Complete!</h4>
                <p className="text-blue-800">
                  Your score: {score + (isCorrect ? 1 : 0)} out of {questions.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Tips */}
      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
        <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
          <span className="mr-2">🎯</span>
          Quiz Strategy
        </h4>
        <p className="text-purple-800 text-sm">
          Take your time and think through each answer. The explanations will help reinforce your understanding of the material.
        </p>
      </div>
    </div>
  );
};

export default QuizTab;
