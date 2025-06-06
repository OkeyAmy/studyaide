
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SummaryTab = () => {
  const summaryData = {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
          <span>📄</span>
          <span>Digital Zine Summary</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
          {summaryData.title}
        </h2>
      </div>

      {/* Accordion Summary */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          {summaryData.sections.map((section, index) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3 ml-11">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Study Tips */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Study Tip
        </h3>
        <p className="text-blue-800 text-sm">
          Use this summary as a quick review before diving into flashcards or taking the quiz. 
          Each section builds on the previous one, so make sure you understand the key concepts first.
        </p>
      </div>
    </div>
  );
};

export default SummaryTab;
