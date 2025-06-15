
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Mic, Brain, Activity, Clock, Target } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDatabase';

const DashboardCards = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading } = useDashboardData();

  const handleStartSession = () => {
    navigate('/study-session');
  };

  const workflowStats = [
    {
      title: "Total Workflows",
      value: dashboardData?.totalWorkflows ?? '...',
      trend: dashboardData ? `+${dashboardData.newWorkflowsThisWeek} this week` : ' ',
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Active Sessions",
      value: dashboardData?.activeSessions ?? '...',
      trend: "In progress",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Study Hours",
      value: dashboardData ? `${dashboardData.studyHours}h` : '...',
      trend: "Total time spent",
      icon: Clock,
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    }
  ];

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-32 bg-gray-200 rounded-xl"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>)}
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

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflowStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 pt-1">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
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
