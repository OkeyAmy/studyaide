import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import WelcomeBanner from '@/components/WelcomeBanner';
import DashboardCards from '@/components/DashboardCards';
import { useActivityLogs } from '@/hooks/useDatabase';
import { Clock, TrendingUp, Play, ArrowRight, Sparkles, Zap, BookOpen, Brain } from 'lucide-react';

const Dashboard = () => {
  const { data: activities } = useActivityLogs();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Start Study Session",
      description: "Begin a new AI-powered study session",
      icon: Play,
      gradient: "from-pulse-500 to-orange-600",
      action: "study-session",
      path: "/study-session"
    },
    {
      title: "Create Workflow",
      description: "Build a custom learning workflow",
      icon: Zap,
      gradient: "from-purple-500 to-pink-600",
      action: "workflows",
      path: "/workflows"
    },
    {
      title: "Browse Knowledge",
      description: "Explore your knowledge base",
      icon: Brain,
      gradient: "from-blue-500 to-cyan-600",
      action: "knowledge",
      path: "/knowledge"
    }
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    navigate(action.path);
  };

  return (
    <AppLayout activeSession="dashboard">
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pulse-500/10 to-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-600/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 p-6 space-y-8">
          {/* Welcome Section */}
          <div className="animate-fade-in">
            <WelcomeBanner />
          </div>

          {/* Quick Actions */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Quick Actions
              </h2>
              <p className="text-gray-600">Jump into your learning journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.action}
                    onClick={() => handleQuickAction(action)}
                    className="group relative p-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative z-10">
                      <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {action.description}
                      </p>
                      <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors">
                        <span className="text-sm font-medium">Get Started</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <DashboardCards />
          </div>
          
          {/* Recent Activity Section */}
          <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pulse-500/10 to-orange-600/5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Recent Activity
                    </h2>
                    <p className="text-gray-600 mt-1">Your latest learning progress</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-pulse-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {activities?.slice(0, 3).map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className="group relative flex items-center p-6 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-6 shadow-lg ${
                        index === 0 ? 'bg-gradient-to-br from-pulse-500 to-orange-600' :
                        index === 1 ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                        'bg-gradient-to-br from-blue-500 to-cyan-600'
                      }`}>
                        {index === 0 ? <Play className="h-7 w-7 text-white" /> :
                         index === 1 ? <TrendingUp className="h-7 w-7 text-white" /> :
                         <Clock className="h-7 w-7 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize mb-1">
                          {activity.action_type} {activity.entity_type}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {new Date(activity.created_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className={`w-3 h-3 rounded-full shadow-sm ${
                          index === 0 ? 'bg-gradient-to-br from-pulse-500 to-orange-600' :
                          index === 1 ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                          'bg-gradient-to-br from-blue-500 to-cyan-600'
                        }`}></div>
                      </div>
                      
                      {/* Subtle hover glow */}
                      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                        index === 0 ? 'bg-gradient-to-br from-pulse-500 to-orange-600' :
                        index === 1 ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                        'bg-gradient-to-br from-blue-500 to-cyan-600'
                      }`}></div>
                    </div>
                  )) || [1, 2, 3].map((item) => (
                    <div 
                      key={item} 
                      className="group relative flex items-center p-6 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5"
                      style={{ animationDelay: `${item * 0.1}s` }}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-6 shadow-lg ${
                        item === 1 ? 'bg-gradient-to-br from-pulse-500 to-orange-600' :
                        item === 2 ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                        'bg-gradient-to-br from-blue-500 to-cyan-600'
                      }`}>
                        {item === 1 ? <Play className="h-7 w-7 text-white" /> :
                         item === 2 ? <TrendingUp className="h-7 w-7 text-white" /> :
                         <Clock className="h-7 w-7 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">Sample Activity {item}</h3>
                        <p className="text-gray-600 text-sm">Today at 2:30 PM</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className={`w-3 h-3 rounded-full shadow-sm ${
                          item === 1 ? 'bg-gradient-to-br from-pulse-500 to-orange-600' :
                          item === 2 ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                          'bg-gradient-to-br from-blue-500 to-cyan-600'
                        }`}></div>
                      </div>
                      
                      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                        item === 1 ? 'bg-gradient-to-br from-pulse-500 to-orange-600' :
                        item === 2 ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                        'bg-gradient-to-br from-blue-500 to-cyan-600'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
