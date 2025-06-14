import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  Brain, 
  Zap, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useWorkflowData, useMaterialsData } from '@/hooks/useDatabase';

interface SidebarProps {
  activeSession?: string;
  onSessionChange?: (session: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const Sidebar = ({ activeSession = 'dashboard', onSessionChange, onCollapseChange }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Get dynamic counts
  const { data: workflowData } = useWorkflowData();
  const { data: materialsData } = useMaterialsData();

  // Notify parent about collapse state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  const navItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      key: 'dashboard',
      path: '/dashboard',
      badge: null,
    },
    { 
      icon: BookOpen, 
      label: 'My Workflows', 
      key: 'workflows',
      path: '/workflows',
      badge: workflowData?.totalWorkflows || 0,
    },
    { 
      icon: Brain, 
      label: 'Knowledge Base', 
      key: 'knowledge',
      path: '/knowledge',
      badge: materialsData?.totalItems || 0,
    },
    { 
      icon: Zap, 
      label: 'AI Tools', 
      key: 'ai-tools',
      path: '/ai-tools',
      badge: null,
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      key: 'settings',
      path: '/settings',
      badge: null,
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

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Determine active session from current path if not provided
  const currentActiveSession = activeSession || navItems.find(item => 
    location.pathname === item.path
  )?.key || 'dashboard';

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'user@example.com';
  };

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm transition-all duration-300 fixed left-0 top-0 z-40",
      isCollapsed ? "w-16" : "w-72"
    )}>
      {/* Header Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <img 
                src="/header.png" 
                alt="StudyAide Logo" 
                className="h-auto w-auto max-w-[200px]"
              />
            </div>
          )}
          
          <Button
            onClick={handleCollapseToggle}
            variant="ghost"
            size="sm"
            className="ml-auto p-1 h-8 w-8 hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentActiveSession === item.key;
          
          return (
            <div key={item.key} className="relative group">
              <button
                onClick={() => handleNavClick(item)}
                className={cn(
                  "w-full flex items-center text-sm font-medium rounded-lg transition-all duration-200 relative",
                  isCollapsed ? "p-3 justify-center" : "px-3 py-2.5 justify-start",
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== null && (
                      <Badge 
                        variant={isActive ? "secondary" : "outline"}
                        className={cn(
                          "text-xs ml-2 min-w-[20px] h-5",
                          isActive ? "bg-white/20 text-white border-white/30" : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                  {item.badge !== null && (
                    <span className="ml-1 bg-white/20 px-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-100">
        {/* User Info Section */}
        <div className="p-3">
          <div className={cn(
            "flex items-center rounded-lg transition-all duration-200",
            isCollapsed ? "justify-center" : "space-x-3"
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {getUserEmail()}
                </p>
              </div>
            )}
          </div>
          
          {/* Tooltip for collapsed user info */}
          {isCollapsed && (
            <div className="relative group">
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap bottom-0">
                <div className="font-medium">{getUserDisplayName()}</div>
                <div className="text-gray-300">{getUserEmail()}</div>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out */}
        <div className="p-3">
          <button
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center text-sm font-medium rounded-lg transition-all duration-200 text-gray-700 hover:bg-red-50 hover:text-red-600",
              isCollapsed ? "p-3 justify-center" : "px-3 py-2.5 justify-start"
            )}
          >
            <LogOut className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
          
          {/* Tooltip for collapsed sign out */}
          {isCollapsed && (
            <div className="relative group">
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap bottom-0">
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
