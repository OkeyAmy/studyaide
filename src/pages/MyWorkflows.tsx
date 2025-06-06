
import React, { useState } from 'react';
import { Play, Clock, BookOpen, Plus, TrendingUp, Pause, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyWorkflows = () => {
  const navigate = useNavigate();
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);

  const recentWorkflows = [
    {
      id: 1,
      title: "Psychology 101 - Learning Theories",
      lastModified: "2 hours ago",
      progress: 75,
      studyMaterials: 12,
      status: "active",
      description: "Exploring behaviorism, cognitivism, and constructivism theories",
      timeSpent: "4.5 hours",
      nextSession: "Cognitive Load Theory"
    },
    {
      id: 2,
      title: "Advanced Mathematics - Calculus",
      lastModified: "1 day ago",
      progress: 45,
      studyMaterials: 8,
      status: "paused",
      description: "Differential and integral calculus fundamentals",
      timeSpent: "3.2 hours",
      nextSession: "Integration by Parts"
    },
    {
      id: 3,
      title: "History - World War II",
      lastModified: "3 days ago",
      progress: 90,
      studyMaterials: 15,
      status: "completed",
      description: "European theater and Pacific campaigns analysis",
      timeSpent: "7.8 hours",
      nextSession: "Final Review"
    }
  ];

  const workflowStats = {
    totalWorkflows: 12,
    activeWorkflows: 5,
    completedThisWeek: 3,
    studyHoursThisWeek: 24.5
  };

  const handleContinueWorkflow = (workflowId: number) => {
    console.log(`Continuing workflow ${workflowId}`);
    // Simulate navigation to study session
    navigate('/study-session', { state: { workflowId } });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'paused':
        return <Pause className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Workflows</h1>
          <p className="text-gray-600">Manage and continue your learning journeys</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-pulse-500 text-white rounded-lg hover:bg-pulse-600 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.totalWorkflows}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.activeWorkflows}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed This Week</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.completedThisWeek}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Hours</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.studyHoursThisWeek}h</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workflows */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Workflows</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {recentWorkflows.map((workflow) => (
            <div 
              key={workflow.id} 
              className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                selectedWorkflow === workflow.id ? 'bg-pulse-50 border-l-4 border-pulse-500' : ''
              }`}
              onClick={() => setSelectedWorkflow(selectedWorkflow === workflow.id ? null : workflow.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{workflow.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${
                      workflow.status === 'active' ? 'bg-green-100 text-green-700' :
                      workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {getStatusIcon(workflow.status)}
                      <span>{workflow.status}</span>
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-1">{workflow.description}</p>
                  
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span>Last modified: {workflow.lastModified}</span>
                    <span>{workflow.studyMaterials} study materials</span>
                    <span>Time spent: {workflow.timeSpent}</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900 font-medium">{workflow.progress}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pulse-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>

                  {selectedWorkflow === workflow.id && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Next Session</h4>
                      <p className="text-sm text-gray-600 mb-3">{workflow.nextSession}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContinueWorkflow(workflow.id);
                          }}
                          className="px-3 py-1 bg-pulse-500 text-white rounded text-sm hover:bg-pulse-600 transition-colors"
                        >
                          Continue Session
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContinueWorkflow(workflow.id);
                  }}
                  className="ml-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyWorkflows;
