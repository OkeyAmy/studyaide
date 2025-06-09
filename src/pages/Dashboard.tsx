
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import WelcomeBanner from '@/components/WelcomeBanner';
import DashboardCards from '@/components/DashboardCards';
import { useActivityLogs } from '@/hooks/useDatabase';
import { Clock, TrendingUp, Play } from 'lucide-react';

const Dashboard = () => {
  const { data: activities } = useActivityLogs();

  return (
    <AppLayout activeSession="dashboard">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-6">
        <div className="space-y-8">
          <WelcomeBanner />
          <DashboardCards />
          
          {/* Recent Activity Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {activities?.slice(0, 3).map((activity, index) => (
                <div key={activity.id} className="group flex items-center p-4 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
                    index === 0 ? 'bg-gradient-to-r from-pulse-500 to-orange-600' :
                    index === 1 ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
                    'bg-gradient-to-r from-blue-500 to-cyan-600'
                  }`}>
                    {index === 0 ? <Play className="h-6 w-6 text-white" /> :
                     index === 1 ? <TrendingUp className="h-6 w-6 text-white" /> :
                     <Clock className="h-6 w-6 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900 capitalize">
                      {activity.action_type} {activity.entity_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-gradient-to-r from-pulse-500 to-orange-600 rounded-full"></div>
                  </div>
                </div>
              )) || [1, 2, 3].map((item) => (
                <div key={item} className="group flex items-center p-4 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
                    item === 1 ? 'bg-gradient-to-r from-pulse-500 to-orange-600' :
                    item === 2 ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
                    'bg-gradient-to-r from-blue-500 to-cyan-600'
                  }`}>
                    {item === 1 ? <Play className="h-6 w-6 text-white" /> :
                     item === 2 ? <TrendingUp className="h-6 w-6 text-white" /> :
                     <Clock className="h-6 w-6 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">Sample Activity {item}</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-gradient-to-r from-pulse-500 to-orange-600 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
