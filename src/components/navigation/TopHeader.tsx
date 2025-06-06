
import React from 'react';
import { Menu, Bell, Search, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface TopHeaderProps {
  onMobileMenuToggle: () => void;
  activeSession: string;
  user: any;
}

const TopHeader = ({ onMobileMenuToggle, activeSession, user }: TopHeaderProps) => {
  const navigate = useNavigate();

  const getSessionTitle = (session: string) => {
    const titles = {
      dashboard: 'Dashboard',
      workflows: 'My Workflows',
      knowledge: 'Knowledge Base',
      'ai-tools': 'AI Tools',
      settings: 'Settings'
    };
    return titles[session] || 'Dashboard';
  };

  const handleQuickStart = () => {
    navigate('/study-session');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Page Title & Breadcrumb */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {getSessionTitle(activeSession)}
            </h1>
            <p className="text-sm text-gray-500">
              Welcome back, {user?.user_metadata?.full_name || 'there'}
            </p>
          </div>
        </div>

        {/* Center Section - Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search across your knowledge base..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Quick Start Button */}
          <Button
            onClick={handleQuickStart}
            className="bg-pulse-500 hover:bg-pulse-600 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Quick Start</span>
          </Button>

          {/* AI Insights */}
          <Button variant="ghost" size="icon" className="relative">
            <Zap className="h-5 w-5 text-pulse-500" />
            <span className="absolute -top-1 -right-1 bg-pulse-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Button>

          {/* User Avatar */}
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-pulse-100 text-pulse-600">
              {user?.user_metadata?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
