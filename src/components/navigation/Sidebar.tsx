import React from 'react';
import { Home, BookOpen, Brain, Zap, Settings, LogOut, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSession?: string;
  onSessionChange?: (session: string) => void;
}

const Sidebar = ({ activeSession = 'dashboard', onSessionChange }: SidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      key: 'dashboard',
      path: '/dashboard',
      badge: null,
      description: 'Overview & quick actions'
    },
    { 
      icon: BookOpen, 
      label: 'My Workflows', 
      key: 'workflows',
      path: '/workflows',
      badge: '5 Active',
      description: 'Study sessions & progress'
    },
    { 
      icon: Brain, 
      label: 'Knowledge Base', 
      key: 'knowledge',
      path: '/knowledge',
      badge: '127',
      description: 'Saved materials & notes'
    },
    { 
      icon: Zap, 
      label: 'AI Tools', 
      key: 'ai-tools',
      path: '/ai-tools',
      badge: 'New',
      description: 'AI-powered study assistants'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      key: 'settings',
      path: '/settings',
      badge: null,
      description: 'Preferences & account'
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    navigate(item.path);
    if (onSessionChange) {
      onSessionChange(item.key);
    }
  };

  // Determine active session from current path if not provided
  const currentActiveSession = activeSession || navItems.find(item => 
    location.pathname === item.path
  )?.key || 'dashboard';

  return (
    <div className="bg-white border-r border-gray-200 h-full w-72 flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-pulse-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div className="ml-3">
            <span className="text-xl font-bold text-gray-900">StudyAIde</span>
            <p className="text-xs text-gray-500">AI Study Assistant</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-gradient-to-r from-pulse-50 to-blue-50 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="h-4 w-4 text-pulse-600" />
              <span className="text-lg font-semibold text-gray-900">24.5h</span>
            </div>
            <p className="text-xs text-gray-600">This Week</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">8.5h</span>
            </div>
            <p className="text-xs text-gray-600">Saved</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentActiveSession === item.key;
          
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item)}
              className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-pulse-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={isActive ? "secondary" : "outline"}
                      className={cn(
                        "text-xs ml-2",
                        isActive ? "bg-white/20 text-white border-white/30" : ""
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
