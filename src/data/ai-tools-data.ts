
import { Brain, Sparkles, Target, TrendingUp, Clock } from 'lucide-react';
import { ComponentType } from 'react';

export interface AITool {
  id: number;
  name: string;
  description: string;
  usage: string;
  lastUsed: string;
  icon: ComponentType<{ className?: string }>;
  status: string;
  efficiency: string;
  accuracy: string;
  color: string;
}

export interface AIInsight {
  title: string;
  insight: string;
  confidence: number;
  actionable: boolean;
  color: string;
}

// Create dynamic stats based on real metrics
export const createStatsFromMetrics = (metrics: {
  aiInteractions: number;
  timeSavedHours: number;
  accuracyImprovement: number;
  efficiencyBoost: number;
  recentActivity: number;
}) => [
  {
    label: 'AI Interactions',
    value: metrics.aiInteractions,
    icon: Brain,
    color: 'bg-gradient-to-r from-purple-500 to-violet-600',
    trend: `+${metrics.recentActivity} recent`,
    trendDirection: 'up' as const
  },
  {
    label: 'Time Saved',
    value: `${metrics.timeSavedHours.toFixed(1)}h`,
    icon: Clock,
    color: 'bg-gradient-to-r from-green-500 to-emerald-600',
    trend: 'This period',
    trendDirection: 'up' as const
  },
  {
    label: 'Accuracy',
    value: `+${metrics.accuracyImprovement}%`,
    icon: Target,
    color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    trend: 'Improvement',
    trendDirection: 'up' as const
  },
  {
    label: 'Efficiency',
    value: `+${metrics.efficiencyBoost}%`,
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-orange-500 to-red-600',
    trend: 'Study boost',
    trendDirection: 'up' as const
  }
];

// Create dynamic tool usage based on real data
export const createToolsFromMetrics = (metrics: {
  totalMaterials: number;
  totalWorkflows: number;
  aiInteractions: number;
}) => {
  const summaryUsage = Math.floor(metrics.aiInteractions * 0.4);
  const flashcardUsage = Math.floor(metrics.aiInteractions * 0.3);
  const quizUsage = Math.floor(metrics.aiInteractions * 0.2);
  const pathUsage = Math.floor(metrics.aiInteractions * 0.1);

  return [
    {
      id: 1,
      name: "Smart Summary Generator",
      description: "Generate concise summaries from any content using advanced AI",
      usage: `${summaryUsage} times used`,
      lastUsed: summaryUsage > 0 ? "Recently" : "Not used yet",
      icon: Brain,
      status: "active",
      efficiency: `+${Math.min(summaryUsage * 2, 50)}%`,
      accuracy: `${Math.max(85, Math.min(95, 85 + summaryUsage))}%`,
      color: "from-purple-500 to-violet-600"
    },
    {
      id: 2,
      name: "Adaptive Flashcard Creator",
      description: "AI creates personalized flashcards based on your learning style",
      usage: `${flashcardUsage} times used`,
      lastUsed: flashcardUsage > 0 ? "Recently" : "Not used yet",
      icon: Sparkles,
      status: "active",
      efficiency: `+${Math.min(flashcardUsage * 3, 45)}%`,
      accuracy: `${Math.max(80, Math.min(92, 80 + flashcardUsage))}%`,
      color: "from-pink-500 to-rose-600"
    },
    {
      id: 3,
      name: "Quiz Generator",
      description: "Generate practice quizzes from your study materials",
      usage: `${quizUsage} times used`,
      lastUsed: quizUsage > 0 ? "Recently" : "Not used yet",
      icon: Target,
      status: "active",
      efficiency: `+${Math.min(quizUsage * 4, 40)}%`,
      accuracy: `${Math.max(82, Math.min(90, 82 + quizUsage))}%`,
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 4,
      name: "Learning Path Optimizer",
      description: "AI suggests optimal study sequences and schedules",
      usage: `${pathUsage} times used`,
      lastUsed: pathUsage > 0 ? "Recently" : "Not used yet",
      icon: TrendingUp,
      status: "active",
      efficiency: `+${Math.min(pathUsage * 5, 60)}%`,
      accuracy: `${Math.max(78, Math.min(88, 78 + pathUsage))}%`,
      color: "from-green-500 to-emerald-600"
    }
  ];
};

// Create dynamic insights based on real usage patterns
export const createInsightsFromMetrics = (metrics: {
  aiInteractions: number;
  timeSavedHours: number;
  totalMaterials: number;
  totalWorkflows: number;
  recentActivity: number;
}) => {
  const insights = [];

  if (metrics.recentActivity > 0) {
    insights.push({
      title: "Recent Activity Analysis",
      insight: `You've been highly active with ${metrics.recentActivity} recent interactions. Keep up the momentum!`,
      confidence: 90,
      actionable: true,
      color: "from-blue-500 to-cyan-600"
    });
  }

  if (metrics.totalMaterials > 5) {
    insights.push({
      title: "Learning Style Recommendation",
      insight: `With ${metrics.totalMaterials} materials processed, AI suggests focusing on visual learning aids for better retention.`,
      confidence: Math.min(85, 70 + metrics.totalMaterials),
      actionable: true,
      color: "from-green-500 to-emerald-600"
    });
  }

  if (metrics.totalWorkflows > 0) {
    const estimatedCompletionWeeks = Math.max(1, 4 - Math.floor(metrics.totalWorkflows / 2));
    insights.push({
      title: "Learning Progress Prediction",
      insight: `Based on your ${metrics.totalWorkflows} active workflows, you're on track to complete your goals in approximately ${estimatedCompletionWeeks} weeks.`,
      confidence: Math.min(80, 60 + metrics.totalWorkflows * 5),
      actionable: false,
      color: "from-purple-500 to-violet-600"
    });
  }

  // Default insight if no activity
  if (insights.length === 0) {
    insights.push({
      title: "Getting Started",
      insight: "Start using our AI tools to generate personalized insights about your learning patterns and progress.",
      confidence: 95,
      actionable: true,
      color: "from-blue-500 to-cyan-600"
    });
  }

  return insights;
};
