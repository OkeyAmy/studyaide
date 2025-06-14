// import React, { useState } from 'react';
// import { HelpCircle, Check, X, ChevronRight, RotateCcw } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { MaterialDisplay } from '@/types/api';
// import { Button } from '@/components/ui/button';

// interface MaterialQuizTabProps {
//   content: any;
//   material: MaterialDisplay;
// }

// const MaterialQuizTab = ({ content, material }: MaterialQuizTabProps) => {
//   const quiz = content?.quiz;
//   const questions = quiz?.questions || [];
  
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
//   const [showResult, setShowResult] = useState(false);
//   const [score, setScore] = useState(0);
//   const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
//     new Array(questions.length).fill(false)
//   );

//   if (!quiz || questions.length === 0) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6">
//         <HelpCircle className="h-16 w-16 text-white/80 mb-6" />
//         <h3 className="text-2xl font-bold mb-4">No Quiz Available</h3>
//         <p className="text-white/80">This material doesn't have a saved AI quiz</p>
//       </div>
//     );
//   }

//   const handleAnswerSelect = (answerIndex: number) => {
//     setSelectedAnswer(answerIndex);
//   };

//   const handleSubmit = () => {
//     setShowResult(true);
//     if (selectedAnswer === questions[currentQuestion].correctAnswer) {
//       setScore(prev => prev + 1);
//     }
    
//     setAnsweredQuestions(prev => {
//       const newAnswered = [...prev];
//       newAnswered[currentQuestion] = true;
//       return newAnswered;
//     });
//   };

//   const handleNext = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//       setSelectedAnswer(null);
//       setShowResult(false);
//     }
//   };

//   const resetQuiz = () => {
//     setCurrentQuestion(0);
//     setSelectedAnswer(null);
//     setShowResult(false);
//     setScore(0);
//     setAnsweredQuestions(new Array(questions.length).fill(false));
//   };

//   const progress = ((currentQuestion + 1) / questions.length) * 100;
//   const totalAnswered = answeredQuestions.filter(Boolean).length;
//   const isQuizComplete = totalAnswered === questions.length;
//   const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;

//   return (
//     <div className="h-full overflow-y-auto p-6">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//               <HelpCircle className="h-4 w-4 text-white" />
//             </div>
//             <h3 className="text-xl font-bold text-white">AI Quiz</h3>
//           </div>
//           <p className="text-white/80 text-sm mb-4">
//             {quiz.title || `Quiz for "${material?.title}"`}
//           </p>
          
//           {/* Progress */}
//           <div className="flex items-center justify-between text-sm text-white/70 mb-2">
//             <span>Question {currentQuestion + 1} of {questions.length}</span>
//             <span>Score: {score}/{totalAnswered}</span>
//           </div>
//           <div className="w-full bg-white/20 rounded-full h-2">
//             <div 
//               className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>

//         {/* Question */}
//         <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//           <h4 className="text-lg font-semibold text-white mb-6">
//             {questions[currentQuestion].question}
//           </h4>

//           {/* Answer Options */}
//           <div className="space-y-3">
//             {questions[currentQuestion].options.map((option: string, index: number) => (
//               <button
//                 key={index}
//                 onClick={() => !showResult && handleAnswerSelect(index)}
//                 disabled={showResult}
//                 className={cn(
//                   "w-full p-4 text-left rounded-xl border transition-all duration-200",
//                   showResult
//                     ? index === questions[currentQuestion].correctAnswer
//                       ? "bg-green-500/20 border-green-400 text-green-100"
//                       : index === selectedAnswer && index !== questions[currentQuestion].correctAnswer
//                         ? "bg-red-500/20 border-red-400 text-red-100"
//                         : "bg-white/5 border-white/10 text-white/60"
//                     : selectedAnswer === index
//                       ? "bg-white/20 border-white/40 text-white"
//                       : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
//                 )}
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className={cn(
//                     "w-6 h-6 rounded-full border-2 flex items-center justify-center",
//                     showResult
//                       ? index === questions[currentQuestion].correctAnswer
//                         ? "border-green-400 bg-green-400"
//                         : index === selectedAnswer && index !== questions[currentQuestion].correctAnswer
//                           ? "border-red-400 bg-red-400"
//                           : "border-white/20"
//                       : selectedAnswer === index
//                         ? "border-white bg-white"
//                         : "border-white/40"
//                   )}>
//                     {showResult && index === questions[currentQuestion].correctAnswer && (
//                       <Check className="h-3 w-3 text-white" />
//                     )}
//                     {showResult && index === selectedAnswer && index !== questions[currentQuestion].correctAnswer && (
//                       <X className="h-3 w-3 text-white" />
//                     )}
//                     {!showResult && selectedAnswer === index && (
//                       <div className="w-2 h-2 bg-blue-600 rounded-full" />
//                     )}
//                   </div>
//                   <span className="flex-1">{option}</span>
//                 </div>
//               </button>
//             ))}
//           </div>

//           {/* Explanation */}
//           {showResult && questions[currentQuestion].explanation && (
//             <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
//               <h5 className="font-medium text-white mb-2">Explanation:</h5>
//               <p className="text-white/80 text-sm">
//                 {questions[currentQuestion].explanation}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center">
//           {!showResult && selectedAnswer !== null ? (
//             <Button
//               onClick={handleSubmit}
//               className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2"
//             >
//               Submit Answer
//             </Button>
//           ) : showResult && currentQuestion < questions.length - 1 ? (
//             <Button
//               onClick={handleNext}
//               className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-2"
//             >
//               Next Question
//               <ChevronRight className="h-4 w-4 ml-2" />
//             </Button>
//           ) : showResult && isQuizComplete ? (
//             <div className="w-full text-center space-y-4">
//               <div className="bg-white/10 rounded-xl p-6 border border-white/20">
//                 <h3 className="text-xl font-bold text-white mb-2">Quiz Complete!</h3>
//                 <p className="text-white/80 mb-4">
//                   Final Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
//                 </p>
//                 <Button
//                   onClick={resetQuiz}
//                   className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
//                 >
//                   <RotateCcw className="h-4 w-4 mr-2" />
//                   Retake Quiz
//                 </Button>
//               </div>
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MaterialQuizTab; 



import React, { useState } from 'react';
import { HelpCircle, Check, X, ChevronRight, RotateCcw, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MaterialDisplay } from '@/types/api';
import { Button } from '@/components/ui/button';

interface MaterialQuizTabProps {
  content: any;
  material: MaterialDisplay;
}

const MaterialQuizTab = ({ content, material }: MaterialQuizTabProps) => {
  const quiz = content?.quiz;
  const questions = quiz?.questions || [];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 p-10 h-full">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4"><HelpCircle className="h-10 w-10 text-orange-400" /></div>
        <h3 className="text-lg font-bold text-gray-800">No Quiz For You... Yet!</h3>
        <p className="text-sm mt-1">AI hasn't generated a quiz for this material.</p>
      </div>
    );
  }

  const handleAnswerSelect = (index: number) => !showResult && setSelectedAnswer(index);
  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (selectedAnswer === questions[currentQuestion].correctAnswer) setScore(prev => prev + 1);
  };
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };
  const resetQuiz = () => { setCurrentQuestion(0); setSelectedAnswer(null); setShowResult(false); setScore(0); };

  const isQuizComplete = showResult && currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="p-6 space-y-8">
      {!isQuizComplete ? (
        <>
          <div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-orange-600">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="font-medium text-gray-500">Score: {score}</span>
            </div>
            <div className="w-full bg-orange-100 rounded-full h-2.5 mt-2">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">{questions[currentQuestion].question}</h3>
            <div className="space-y-3 pt-2">
              {questions[currentQuestion].options.map((option: string, index: number) => {
                const isCorrect = index === questions[currentQuestion].correctAnswer;
                let stateClass = "bg-white hover:bg-orange-50 border-gray-200";
                if (showResult) {
                  if (isCorrect) stateClass = "bg-green-100 border-green-300 text-green-800 font-semibold";
                  else if (selectedAnswer === index) stateClass = "bg-red-100 border-red-300 text-red-800";
                  else stateClass = "bg-gray-100 border-gray-200 text-gray-500 opacity-70";
                } else if (selectedAnswer === index) {
                  stateClass = "bg-orange-100 border-orange-400 ring-2 ring-orange-200";
                }
                return (
                  <button key={index} onClick={() => handleAnswerSelect(index)} disabled={showResult} className={cn("w-full p-4 text-left rounded-xl border-2 flex items-center space-x-4 transition-all duration-200", stateClass)}>
                    <div className={cn("flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold", showResult ? (isCorrect ? 'bg-green-500 text-white' : (selectedAnswer === index ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500')) : 'bg-orange-100 text-orange-600' )}>
                      {showResult ? (isCorrect ? <Check size={16}/> : (selectedAnswer === index && <X size={16}/>)) : String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {showResult && questions[currentQuestion].explanation && (
            <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-200/80">
              <h4 className="font-bold text-orange-800">💡 Explanation</h4>
              <p className="text-sm text-orange-900/80 mt-2">{questions[currentQuestion].explanation}</p>
            </div>
          )}

          <div className="flex justify-center items-center pt-4">
            {!showResult ? (
              <Button onClick={handleSubmit} disabled={selectedAnswer === null} size="lg" className="rounded-full font-semibold bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-shadow">Submit Answer</Button>
            ) : (
              <Button onClick={handleNext} size="lg" className="rounded-full font-semibold bg-gradient-to-br from-gray-700 to-gray-900 text-white">Next Question <ChevronRight className="h-5 w-5 ml-2" /></Button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-orange-200"><Check className="h-12 w-12 text-white" /></div>
            <h3 className="text-2xl font-bold text-gray-900">Quiz Complete!</h3>
            <p className="text-gray-600 mt-2">You scored</p>
            <div className="my-4 text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-500 to-orange-600">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <Button onClick={resetQuiz} size="lg" className="mt-6 rounded-full font-semibold">
              <RotateCcw className="h-4 w-4 mr-2" /> Retake Quiz
            </Button>
        </div>
      )}
    </div>
  );
};

export default MaterialQuizTab;