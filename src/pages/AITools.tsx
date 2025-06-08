
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Brain, Sparkles, Zap, Target, TrendingUp, Clock, Play, Settings, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsGrid from '@/components/shared/StatsGrid';
import SessionCard from '@/components/shared/SessionCard';

const AITools = () => {
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [launchedTool, setLaunchedTool] = useState<number | null>(null);

  const stats = [
    {
      label: 'AI Interactions',
      value: 156,
      icon: Brain,
      color: 'bg-purple-500',
      trend: '+23 today',
      trendDirection: 'up' as const
    },
    {
      label: 'Time Saved',
      value: '8.5h',
      icon: Clock,
      color: 'bg-green-500',
      trend: 'This week',
      trendDirection: 'up' as const
    },
    {
      label: 'Accuracy',
      value: '+23%',
      icon: Target,
      color: 'bg-blue-500',
      trend: 'Improvement',
      trendDirection: 'up' as const
    },
    {
      label: 'Efficiency',
      value: '+31%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      trend: 'Study boost',
      trendDirection: 'up' as const
    }
  ];

  const aiTools = [
    {
      id: 1,
      name: "Smart Summary Generator",
      description: "Generate concise summaries from any content",
      usage: "24 times this week",
      lastUsed: "2 hours ago",
      icon: Brain,
      status: "active",
      efficiency: "+45%",
      accuracy: "94%"
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
      accuracy: "91%"
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
      accuracy: "87%"
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
      accuracy: "89%"
    }
  ];

  const aiInsights = [
    {
      title: "Study Pattern Analysis",
      insight: "You're most productive between 9-11 AM. Consider scheduling complex topics during this time.",
      confidence: 92,
      actionable: true
    },
    {
      title: "Learning Style Recommendation",
      insight: "Your retention improves 34% with visual aids. Try more mind maps and diagrams.",
      confidence: 87,
      actionable: true
    },
    {
      title: "Topic Mastery Prediction",
      insight: "Based on current progress, you'll master Calculus concepts in approximately 2 weeks.",
      confidence: 78,
      actionable: false
    }
  ];

  const handleLaunchTool = (toolId: number) => {
    setLaunchedTool(toolId);
    setTimeout(() => {
      setLaunchedTool(null);
      alert(`AI Tool ${toolId} launched successfully!`);
    }, 2000);
  };

  return (
    <AppLayout activeSession="ai-tools">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Tools</h1>
            <p className="text-gray-600">Powerful AI-driven study assistants</p>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsGrid stats={stats} />

        {/* AI Tools Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Available Tools</h2>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiTools.map((tool) => (
              <SessionCard
                key={tool.id}
                title={tool.name}
                description={tool.description}
                icon={tool.icon}
                lastActivity={tool.lastUsed}
                onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                className={selectedTool === tool.id ? 'ring-2 ring-pulse-500' : ''}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={tool.status === 'active' ? 'default' : 'secondary'}>
                      {tool.status}
                    </Badge>
                    <span className="text-sm text-gray-500">{tool.usage}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Efficiency</span>
                      <p className="font-medium text-green-600">{tool.efficiency}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Accuracy</span>
                      <p className="font-medium text-blue-600">{tool.accuracy}</p>
                    </div>
                  </div>

                  {selectedTool === tool.id && (
                    <div className="pt-3 border-t border-gray-100">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchTool(tool.id);
                        }}
                        disabled={launchedTool === tool.id}
                        className="w-full bg-pulse-500 hover:bg-pulse-600"
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
                </div>
              </SessionCard>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h2>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{insight.title}</h3>
                    <p className="text-sm text-gray-700">{insight.insight}</p>
                    {insight.actionable && (
                      <Button variant="link" className="p-0 h-auto mt-2 text-pulse-600">
                        Apply Recommendation →
                      </Button>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <Badge variant="outline">{insight.confidence}% confidence</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AITools;
