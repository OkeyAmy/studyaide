
import React from 'react';
import { X, Home, BookOpen, Brain, Zap, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSession?: string;
  onSessionChange?: (session: string) => void;
}

const MobileSidebar = ({ isOpen, onClose, activeSession = 'dashboard', onSessionChange }: MobileSidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', key: 'dashboard', path: '/dashboard', badge: null },
    { icon: BookOpen, label: 'My Workflows', key: 'workflows', path: '/workflows', badge: '5' },
    { icon: Brain, label: 'Knowledge Base', key: 'knowledge', path: '/knowledge', badge: '127' },
    { icon: Zap, label: 'AI Tools', key: 'ai-tools', path: '/ai-tools', badge: 'New' },
    { icon: Settings, label: 'Settings', key: 'settings', path: '/settings', badge: null },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (item: typeof navItems[0]) => {
    navigate(item.path);
    if (onSessionChange) {
      onSessionChange(item.key);
    }
    onClose();
  };

  // Determine active session from current path if not provided
  const currentActiveSession = activeSession || navItems.find(item => 
    location.pathname === item.path
  )?.key || 'dashboard';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-pulse-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">StudyAIde</span>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentActiveSession === item.key;
            
            return (
              <button
                key={item.key}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-pulse-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </div>
                {item.badge && (
                  <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
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
    </div>
  );
};

export default MobileSidebar;
