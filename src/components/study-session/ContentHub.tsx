
import React, { useState } from 'react';
import { Brain, FileText, Network, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import FlashcardsTab from './tabs/FlashcardsTab';
import SummaryTab from './tabs/SummaryTab';
import MindMapTab from './tabs/MindMapTab';
import QuizTab from './tabs/QuizTab';

interface ContentHubProps {
  fileName: string;
  fileType: string;
}

type TabType = 'flashcards' | 'summary' | 'mindmap' | 'quiz';

const ContentHub = ({ fileName, fileType }: ContentHubProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('flashcards');

  const tabs = [
    {
      id: 'flashcards' as TabType,
      label: 'Flashcards',
      icon: Brain,
      description: 'Swipe up to level up',
      color: 'bg-pulse-500'
    },
    {
      id: 'summary' as TabType,
      label: 'Summary',
      icon: FileText,
      description: 'TL;DR of your lecture',
      color: 'bg-blue-500'
    },
    {
      id: 'mindmap' as TabType,
      label: 'Mind Map',
      icon: Network,
      description: 'See the whole picture',
      color: 'bg-green-500'
    },
    {
      id: 'quiz' as TabType,
      label: 'Quiz',
      icon: HelpCircle,
      description: 'Test your brain',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="pulse-chip mb-4 inline-flex">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white mr-2">✓</span>
          <span>Processing Complete</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Study Materials Are Ready!
        </h1>
        <p className="text-gray-600 text-lg">
          Choose how you want to study "{fileName}"
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 min-w-0 px-6 py-4 text-center transition-all duration-300 border-b-2",
                  activeTab === tab.id
                    ? "border-pulse-500 bg-pulse-50 text-pulse-700"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    activeTab === tab.id ? tab.color : "bg-gray-200"
                  )}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'flashcards' && <FlashcardsTab />}
          {activeTab === 'summary' && <SummaryTab />}
          {activeTab === 'mindmap' && <MindMapTab />}
          {activeTab === 'quiz' && <QuizTab />}
        </div>
      </div>

      {/* Save/Archive Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Save to Knowledge Hub</h3>
            <p className="text-sm text-gray-600">Keep these study materials for future reference</p>
          </div>
          <button className="px-6 py-2 bg-pulse-500 text-white rounded-lg hover:bg-pulse-600 transition-colors">
            Add to Hub
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentHub;
