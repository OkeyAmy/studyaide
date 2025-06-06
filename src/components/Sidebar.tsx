
import React from 'react';
import { Home, BookOpen, Brain, Zap, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeSession?: string;
  onSessionChange?: (session: string) => void;
}

const Sidebar = ({ activeSession = 'dashboard', onSessionChange }: SidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', key: 'dashboard' },
    { icon: BookOpen, label: 'My Workflows', key: 'workflows' },
    { icon: Brain, label: 'Knowledge Base', key: 'knowledge' },
    { icon: Zap, label: 'AI Tools', key: 'ai-tools' },
    { icon: Settings, label: 'Settings', key: 'settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavClick = (key: string) => {
    if (onSessionChange) {
      onSessionChange(key);
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full w-64 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <img src="/logo.svg" alt="StudyAIde" className="h-8 w-auto" />
          <span className="ml-2 text-xl font-semibold text-gray-900">StudyAIde</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSession === item.key;
          
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-pulse-50 text-pulse-600 border-pulse-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
