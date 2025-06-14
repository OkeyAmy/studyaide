// import React from 'react';
// import { FileText, Sparkles } from 'lucide-react';
// import { MaterialDisplay } from '@/types/api';
// import ReactMarkdown from 'react-markdown';
// import rehypeRaw from 'rehype-raw';
// import rehypeSanitize from 'rehype-sanitize';

// interface MaterialSummaryTabProps {
//   content: any;
//   material: MaterialDisplay;
// }

// const MaterialSummaryTab = ({ content, material }: MaterialSummaryTabProps) => {
//   const summary = content?.summary || content?.polishedNote || '';

//   if (!summary) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center text-center p-6">
//         <FileText className="h-16 w-16 text-white/80 mb-6" />
//         <h3 className="text-2xl font-bold mb-4">No Summary Available</h3>
//         <p className="text-white/80">This material doesn't have a saved AI summary</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full overflow-y-auto p-6">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//               <FileText className="h-4 w-4 text-white" />
//             </div>
//             <h3 className="text-xl font-bold text-white">AI Summary</h3>
//           </div>
//           <p className="text-white/80 text-sm">
//             Generated summary for "{material?.title}"
//           </p>
//         </div>

//         {/* Summary Content */}
//         <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//           <div className="prose prose-invert max-w-none text-white leading-relaxed">
//             <ReactMarkdown 
//               rehypePlugins={[rehypeRaw, rehypeSanitize]}
//             >
//               {summary}
//             </ReactMarkdown>
//           </div>
//         </div>

//         {/* Study Tip */}
//         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
//           <div className="flex items-start space-x-3">
//             <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//               <Sparkles className="h-3 w-3 text-yellow-200" />
//             </div>
//             <div>
//               <h4 className="font-medium text-white mb-1">Study Tip</h4>
//               <p className="text-white/80 text-sm">
//                 Use this summary as a quick review before exploring the other study materials like flashcards and quizzes.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MaterialSummaryTab; 

import React from 'react';
import { FileText, Sparkles, BookOpen, Target } from 'lucide-react';
import { MaterialDisplay } from '@/types/api';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface MaterialSummaryTabProps {
  content: any;
  material: MaterialDisplay;
}

const MaterialSummaryTab = ({ content, material }: MaterialSummaryTabProps) => {
  const summary = content?.summary || content?.polishedNote || '';

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-96 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl border border-orange-100 shadow-lg">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">Summary In Progress</h3>
        <p className="text-gray-500 max-w-sm">AI is crafting a comprehensive summary that captures all the key insights from this material</p>
        <div className="flex items-center space-x-2 mt-4 text-sm text-orange-600">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <span>Analyzing content structure...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-6 shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Summary</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {material?.title || 'Study Material Summary'}
          </h3>
          <p className="text-white/90 text-sm">
            Key insights and takeaways, distilled by artificial intelligence
          </p>
        </div>
      </div>

      {/* Summary Content with proper markdown rendering */}
      <div className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-2xl border border-orange-100 shadow-xl overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full opacity-30 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-100 to-transparent rounded-full opacity-40 translate-y-12 -translate-x-12"></div>
        
        {/* Summary content with scrollable area */}
        <div className="relative max-h-[32rem] overflow-y-auto px-6 py-6 scroll-smooth scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                h1: (props) => (
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-6 pb-3 border-b-2 border-orange-200" {...props} />
                ),
                h2: (props) => (
                  <h2 className="text-2xl font-bold text-orange-800 mt-8 mb-4 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-amber-600 rounded-full mr-3"></div>
                    <span {...props} />
                  </h2>
                ),
                h3: (props) => (
                  <h3 className="text-xl font-semibold text-orange-700 mt-6 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    <span {...props} />
                  </h3>
                ),
                p: (props) => (
                  <p className="text-gray-700 leading-relaxed mb-4 text-base" {...props} />
                ),
                ul: (props) => (
                  <ul className="space-y-2 mb-6" {...props} />
                ),
                ol: (props) => (
                  <ol className="space-y-2 mb-6" {...props} />
                ),
                li: (props) => (
                  <li className="text-gray-700 leading-relaxed flex items-start">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                    <span {...props} />
                  </li>
                ),
                strong: (props) => (
                  <strong className="font-bold bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent" {...props} />
                ),
                em: (props) => (
                  <em className="italic text-amber-600 font-medium" {...props} />
                ),
                blockquote: (props) => (
                  <blockquote className="border-l-4 border-orange-400 bg-orange-50/50 pl-4 py-2 my-4 rounded-r-lg italic text-gray-600" {...props} />
                ),
                code: (props) => (
                  <code className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-mono text-sm" {...props} />
                ),
                pre: (props) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm" {...props} />
                ),
                a: (props) => (
                  <a className="text-orange-600 hover:text-orange-700 underline font-medium" {...props} />
                ),
                table: (props) => (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-orange-200 rounded-lg overflow-hidden" {...props} />
                  </div>
                ),
                th: (props) => (
                  <th className="bg-orange-100 text-orange-800 font-semibold p-3 text-left border-b border-orange-200" {...props} />
                ),
                td: (props) => (
                  <td className="p-3 border-b border-orange-100 text-gray-700" {...props} />
                ),
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </div>

        {/* Action footer */}
        <div className="relative bg-gradient-to-r from-orange-50/80 to-amber-50/80 px-6 py-4 border-t border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-orange-600">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>AI-Generated • Ready for Study</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-orange-500">
              <BookOpen className="h-4 w-4" />
              <span>Summary Complete</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MaterialSummaryTab;