
import React from 'react';
import { Play, Brain, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardCards = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Start a Study Session',
      description: 'Begin a focused learning session with AI-powered guidance',
      icon: Play,
      color: 'bg-pulse-500',
      action: () => navigate('/study-session')
    },
    {
      title: 'Access AI Workspace',
      description: 'Create summaries, flashcards, and quizzes instantly',
      icon: Brain,
      color: 'bg-blue-500',
      action: () => console.log('AI Workspace')
    },
    {
      title: 'View Recent Activity',
      description: 'Check your learning progress and recent documents',
      icon: Clock,
      color: 'bg-green-500',
      action: () => console.log('Recent Activity')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{card.description}</p>
            
            <button 
              onClick={card.action}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
            >
              {card.title === 'Start a Study Session' ? 'Start Session' : card.title.replace('Access ', '').replace('View ', 'View')}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
