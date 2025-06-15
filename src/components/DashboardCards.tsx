import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Mic, Brain, Clock, Target, Play } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useWorkflowData } from '@/hooks/useDatabase';

const DashboardCards = () => {
  const navigate = useNavigate();
  const { data: workflowData, isLoading } = useWorkflowData();

  const handleStartSession = () => {
    navigate('/study-session');
  };

  const quickStats = workflowData ? [
    {
      title: "Total Workflows",
      value: workflowData.totalWorkflows,
      icon: Target,
      color: "bg-orange-500",
      trend: `+${workflowData.workflowsCreatedThisWeek} this week`
    },
    {
      title: "Active Sessions",
      value: workflowData.activeSessions,
      icon: Play,
      color: "bg-green-500",
      trend: "In progress"
    },
    {
      title: "Study Hours",
      value: `${workflowData.studyHours}h`,
      icon: Clock,
      color: "bg-pink-500",
      trend: "Total hours accumulated"
    }
  ] : [];

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-32 bg-gray-200 rounded-xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>)}
      </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-pulse-200 bg-gradient-to-r from-pulse-50 to-pulse-100">
        <CardHeader>
          <CardTitle className="text-pulse-900">Start Learning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-pulse-700">
            Ready to transform your learning materials into interactive study sessions?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleStartSession}
              className="flex-1 bg-pulse-500 hover:bg-pulse-600 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
            <Button 
              onClick={handleStartSession}
              variant="outline" 
              className="flex-1 border-pulse-500 text-pulse-600 hover:bg-pulse-50"
            >
              <Mic className="mr-2 h-4 w-4" />
              Record Live
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    {stat.trend && (
                      <p className="text-sm text-gray-500 mt-1">{stat.trend}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-pulse-500" />
            <CardTitle>AI Suggestions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Study Schedule Optimization</h4>
              <p className="text-sm text-blue-700">Your productivity peaks at 9-11 AM. Consider scheduling complex topics during this time.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Learning Style Insight</h4>
              <p className="text-sm text-green-700">Visual learners: Your retention improves 34% with mind maps. Try our Mind Map generator!</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-1">Content Recommendation</h4>
              <p className="text-sm text-purple-700">Based on your recent activity, consider reviewing "Neural Networks" concepts.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
