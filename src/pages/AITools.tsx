
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsGrid from '@/components/shared/StatsGrid';
import SmartSummaryGenerator from '@/components/ai-tools/SmartSummaryGenerator';
import AdaptiveFlashcardCreator from '@/components/ai-tools/AdaptiveFlashcardCreator';
import QuizGenerator from '@/components/ai-tools/QuizGenerator';
import LearningPathOptimizer from '@/components/ai-tools/LearningPathOptimizer';
import { createStatsFromMetrics, createToolsFromMetrics, createInsightsFromMetrics } from '@/data/ai-tools-data';
import { useAIToolsMetrics } from '@/hooks/useAIToolsMetrics';
import AIToolsGrid from '@/components/ai-tools/AIToolsGrid';
import AIInsightsSection from '@/components/ai-tools/AIInsightsSection';

const AITools = () => {
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [launchedTool, setLaunchedTool] = useState<number | null>(null);
  const [showSummaryGenerator, setShowSummaryGenerator] = useState(false);
  const [showFlashcardCreator, setShowFlashcardCreator] = useState(false);
  const [showQuizGenerator, setShowQuizGenerator] = useState(false);
  const [showLearningPathOptimizer, setShowLearningPathOptimizer] = useState(false);

  const { data: metrics, isLoading } = useAIToolsMetrics();

  const handleLaunchTool = (toolId: number) => {
    if (toolId === 1) {
      setShowSummaryGenerator(true);
      return;
    }
    
    if (toolId === 2) {
      setShowFlashcardCreator(true);
      return;
    }
    
    if (toolId === 3) {
      setShowQuizGenerator(true);
      return;
    }
    
    if (toolId === 4) {
      setShowLearningPathOptimizer(true);
      return;
    }
    
    setLaunchedTool(toolId);
    setTimeout(() => {
      setLaunchedTool(null);
      alert(`AI Tool ${toolId} launched successfully!`);
    }, 2000);
  };

  // Use real metrics or loading state
  const stats = metrics ? createStatsFromMetrics(metrics) : [];
  const aiTools = metrics ? createToolsFromMetrics(metrics) : [];
  const aiInsights = metrics ? createInsightsFromMetrics(metrics) : [];

  if (isLoading) {
    return (
      <AppLayout activeSession="ai-tools">
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Loading AI Tools metrics...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeSession="ai-tools">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Tools</h1>
              <p className="text-gray-600 text-lg">Powerful AI-driven study assistants</p>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsGrid stats={stats} />

          {/* AI Tools Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Available Tools</h2>
              <Button variant="outline" size="sm" className="bg-white/70 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-xl">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            <AIToolsGrid 
              tools={aiTools}
              selectedTool={selectedTool}
              launchedTool={launchedTool}
              onSelectTool={setSelectedTool}
              onLaunchTool={handleLaunchTool}
            />
          </div>

          {/* AI Insights */}
          <AIInsightsSection insights={aiInsights} />
        </div>
      </div>

      {/* Modals */}
      <SmartSummaryGenerator 
        isOpen={showSummaryGenerator}
        onClose={() => setShowSummaryGenerator(false)}
      />
      <AdaptiveFlashcardCreator 
        isOpen={showFlashcardCreator}
        onClose={() => setShowFlashcardCreator(false)}
      />
      <QuizGenerator 
        isOpen={showQuizGenerator}
        onClose={() => setShowQuizGenerator(false)}
      />
      <LearningPathOptimizer 
        isOpen={showLearningPathOptimizer}
        onClose={() => setShowLearningPathOptimizer(false)}
      />
    </AppLayout>
  );
};

export default AITools;
