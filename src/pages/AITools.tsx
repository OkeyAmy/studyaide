
import React, { useState } from 'react';
import { Brain, Sparkles, Zap, Target, TrendingUp, Clock, Play, Settings } from 'lucide-react';

const AITools = () => {
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [launchedTool, setLaunchedTool] = useState<number | null>(null);

  const aiTools = [
    {
      id: 1,
      name: "Smart Summary Generator",
      description: "Generate concise summaries from any content",
      usage: "24 times this week",
      lastUsed: "2 hours ago",
      icon: Brain,
      color: "bg-purple-500",
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
      color: "bg-blue-500",
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
      color: "bg-green-500",
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
      color: "bg-orange-500",
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

  const weeklyStats = {
    aiInteractions: 156,
    timeSaved: "8.5 hours",
    accuracyImprovement: "+23%",
    studyEfficiency: "+31%"
  };

  const handleLaunchTool = (toolId: number) => {
    setLaunchedTool(toolId);
    console.log(`Launching AI tool ${toolId}`);
    // Simulate tool launch
    setTimeout(() => {
      setLaunchedTool(null);
      alert(`AI Tool ${toolId} launched successfully!`);
    }, 2000);
  };

  const handleToolClick = (toolId: number) => {
    setSelectedTool(selectedTool === toolId ? null : toolId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Tools</h1>
          <p className="text-gray-600">Intelligent study assistance powered by AI</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-pulse-500 text-white rounded-lg hover:bg-pulse-600 transition-colors">
          <Settings className="h-4 w-4 mr-2" />
          AI Settings
        </button>
      </div>

      {/* Weekly AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Interactions</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.aiInteractions}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Time Saved</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.timeSaved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accuracy Improvement</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.accuracyImprovement}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.studyEfficiency}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiTools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;
          const isLaunching = launchedTool === tool.id;
          
          return (
            <div 
              key={tool.id} 
              className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 transition-all cursor-pointer ${
                isSelected ? 'ring-2 ring-pulse-500 shadow-md' : 'hover:shadow-md'
              }`}
              onClick={() => handleToolClick(tool.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tool.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {tool.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{tool.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Efficiency</span>
                  <p className="font-medium text-green-600">{tool.efficiency}</p>
                </div>
                <div>
                  <span className="text-gray-500">Accuracy</span>
                  <p className="font-medium text-blue-600">{tool.accuracy}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>{tool.usage}</span>
                <span>Last used: {tool.lastUsed}</span>
              </div>

              {isSelected && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchTool(tool.id);
                      }}
                      disabled={isLaunching}
                      className="w-full flex items-center justify-center px-3 py-2 bg-pulse-500 text-white rounded text-sm hover:bg-pulse-600 transition-colors disabled:opacity-50"
                    >
                      {isLaunching ? (
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
                    </button>
                    <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                      View Usage History
                    </button>
                  </div>
                </div>
              )}
              
              {!isSelected && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchTool(tool.id);
                  }}
                  disabled={isLaunching}
                  className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLaunching ? 'Launching...' : 'Launch Tool'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</h2>
          <p className="text-sm text-gray-600 mt-1">Personalized insights based on your learning patterns</p>
        </div>

        <div className="divide-y divide-gray-200">
          {aiInsights.map((insight, index) => (
            <div key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">{insight.title}</h3>
                  <p className="text-gray-700">{insight.insight}</p>
                  {insight.actionable && (
                    <button className="mt-2 text-sm text-pulse-600 hover:text-pulse-700 font-medium">
                      Apply Recommendation →
                    </button>
                  )}
                </div>
                <div className="ml-4 text-right">
                  <span className="text-sm text-gray-500">Confidence</span>
                  <div className="text-lg font-semibold text-pulse-600">{insight.confidence}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AITools;
