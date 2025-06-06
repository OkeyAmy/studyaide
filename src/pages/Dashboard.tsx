
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/MobileSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import WelcomeBanner from '@/components/WelcomeBanner';
import DashboardCards from '@/components/DashboardCards';
import MyWorkflows from '@/pages/MyWorkflows';
import KnowledgeBase from '@/pages/KnowledgeBase';
import AITools from '@/pages/AITools';
import Settings from '@/pages/Settings';

const Dashboard = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
          <>
            <WelcomeBanner />
            <DashboardCards />
            
            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center p-3 bg-gray-50 rounded-lg">
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
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeSession={activeSession} onSessionChange={setActiveSession} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)}
        activeSession={activeSession}
        onSessionChange={setActiveSession}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <img src="/logo.svg" alt="StudyAIde" className="h-6 w-auto" />
            <span className="ml-2 text-lg font-semibold text-gray-900">StudyAIde</span>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <DashboardHeader />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {renderSessionContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
