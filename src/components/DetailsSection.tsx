// import React from "react";

// const DetailsSection = () => {
//   const features = [
//     "AI-Powered Summaries",
//     "Automated Flashcards",
//     "Interactive Mind Maps",
//     "Audio/Video Transcription",
//     "Adaptive Quizzes"
//   ];

//   return (
//     <section id="details" className="w-full bg-white py-12">
//       <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
//         <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant mx-auto">
//           <div className="flex flex-col lg:flex-row">
//             {/* Left Card - Core Features with Styled UI */}
//             <div className="lg:w-1/2">
//           <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
//                 <div
//                   className="relative h-48 sm:h-64 p-6 sm:p-8 flex items-end"
//                   style={{
//             backgroundImage: "url('/background-section3.png')",
//             backgroundSize: "cover",
//             backgroundPosition: "center"
//                   }}
//                 >
//               <h2 className="text-2xl sm:text-3xl font-display text-white font-bold">
//                     Core Features
//               </h2>
//             </div>
//                 <div
//                   className="bg-white p-4 sm:p-8"
//                   style={{ backgroundColor: "#FFFFFF", border: "1px solid #ECECEC" }}
//                 >
//               <h3 className="text-lg sm:text-xl font-display mb-6 sm:mb-8">
//                     Unlock Your Full Learning Potential
//               </h3>

//               <div className="space-y-4 sm:space-y-6">
//                     {features.map((feature, index) => (
//                       <div key={index} className="flex items-start gap-3">
//                   <div className="w-6 h-6 rounded-full bg-dark-900 flex items-center justify-center mt-1 flex-shrink-0">
//                     <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                   </div>
//                   <div className="flex-1">
//                     <div className="p-3 rounded-lg bg-gray-50/80 backdrop-blur-sm border border-gray-100">
//                             <span className="font-semibold text-base">{feature}</span>
//                     </div>
//                   </div>
//                 </div>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//             {/* Right Side - Live Demo Video with Header */}
//             <div className="lg:w-1/2">
//               <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant mx-auto">
//                 <div
//                   className="relative h-48 sm:h-64 p-6 sm:p-8 flex items-end"
//                   style={{
//             backgroundImage: "url('/background-section1.png')",
//             backgroundSize: "cover",
//             backgroundPosition: "center"
//                   }}
//                 >
//                   <div className="inline-block px-4 py-2 border border-white text-white rounded-full text-xs mb-4">
//                 Request a demo
//               </div>
//               <h2 className="text-2xl sm:text-3xl font-display text-white font-bold mt-auto">
//                 See it for yourself
//               </h2>
//             </div>
//                 <video
//                   src="/Generated File June 07, 2025 - 11_08AM.mp4"
//                   autoPlay
//                   muted
//                   loop
//                   playsInline
//                   controls
//                   className="rounded-xl w-full h-auto object-cover"
//                   />
//                 </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DetailsSection;

import React from "react";

const DetailsSection = () => {
  const features = [
    "AI-Powered Summaries",
    "Automated Flashcards", 
    "Interactive Mind Maps",
    "Audio/Video Transcription",
    "Adaptive Quizzes"
  ];

  return (
    <section id="details" className="w-full bg-white py-0">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Card - Core Features */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            {/* Header with background image */}
            <div className="relative h-48 sm:h-64 p-6 sm:p-8 flex items-end" style={{
              backgroundImage: "url('/background-section3.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}>
              <h2 className="text-2xl sm:text-3xl font-display text-white font-bold">
                Core Features
              </h2>
            </div>
            
            {/* Content */}
            <div className="bg-white p-4 sm:p-8" style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECECEC"
            }}>
              <h3 className="text-lg sm:text-xl font-display mb-6 sm:mb-8">
                Unlock Your Full Learning Potential
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-dark-900 flex items-center justify-center mt-1 flex-shrink-0">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="p-3 rounded-lg bg-gray-50/80 backdrop-blur-sm border border-gray-100">
                        <span className="font-semibold text-base">{feature}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card - Demo Video */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            {/* Header with background image */}
            <div className="relative h-48 sm:h-64 p-6 sm:p-8 flex flex-col items-start" style={{
              backgroundImage: "url('/background-section1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}>
              <div className="inline-block px-4 sm:px-6 py-2 border border-white text-white rounded-full text-xs mb-4">
                Live demo
              </div>
              <h2 className="text-2xl sm:text-3xl font-display text-white font-bold mt-auto">
                See it for yourself
              </h2>
            </div>
            
            {/* Video Content */}
            <div className="bg-white p-4 sm:p-8" style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECECEC"
            }}>
              <video
                src="/Generated File June 07, 2025 - 11_08AM.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                className="rounded-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;