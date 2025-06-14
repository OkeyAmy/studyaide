import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useStudySession } from '@/contexts/StudySessionContext';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const SummaryTab = () => {
  const { sessionData, generateSummary, isGeneratingContent } = useStudySession();

  const handleGenerateSummary = async () => {
    await generateSummary();
  };

  // Fallback demo data for when no AI summary is available
  const fallbackData = {
    title: "Neural Networks 101",
    sections: [
      {
        id: "key-concepts",
        title: "Key Concepts",
        content: [
          "Neural plasticity enables lifelong learning and adaptation",
          "Hebbian learning: 'Neurons that fire together wire together'",
          "Action potentials are the electrical basis of neural communication",
          "Synaptic transmission involves chemical and electrical signals"
        ]
      },
      {
        id: "definitions",
        title: "Definitions & Terms",
        content: [
          "Neuron: Basic unit of the nervous system that transmits information",
          "Synapse: Junction between two neurons where communication occurs",
          "Neurotransmitter: Chemical messenger that transmits signals across synapses",
          "Myelin: Fatty substance that insulates axons and speeds signal transmission"
        ]
      },
      {
        id: "takeaways",
        title: "Major Takeaways",
        content: [
          "The brain's ability to reorganize is fundamental to learning",
          "Understanding neural communication helps explain behavior and cognition",
          "Different types of neurons serve specialized functions",
          "Neural networks form the basis of both biological and artificial intelligence"
        ]
      },
      {
        id: "action-items",
        title: "Action Items/Next Steps",
        content: [
          "Review synaptic transmission mechanisms",
          "Practice identifying different neuron types",
          "Explore applications in artificial neural networks",
          "Study upcoming chapter on neural development"
        ]
      }
    ]
  };

  const hasAISummary = sessionData?.summary && sessionData.summary.trim().length > 0;
  const hasNote = sessionData?.polishedNote;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span>AI-Generated Summary</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-900 via-violet-800 to-purple-700 bg-clip-text text-transparent uppercase tracking-wide">
          {sessionData?.fileName || fallbackData.title}
        </h2>
      </div>

      {/* Generate Summary Button */}
      {!hasAISummary && hasNote && (
        <div className="text-center">
          <button
            onClick={handleGenerateSummary}
            disabled={isGeneratingContent}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {isGeneratingContent ? (
              <>
                <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                <span className="text-lg font-medium">Generating Summary...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                <span className="text-lg font-medium">Generate AI Summary</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* AI Summary Content */}
      {hasAISummary ? (
        <div className="relative bg-gradient-to-br from-purple-50 via-white to-violet-50 rounded-2xl border border-purple-100 shadow-xl overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-full opacity-30 -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-violet-100 to-transparent rounded-full opacity-40 translate-y-12 -translate-x-12"></div>
          
          {/* Summary content */}
          <div className="relative max-h-[32rem] overflow-y-auto px-6 py-6 scroll-smooth scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: (props) => (
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-900 via-violet-800 to-purple-700 bg-clip-text text-transparent mb-6 pb-3 border-b-2 border-purple-200" {...props} />
                  ),
                  h2: (props) => (
                    <h2 className="text-2xl font-bold text-purple-800 mt-8 mb-4 flex items-center">
                      <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-violet-600 rounded-full mr-3"></div>
                      <span {...props} />
                    </h2>
                  ),
                  h3: (props) => (
                    <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                      <span {...props} />
                    </h3>
                  ),
                  p: (props) => (
                    <p className="text-gray-700 leading-relaxed mb-4 text-base" {...props} />
                  ),
                  ul: (props) => (
                    <ul className="space-y-2 mb-6" {...props} />
                  ),
                  li: (props) => (
                    <li className="text-gray-700 leading-relaxed flex items-start">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                      <span {...props} />
                    </li>
                  ),
                  strong: (props) => (
                    <strong className="font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent" {...props} />
                  ),
                  em: (props) => (
                    <em className="italic text-violet-600 font-medium" {...props} />
                  ),
                  blockquote: (props) => (
                    <blockquote className="border-l-4 border-purple-400 bg-purple-50/50 pl-4 py-2 my-4 rounded-r-lg italic text-gray-600" {...props} />
                  )
                }}
              >
                {sessionData?.summary || ''}
              </ReactMarkdown>
            </div>
          </div>

          {/* Action footer */}
          <div className="relative bg-gradient-to-r from-purple-50/80 to-violet-50/80 px-6 py-4 border-t border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-purple-600">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>AI-Generated • Ready for Study</span>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingContent}
                className="group inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <RefreshCw className={`h-4 w-4 mr-2 transition-transform duration-200 ${isGeneratingContent ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                {isGeneratingContent ? 'Regenerating...' : 'Regenerate Summary'}
              </button>
            </div>
          </div>
        </div>
      ) : hasNote ? (
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 text-center border border-purple-200 shadow-sm">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-purple-800 mb-2">Ready to Generate Summary</h3>
          <p className="text-purple-600 mb-4">
            Transform your content into a comprehensive AI summary
          </p>
          <p className="text-sm text-purple-500">
            Click the button above to create a structured, easy-to-digest summary
          </p>
        </div>
      ) : (
        /* Fallback Demo Content */
        <div className="bg-white rounded-2xl border border-purple-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-100 to-violet-50 px-6 py-4 border-b border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800">Demo Study Material</h3>
            <p className="text-sm text-purple-600">Sample content to get you started</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {fallbackData.sections.map((section, index) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="px-6 py-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 text-left transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">{index + 1}</span>
                    </div>
                    <span className="font-semibold text-purple-900">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 ml-11">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full mt-2.5 flex-shrink-0" />
                        <p className="text-gray-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Study Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200 shadow-sm">
        <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">💡</span>
          </div>
          Study Tip
        </h3>
        <p className="text-purple-800 text-sm leading-relaxed">
          Use this summary as a quick review before diving into flashcards or taking the quiz. 
          Each section builds on the previous one, so make sure you understand the key concepts first.
        </p>
      </div>
    </div>
  );
};

export default SummaryTab;
