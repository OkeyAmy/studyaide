import React from 'react';
import { Home, BookOpen, Brain, Zap, Settings, LogOut, Sparkles } from 'lucide-react';
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
    { icon: Home, label: 'Dashboard', key: 'dashboard', gradient: 'from-pulse-500 to-orange-600' },
    { icon: BookOpen, label: 'My Workflows', key: 'workflows', gradient: 'from-purple-500 to-pink-600' },
    { icon: Brain, label: 'Knowledge Base', key: 'knowledge', gradient: 'from-blue-500 to-cyan-600' },
    { icon: Zap, label: 'AI Tools', key: 'ai-tools', gradient: 'from-emerald-500 to-teal-600' },
    { icon: Settings, label: 'Settings', key: 'settings', gradient: 'from-gray-500 to-slate-600' },
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
    <div className="relative h-full w-64 flex flex-col overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50"></div>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pulse-500/20 to-orange-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-rose-600/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pulse-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                StudyAide
              </h1>
              <p className="text-xs text-gray-600">AI Study Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSession === item.key;
            
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`group w-full flex items-center p-4 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                  isActive
                    ? 'bg-white/70 text-gray-900 shadow-xl border border-white/30 backdrop-blur-sm'
                    : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:shadow-lg'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                    : 'bg-white/60 group-hover:bg-white/80'
                }`}>
                  <Icon className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                  }`} />
                </div>
                <span className="transition-colors duration-300">
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-pulse-500 to-orange-600 rounded-full shadow-sm"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleSignOut}
            className="group w-full flex items-center p-4 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50/50 rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-white/60 group-hover:bg-red-100/80 transition-all duration-300">
              <LogOut className="h-5 w-5 transition-colors" />
            </div>
            <span className="transition-colors duration-300">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
