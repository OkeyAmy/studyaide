
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import WelcomeBanner from '@/components/WelcomeBanner';
import DashboardCards from '@/components/DashboardCards';
import MyWorkflows from '@/pages/MyWorkflows';
import KnowledgeBase from '@/pages/KnowledgeBase';
import AITools from '@/pages/AITools';
import Settings from '@/pages/Settings';

const Dashboard = () => {
  const [activeSession, setActiveSession] = useState('dashboard');

  const renderSessionContent = () => {
    switch (activeSession) {
      case 'workflows':
        return <MyWorkflows />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'ai-tools':
        return <AITools />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="space-y-6">
            <WelcomeBanner />
            <DashboardCards />
            
            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-pulse-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-pulse-600 text-sm font-medium">{item}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Sample Activity {item}</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AppLayout activeSession={activeSession} onSessionChange={setActiveSession}>
      {renderSessionContent()}
    </AppLayout>
  );
};

export default Dashboard;
