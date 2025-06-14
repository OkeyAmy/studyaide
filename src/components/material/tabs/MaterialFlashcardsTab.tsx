// import React, { useState } from 'react';
// import { Brain, ChevronLeft, ChevronRight, RotateCcw, Tag } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { MaterialDisplay } from '@/types/api';
// import { Button } from '@/components/ui/button';

// interface MaterialFlashcardsTabProps {
//   content: any;
//   material: MaterialDisplay;
// }

// const MaterialFlashcardsTab = ({ content, material }: MaterialFlashcardsTabProps) => {
//   const flashcards = content?.flashcards;
//   const cards = flashcards?.cards || [];
  
//   const [currentCard, setCurrentCard] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);

//   if (!flashcards || cards.length === 0) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6">
//         <Brain className="h-16 w-16 text-white/80 mb-6" />
//         <h3 className="text-2xl font-bold mb-4">No Flashcards Available</h3>
//         <p className="text-white/80">This material doesn't have saved AI flashcards</p>
//       </div>
//     );
//   }

//   const nextCard = () => {
//     setCurrentCard((prev) => (prev + 1) % cards.length);
//     setIsFlipped(false);
//   };

//   const prevCard = () => {
//     setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
//     setIsFlipped(false);
//   };

//   const handleCardClick = () => {
//     setIsFlipped(!isFlipped);
//   };

//   const resetCards = () => {
//     setCurrentCard(0);
//     setIsFlipped(false);
//   };

//   return (
//     <div className="h-full overflow-y-auto p-6">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//               <Brain className="h-4 w-4 text-white" />
//             </div>
//             <h3 className="text-xl font-bold text-white">AI Flashcards</h3>
//           </div>
//           <p className="text-white/80 text-sm mb-4">
//             {flashcards.title || `Flashcards for "${material?.title}"`}
//           </p>
          
//           {/* Progress */}
//           <div className="flex items-center justify-between text-sm text-white/70 mb-2">
//             <span>Card {currentCard + 1} of {cards.length}</span>
//             <span>Progress: {Math.round(((currentCard + 1) / cards.length) * 100)}%</span>
//           </div>
//           <div className="w-full bg-white/20 rounded-full h-2">
//             <div 
//               className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${((currentCard + 1) / cards.length) * 100}%` }}
//             />
//           </div>
//         </div>

//         {/* Flashcard */}
//         <div className="flex justify-center">
//           <div 
//             className="relative w-full max-w-md h-80 cursor-pointer"
//             onClick={handleCardClick}
//           >
//             <div 
//               className="absolute inset-0 w-full h-full transition-transform duration-500"
//               style={{
//                 transformStyle: 'preserve-3d',
//                 transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
//               }}
//             >
//               {/* Front of card */}
//               <div 
//                 className="absolute inset-0 w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 flex flex-col justify-center"
//                 style={{ backfaceVisibility: 'hidden' }}
//               >
//                 <div className="text-center space-y-4">
//                   <div className="text-sm text-blue-200 font-medium uppercase tracking-wide">Question</div>
//                   <h3 className="text-xl font-semibold text-white leading-relaxed">
//                     {cards[currentCard].question}
//                   </h3>
//                   {cards[currentCard].source && (
//                     <div className="text-sm text-white/60 mt-4">
//                       Source: {cards[currentCard].source}
//                     </div>
//                   )}
//                 </div>
//                 <div className="absolute bottom-4 right-4">
//                   <Tag className="h-4 w-4 text-white/40" />
//                 </div>
//                 <div className="absolute bottom-4 left-4 text-white/60 text-xs">
//                   Tap to flip
//                 </div>
//               </div>

//               {/* Back of card */}
//               <div 
//                 className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-purple-300/30 p-6 flex flex-col justify-center"
//                 style={{ 
//                   backfaceVisibility: 'hidden',
//                   transform: 'rotateY(180deg)'
//                 }}
//               >
//                 <div className="text-center space-y-4">
//                   <div className="text-sm text-purple-200 font-medium uppercase tracking-wide">Answer</div>
//                   <p className="text-lg text-white leading-relaxed">
//                     {cards[currentCard].answer}
//                   </p>
//                 </div>
//                 <div className="absolute bottom-4 left-4 text-white/60 text-xs">
//                   Tap to flip back
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="flex justify-center items-center space-x-4">
//           <Button
//             onClick={prevCard}
//             disabled={cards.length <= 1}
//             variant="outline"
//             size="sm"
//             className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
//           >
//             <ChevronLeft className="h-4 w-4 mr-1" />
//             Previous
//           </Button>
          
//           <div className="text-white/80 text-sm px-4">
//             {cards.length} card{cards.length !== 1 ? 's' : ''}
//           </div>
          
//           <Button
//             onClick={nextCard}
//             disabled={cards.length <= 1}
//             className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
//             size="sm"
//           >
//             Next
//             <ChevronRight className="h-4 w-4 ml-1" />
//           </Button>
//         </div>

//         {/* Study Instructions */}
//         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
//           <div className="flex items-start space-x-3">
//             <div className="w-6 h-6 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//               <Brain className="h-3 w-3 text-blue-200" />
//             </div>
//             <div>
//               <h4 className="font-medium text-white mb-2">How to Study</h4>
//               <ul className="text-white/80 text-sm space-y-1">
//                 <li>• Click the card to flip between question and answer</li>
//                 <li>• Try to answer before flipping to see the solution</li>
//                 <li>• Use Previous/Next to navigate between cards</li>
//                 <li>• Review multiple times for better retention</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Reset Button */}
//         {currentCard > 0 && (
//           <div className="text-center">
//             <Button
//               onClick={resetCards}
//               variant="outline"
//               size="sm"
//               className="bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
//             >
//               <RotateCcw className="h-4 w-4 mr-2" />
//               Start Over
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MaterialFlashcardsTab; 



import React, { useState } from 'react';
import { Brain, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MaterialDisplay } from '@/types/api';
import { Button } from '@/components/ui/button';

interface MaterialFlashcardsTabProps {
  content: any;
  material: MaterialDisplay;
}

const MaterialFlashcardsTab = ({ content, material }: MaterialFlashcardsTabProps) => {
  const flashcards = content?.flashcards;
  const cards = flashcards?.cards || [];
  
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 p-10 h-full">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4"><Brain className="h-10 w-10 text-orange-400" /></div>
        <h3 className="text-lg font-bold text-gray-800">No Flashcards Here!</h3>
        <p className="text-sm mt-1">AI hasn't cooked up any flashcards for this one.</p>
      </div>
    );
  }

  const nextCard = () => { setIsFlipped(false); setTimeout(() => setCurrentCard((p) => (p + 1) % cards.length), 150); };
  const prevCard = () => { setIsFlipped(false); setTimeout(() => setCurrentCard((p) => (p - 1 + cards.length) % cards.length), 150); };
  const resetCards = () => { setIsFlipped(false); setTimeout(() => setCurrentCard(0), 150); };

  return (
    <div className="p-6 space-y-6 flex flex-col h-full">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800">Flashcards</h3>
        <p className="text-sm text-gray-500 mt-1">{flashcards.title || `Study cards for "${material?.title}"`}</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md h-80 perspective-1000">
          <div className={cn("relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer", isFlipped && 'rotate-y-180')} onClick={() => setIsFlipped(!isFlipped)}>
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden rounded-3xl bg-white shadow-xl shadow-orange-500/10 p-8 flex flex-col justify-center items-center text-center border-2 border-orange-100">
              <div className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-4">Question</div>
              <h4 className="text-2xl font-semibold text-gray-800">{cards[currentCard].question}</h4>
              <span className="absolute bottom-5 text-xs text-gray-400 font-medium">Tap to reveal</span>
            </div>
            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl shadow-orange-500/30 p-8 flex flex-col justify-center items-center text-center">
              <div className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4">Answer</div>
              <p className="text-xl font-medium leading-relaxed">{cards[currentCard].answer}</p>
              <span className="absolute bottom-5 text-xs text-white/60 font-medium">Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center space-x-4">
        <Button onClick={prevCard} variant="outline" size="icon" className="w-14 h-14 rounded-full bg-white/80 shadow-sm" disabled={cards.length <= 1}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="text-sm text-gray-600 font-medium w-32 text-center">
            {currentCard + 1} / {cards.length}
        </div>
        <Button onClick={nextCard} variant="outline" size="icon" className="w-14 h-14 rounded-full bg-white/80 shadow-sm" disabled={cards.length <= 1}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

       {currentCard === cards.length - 1 && (
          <div className="text-center">
            <Button onClick={resetCards} variant="ghost" className="rounded-full text-gray-600 hover:bg-orange-100">
              <RotateCcw className="h-4 w-4 mr-2" /> Start Over
            </Button>
          </div>
        )}
    </div>
  );
};

export default MaterialFlashcardsTab;
