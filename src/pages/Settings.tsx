
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ArrowLeft, User, Bell, Shield, Palette, Brain, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'from-blue-500 to-cyan-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-green-500 to-emerald-600' },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield, color: 'from-red-500 to-rose-600' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'from-purple-500 to-violet-600' },
    { id: 'ai', label: 'AI Preferences', icon: Brain, color: 'from-pulse-500 to-orange-600' },
    { id: 'data', label: 'Data & Storage', icon: Download, color: 'from-gray-500 to-slate-600' }
  ];

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    studyReminders: true,
    aiSuggestions: true,
    dataSharing: false,
    theme: 'light',
    language: 'english',
    studyGoalReminders: true
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderToggleSwitch = (checked: boolean, onChange: (value: boolean) => void) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pulse-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pulse-500 peer-checked:to-orange-600"></div>
    </label>
  );

  const renderProfileSettings = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
        <input
          type="text"
          defaultValue={user?.user_metadata?.full_name || ''}
          className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pulse-500 focus:border-transparent bg-white/60 backdrop-blur-sm transition-all"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
        <input
          type="email"
          defaultValue={user?.email || ''}
          className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pulse-500 focus:border-transparent bg-gray-100/60 backdrop-blur-sm"
          disabled
        />
        <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Learning Goals</label>
        <textarea
          placeholder="What are your current learning objectives?"
          className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pulse-500 focus:border-transparent bg-white/60 backdrop-blur-sm transition-all"
          rows={4}
        />
      </div>

      <button className="bg-gradient-to-r from-pulse-500 to-orange-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 font-medium">
        Save Changes
      </button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Email Notifications</h3>
          <p className="text-sm text-gray-600 mt-1">Receive updates about your study progress</p>
        </div>
        {renderToggleSwitch(settings.emailNotifications, (value) => handleSettingChange('emailNotifications', value))}
      </div>

      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Study Reminders</h3>
          <p className="text-sm text-gray-600 mt-1">Get reminded about scheduled study sessions</p>
        </div>
        {renderToggleSwitch(settings.studyReminders, (value) => handleSettingChange('studyReminders', value))}
      </div>

      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">AI Suggestions</h3>
          <p className="text-sm text-gray-600 mt-1">Receive AI-powered study recommendations</p>
        </div>
        {renderToggleSwitch(settings.aiSuggestions, (value) => handleSettingChange('aiSuggestions', value))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
        <h3 className="font-semibold text-yellow-800 mb-2 text-lg">Data Privacy</h3>
        <p className="text-sm text-yellow-700">Your study data is encrypted and never shared without your consent.</p>
      </div>

      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Anonymous Analytics</h3>
          <p className="text-sm text-gray-600 mt-1">Help improve StudyAIde by sharing anonymous usage data</p>
        </div>
        {renderToggleSwitch(settings.dataSharing, (value) => handleSettingChange('dataSharing', value))}
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h3 className="font-semibold text-gray-900 mb-6 text-lg">Danger Zone</h3>
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6">
          <button className="flex items-center px-6 py-3 border border-red-300 text-red-700 rounded-2xl hover:bg-red-50 transition-all duration-300 font-medium">
            <Trash2 className="h-5 w-5 mr-3" />
            Delete Account
          </button>
          <p className="text-xs text-red-600 mt-3">This action cannot be undone</p>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">Theme</label>
        <div className="space-y-3">
          {[
            { value: 'light', label: 'Light Theme' },
            { value: 'dark', label: 'Dark Theme' },
            { value: 'auto', label: 'System Default' }
          ].map((theme) => (
            <label key={theme.value} className="flex items-center p-4 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-lg transition-all cursor-pointer">
              <input
                type="radio"
                name="theme"
                value={theme.value}
                checked={settings.theme === theme.value}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="mr-4 text-pulse-600 focus:ring-pulse-500"
              />
              <span className="font-medium text-gray-900">{theme.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Language</label>
        <select
          value={settings.language}
          onChange={(e) => handleSettingChange('language', e.target.value)}
          className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pulse-500 focus:border-transparent bg-white/60 backdrop-blur-sm"
        >
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="german">German</option>
        </select>
      </div>
    </div>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'ai':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pulse-50 to-orange-50 border border-pulse-200 rounded-2xl p-6 text-center">
              <Brain className="h-12 w-12 text-pulse-600 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">AI preference settings coming soon...</p>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6 text-center">
              <Download className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Data and storage management coming soon...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout activeSession="settings">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-6">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600 text-lg">Manage your account and preferences</p>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Settings Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-3">
                  <nav className="space-y-2">
                    {settingsTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300 group ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-pulse-500 to-orange-600 text-white shadow-lg'
                              : 'text-gray-600 hover:bg-gradient-to-r hover:from-white/60 hover:to-white/40 hover:text-gray-900'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 transition-all ${
                            activeTab === tab.id 
                              ? 'bg-white/20' 
                              : `bg-gradient-to-r ${tab.color} text-white group-hover:scale-110`
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                    {settingsTabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  {renderCurrentTab()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
