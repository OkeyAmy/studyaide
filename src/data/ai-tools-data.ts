
import { Brain, Sparkles, Target, TrendingUp, Clock } from 'lucide-react';
import { ComponentType } from 'react';
import { StatItem } from '@/types/stats';

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

export const stats: StatItem[] = [
  {
    label: 'AI Interactions',
    value: 156,
    icon: Brain,
    color: 'bg-gradient-to-r from-purple-500 to-violet-600',
    trend: '+23 today',
    trendDirection: 'up'
  },
  {
    label: 'Time Saved',
    value: '8.5h',
    icon: Clock,
    color: 'bg-gradient-to-r from-green-500 to-emerald-600',
    trend: 'This week',
    trendDirection: 'up'
  },
  {
    label: 'Accuracy',
    value: '+23%',
    icon: Target,
    color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    trend: 'Improvement',
    trendDirection: 'up'
  },
  {
    label: 'Efficiency',
    value: '+31%',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-orange-500 to-red-600',
    trend: 'Study boost',
    trendDirection: 'up'
  }
];

export const aiTools: AITool[] = [
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
    status: "active",
    efficiency: "+52%",
    accuracy: "89%",
    color: "from-green-500 to-emerald-600"
  }
];

export const aiInsights: AIInsight[] = [
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
