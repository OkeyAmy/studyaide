
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import WelcomeBanner from '@/components/WelcomeBanner';
import DashboardCards from '@/components/DashboardCards';
import { useActivityLogs } from '@/hooks/useDatabase';

const Dashboard = () => {
  const { data: activities } = useActivityLogs();

  return (
    <AppLayout activeSession="dashboard">
      <div className="space-y-6">
        <WelcomeBanner />
        <DashboardCards />
        
        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities?.slice(0, 3).map((activity, index) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-pulse-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-pulse-600 text-sm font-medium">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {activity.action_type} {activity.entity_type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) || [1, 2, 3].map((item) => (
              <div key={item} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
      </div>
    </AppLayout>
  );
};

export default Dashboard;
