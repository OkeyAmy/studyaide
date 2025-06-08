import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Plus, MoreHorizontal, Clock, Target, TrendingUp, Mic, Upload, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsGrid from '@/components/shared/StatsGrid';
import WorkflowCreator from '@/components/workflow/WorkflowCreator';
import WorkflowCard from '@/components/workflow/WorkflowCard';
import { MaterialDisplay } from '@/types/api';

const MyWorkflows = () => {
  const navigate = useNavigate();
  const [showWorkflowCreator, setShowWorkflowCreator] = useState(false);
  const [showCreateOptions, setShowCreateOptions] = useState(false);

  const stats = [
    {
      label: 'Total Workflows',
      value: 12,
      icon: Target,
      color: 'bg-blue-500',
      trend: '+2 this week',
      trendDirection: 'up' as const
    },
    {
      label: 'Active Sessions',
      value: 3,
      icon: Play,
      color: 'bg-green-500',
      trend: 'In progress',
      trendDirection: 'up' as const
    },
    {
      label: 'Completed',
      value: 9,
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: 'This month',
      trendDirection: 'up' as const
    },
    {
      label: 'Study Hours',
      value: '42h',
      icon: Clock,
      color: 'bg-orange-500',
      trend: '+8h this week',
      trendDirection: 'up' as const
    }
  ];

  const workflows = [
    {
      id: '1',
      title: 'Deep Learning Fundamentals',
      description: 'Complete course on neural networks and deep learning',
      materials: [
        { id: 'm1', title: 'Neural Networks Intro.pdf', type: 'pdf' },
        { id: 'm2', title: 'Backpropagation Lecture.mp4', type: 'video' },
        { id: 'm3', title: 'Deep Learning Notes.pdf', type: 'pdf' }
      ],
      timeSpent: '12h 30m',
      lastActivity: '2 hours ago',
      tags: ['AI', 'Machine Learning', 'Deep Learning'],
      hasComponents: {
        summary: true,
        quiz: true,
        mindMap: true,
        chatbot: true
      }
    },
    {
      id: '2',
      title: 'Data Structures and Algorithms',
      description: 'Comprehensive study of DSA concepts',
      materials: [
        { id: 'm4', title: 'Array Operations.pdf', type: 'pdf' },
        { id: 'm5', title: 'Sorting Algorithms.mp3', type: 'audio' },
        { id: 'm6', title: 'Tree Structures.pdf', type: 'pdf' }
      ],
      timeSpent: '24h 15m',
      lastActivity: '1 week ago',
      tags: ['Computer Science', 'Algorithms', 'Programming'],
      hasComponents: {
        summary: true,
        quiz: false,
        mindMap: true,
        chatbot: true
      }
    },
    {
      id: '3',
      title: 'Quantum Physics Basics',
      description: 'Introduction to quantum mechanics principles',
      materials: [
        { id: 'm7', title: 'Quantum Mechanics.pdf', type: 'pdf' },
        { id: 'm8', title: 'Wave Functions.mp4', type: 'video' }
      ],
      timeSpent: '8h 45m',
      lastActivity: '1 day ago',
      tags: ['Physics', 'Quantum Mechanics', 'Science'],
      hasComponents: {
        summary: true,
        quiz: true,
        mindMap: false,
        chatbot: true
      }
    },
    {
      id: '4',
      title: 'Web Development Bootcamp',
      description: 'Full-stack web development learning path',
      materials: [
        { id: 'm9', title: 'React Fundamentals.pdf', type: 'pdf' },
        { id: 'm10', title: 'Node.js Tutorial.mp4', type: 'video' },
        { id: 'm11', title: 'Database Design.mp3', type: 'audio' }
      ],
      timeSpent: '18h 20m',
      lastActivity: '3 days ago',
      tags: ['Web Development', 'JavaScript', 'React'],
      hasComponents: {
        summary: true,
        quiz: true,
        mindMap: true,
        chatbot: false
      }
    }
  ];

  const handleCreateWorkflow = (title: string, selectedMaterials: MaterialDisplay[]) => {
    console.log('Creating workflow:', title, 'with materials:', selectedMaterials);
    setShowWorkflowCreator(false);
    setShowCreateOptions(false);
  };

  const handleStartRecording = () => {
    navigate('/study-session');
  };

  const handleUploadFile = () => {
    navigate('/study-session');
  };

  const handleImportFromKnowledge = () => {
    setShowCreateOptions(false);
    setShowWorkflowCreator(true);
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    if (window.confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      console.log('Deleting workflow:', workflowId);
      // Here you would typically call your delete API
    }
  };

  const handleRenameWorkflow = (workflowId: string, newTitle: string) => {
    console.log('Renaming workflow:', workflowId, 'to:', newTitle);
    // Here you would typically call your rename API
  };

  const handleAddTag = (workflowId: string, tag: string) => {
    console.log('Adding tag:', tag, 'to workflow:', workflowId);
    // Here you would typically call your add tag API
  };

  const handleRemoveTag = (workflowId: string, tag: string) => {
    console.log('Removing tag:', tag, 'from workflow:', workflowId);
    // Here you would typically call your remove tag API
  };

  const handleContinueSession = (workflowId: string) => {
    console.log('Continuing session for workflow:', workflowId);
    // Navigate to workflow session view
    navigate(`/workflows/${workflowId}/session`);
  };

  return (
    <AppLayout activeSession="workflows">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Workflows</h1>
            <p className="text-gray-600">Manage your learning workflows and track progress</p>
          </div>
          <div className="relative">
            <Button 
              onClick={() => setShowCreateOptions(!showCreateOptions)}
              className="bg-pulse-500 hover:bg-pulse-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
            
            {/* Create Options Dropdown */}
            {showCreateOptions && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  <button
                    onClick={handleImportFromKnowledge}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Import from Knowledge Base</p>
                      <p className="text-sm text-gray-500">Use existing materials</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleStartRecording}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Mic className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Start New Recording</p>
                      <p className="text-sm text-gray-500">Record live lecture</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleUploadFile}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Upload className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Upload New Material</p>
                      <p className="text-sm text-gray-500">Add files to workflow</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <StatsGrid stats={stats} />

        {/* Workflows Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Workflows</h2>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onDelete={handleDeleteWorkflow}
                onRename={handleRenameWorkflow}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                onContinueSession={handleContinueSession}
              />
            ))}
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {showCreateOptions && (
          <div 
            className="fixed inset-0 z-0"
            onClick={() => setShowCreateOptions(false)}
          />
        )}

        {/* Workflow Creator Modal */}
        <WorkflowCreator
          isOpen={showWorkflowCreator}
          onClose={() => setShowWorkflowCreator(false)}
          onCreateWorkflow={handleCreateWorkflow}
        />
      </div>
    </AppLayout>
  );
};

export default MyWorkflows;
