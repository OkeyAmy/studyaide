
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle, Network, FileText } from 'lucide-react';
import { MaterialDisplay } from '@/types/api';

interface Tool {
  id: 'summary' | 'quiz' | 'flashcards' | 'mindmap';
  label: string;
  icon: React.ElementType;
  color: string;
}

interface StudyToolContentProps {
  tool: Tool;
  selectedMaterial: MaterialDisplay | null;
}

const StudyToolContent = ({ tool, selectedMaterial }: StudyToolContentProps) => {
  const savedContent = selectedMaterial?.parsedContent || {};
  
  switch (tool.id) {
    case 'summary':
      return (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
            <h3 className="font-semibold text-blue-900 mb-3">AI Summary</h3>
            <p className="text-blue-800">
              {savedContent.summary || "Generate an AI-powered summary of this material to get the key insights and main points."}
            </p>
          </div>
          {!savedContent.summary && (
            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl">
              <Brain className="h-4 w-4 mr-2" />
              Generate Summary
            </Button>
          )}
        </div>
      );
    case 'quiz':
      return (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <h3 className="font-semibold text-green-900 mb-3">Practice Quiz</h3>
            <p className="text-green-800 mb-4">
              Test your knowledge with AI-generated questions based on this material.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-white/70 rounded-xl">
                <p className="font-medium text-gray-900">Sample Question 1</p>
                <p className="text-sm text-gray-600">What are the main concepts covered in this material?</p>
              </div>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl">
            <CheckCircle className="h-4 w-4 mr-2" />
            Start Quiz
          </Button>
        </div>
      );
    case 'flashcards':
      return (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
            <h3 className="font-semibold text-orange-900 mb-3">Flashcards</h3>
            <p className="text-orange-800 mb-4">
              Study with interactive flashcards for active recall and retention.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/70 rounded-xl text-center">
                <div className="h-16 flex items-center justify-center">
                  <p className="text-sm font-medium">Front</p>
                </div>
              </div>
              <div className="p-3 bg-white/70 rounded-xl text-center">
                <div className="h-16 flex items-center justify-center">
                  <p className="text-sm font-medium">Back</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl">
            <Brain className="h-4 w-4 mr-2" />
            Study Flashcards
          </Button>
        </div>
      );
    case 'mindmap':
      return (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl">
            <h3 className="font-semibold text-purple-900 mb-3">Mind Map</h3>
            <p className="text-purple-800 mb-4">
              Visualize concepts and their relationships in an interactive mind map.
            </p>
            <div className="h-32 bg-white/70 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Network className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Mind map preview</p>
              </div>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-2xl">
            <Network className="h-4 w-4 mr-2" />
            View Mind Map
          </Button>
        </div>
      );
    default:
      return <div>Select a tool to get started</div>;
  }
};

export default StudyToolContent;
