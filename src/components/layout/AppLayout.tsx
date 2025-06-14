import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/navigation/Sidebar';
import MobileSidebar from '@/components/navigation/MobileSidebar';
import TopHeader from '@/components/navigation/TopHeader';
import QuickActions from '@/components/navigation/QuickActions';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  activeSession?: string;
  onSessionChange?: (session: string) => void;
}

const AppLayout = ({ children, activeSession = 'dashboard', onSessionChange }: AppLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const handleSidebarCollapseChange = (isCollapsed: boolean) => {
    setIsSidebarCollapsed(isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Fixed position */}
      <div className="hidden lg:block">
        <Sidebar 
          activeSession={activeSession} 
          onSessionChange={onSessionChange}
          onCollapseChange={handleSidebarCollapseChange}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)}
        activeSession={activeSession}
        onSessionChange={onSessionChange}
      />

      {/* Main Content Area - with dynamic left margin based on sidebar state */}
      <div className={cn(
        "flex flex-col min-w-0 min-h-screen transition-all duration-300",
        isSidebarCollapsed ? "lg:ml-16" : "lg:ml-72"
      )}>
        {/* Top Header */}
        <TopHeader 
          onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
          activeSession={activeSession}
          user={user}
        />

        {/* Main Content with Quick Actions */}
        <div className="flex-1 relative">
          <main className="h-full p-4 lg:p-6">
            {children}
          </main>
          
          {/* Floating Quick Actions */}
          <QuickActions activeSession={activeSession} />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
