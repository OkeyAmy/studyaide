
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const WelcomeBanner = () => {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || 'there';

  return (
    <div className="bg-gradient-to-r from-pulse-500 to-pulse-600 rounded-xl p-6 text-white mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome back, {name}!</h1>
          <p className="text-pulse-100">
            Ready to transform your learning with AI-powered study tools?
          </p>
        </div>
        <div className="hidden md:block">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">🎓</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
