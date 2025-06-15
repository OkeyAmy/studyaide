import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Brain, Sparkles, Zap, Target, TrendingUp, Clock, Play, Settings, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsGrid from '@/components/shared/StatsGrid';
import SessionCard from '@/components/shared/SessionCard';
import SmartSummaryGenerator from '@/components/ai-tools/SmartSummaryGenerator';
import AdaptiveFlashcardCreator from '@/components/ai-tools/AdaptiveFlashcardCreator';

const AITools = () => {
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [launchedTool, setLaunchedTool] = useState<number | null>(null);
  const [showSummaryGenerator, setShowSummaryGenerator] = useState(false);
  const [showFlashcardCreator, setShowFlashcardCreator] = useState(false);

  const stats = [
    {
      label: 'AI Interactions',
      value: 156,
      icon: Brain,
      color: 'bg-gradient-to-r from-purple-500 to-violet-600',
      trend: '+23 today',
      trendDirection: 'up' as const
    },
    {
      label: 'Time Saved',
      value: '8.5h',
      icon: Clock,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      trend: 'This week',
      trendDirection: 'up' as const
    },
    {
      label: 'Accuracy',
      value: '+23%',
      icon: Target,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      trend: 'Improvement',
      trendDirection: 'up' as const
    },
    {
      label: 'Efficiency',
      value: '+31%',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-pulse-500 to-orange-600',
      trend: 'Study boost',
      trendDirection: 'up' as const
    }
  ];

  const aiTools = [
    {
      id: 1,
      name: "Smart Summary Generator",
      description: "Generate concise summaries from any content using advanced AI",
      usage: "24 times this week",
      lastUsed: "2 hours ago",
      icon: Brain,
      status: "active",
      efficiency: "+45%",
      accuracy: "94%",
      color: "from-purple-500 to-violet-600"
    },
    {
      id: 2,
      name: "Adaptive Flashcard Creator",
      description: "AI creates personalized flashcards based on your learning style",
      usage: "18 times this week",
      lastUsed: "1 day ago",
      icon: Sparkles,
      status: "active",
      efficiency: "+38%",
      accuracy: "91%",
      color: "from-pink-500 to-rose-600"
    },
    {
      id: 3,
      name: "Quiz Generator",
      description: "Generate practice quizzes from your study materials",
      usage: "12 times this week",
      lastUsed: "2 days ago",
      icon: Target,
      status: "active",
      efficiency: "+29%",
      accuracy: "87%",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 4,
      name: "Learning Path Optimizer",
      description: "AI suggests optimal study sequences and schedules",
      usage: "8 times this week",
      lastUsed: "3 days ago",
      icon: TrendingUp,
      status: "beta",
      efficiency: "+52%",
      accuracy: "89%",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const aiInsights = [
    {
      title: "Study Pattern Analysis",
      insight: "You're most productive between 9-11 AM. Consider scheduling complex topics during this time.",
      confidence: 92,
      actionable: true,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Learning Style Recommendation",
      insight: "Your retention improves 34% with visual aids. Try more mind maps and diagrams.",
      confidence: 87,
      actionable: true,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Topic Mastery Prediction",
      insight: "Based on current progress, you'll master Calculus concepts in approximately 2 weeks.",
      confidence: 78,
      actionable: false,
      color: "from-purple-500 to-violet-600"
    }
  ];

  const handleLaunchTool = (toolId: number) => {
    if (toolId === 1) {
      // Open Smart Summary Generator modal
      setShowSummaryGenerator(true);
      return;
    }
    
    if (toolId === 2) {
      // Open Adaptive Flashcard Creator modal
      setShowFlashcardCreator(true);
      return;
    }
    
    setLaunchedTool(toolId);
    setTimeout(() => {
      setLaunchedTool(null);
      alert(`AI Tool ${toolId} launched successfully!`);
    }, 2000);
  };

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {aiTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                  className={`group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/80 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 ${
                    selectedTool === tool.id ? 'ring-2 ring-pulse-500 bg-white/90' : ''
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                          <tool.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-xl mb-1">{tool.name}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={tool.status === 'active' ? 'default' : 'secondary'}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          tool.status === 'active' 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200' 
                            : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200'
                        }`}
                      >
                        {tool.status}
                      </Badge>
                      <span className="text-sm text-gray-500 font-medium">{tool.usage}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div className="space-y-1">
                        <span className="text-gray-500 font-medium">Efficiency</span>
                        <p className="font-bold text-lg text-green-600">{tool.efficiency}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-500 font-medium">Accuracy</span>
                        <p className="font-bold text-lg text-blue-600">{tool.accuracy}</p>
                      </div>
                    </div>

                    {selectedTool === tool.id && (
                      <div className="pt-4 border-t border-gray-100/60">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLaunchTool(tool.id);
                          }}
                          disabled={launchedTool === tool.id}
                          className={`w-full bg-gradient-to-r ${tool.color} hover:shadow-lg text-white shadow-md rounded-2xl py-3 font-medium`}
                          size="sm"
                        >
                          {launchedTool === tool.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Launching...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Launch Tool
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Last used {tool.lastUsed}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Insights & Recommendations</h2>
            <div className="space-y-6">
              {aiInsights.map((insight, index) => (
                <div key={index} className="group bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-3 h-3 bg-gradient-to-r ${insight.color} rounded-full`}></div>
                        <h3 className="font-semibold text-gray-900 text-lg">{insight.title}</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">{insight.insight}</p>
                      {insight.actionable && (
                        <Button variant="link" className="p-0 h-auto text-pulse-600 hover:text-pulse-700 font-medium">
                          Apply Recommendation →
                        </Button>
                      )}
                    </div>
                    <div className="ml-6 text-right">
                      <Badge 
                        variant="outline" 
                        className="bg-gradient-to-r from-pulse-50 to-orange-50 text-pulse-700 border-pulse-200 rounded-full px-3 py-1"
                      >
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Smart Summary Generator Modal */}
      <SmartSummaryGenerator 
        isOpen={showSummaryGenerator}
        onClose={() => setShowSummaryGenerator(false)}
      />

      {/* Adaptive Flashcard Creator Modal */}
      <AdaptiveFlashcardCreator 
        isOpen={showFlashcardCreator}
        onClose={() => setShowFlashcardCreator(false)}
      />
    </AppLayout>
  );
};

export default AITools;
