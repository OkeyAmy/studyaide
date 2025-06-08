import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ArrowLeft, User, Bell, Shield, Palette, Brain, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'ai', label: 'AI Preferences', icon: Brain },
    { id: 'data', label: 'Data & Storage', icon: Download }
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

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          defaultValue={user?.user_metadata?.full_name || ''}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          defaultValue={user?.email || ''}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
          disabled
        />
        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
        <textarea
          placeholder="What are your current learning objectives?"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <button className="bg-pulse-500 text-white px-4 py-2 rounded-lg hover:bg-pulse-600 transition-colors">
        Save Changes
      </button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Email Notifications</h3>
          <p className="text-sm text-gray-600">Receive updates about your study progress</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pulse-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pulse-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Study Reminders</h3>
          <p className="text-sm text-gray-600">Get reminded about scheduled study sessions</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.studyReminders}
            onChange={(e) => handleSettingChange('studyReminders', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pulse-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pulse-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">AI Suggestions</h3>
          <p className="text-sm text-gray-600">Receive AI-powered study recommendations</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.aiSuggestions}
            onChange={(e) => handleSettingChange('aiSuggestions', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pulse-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pulse-600"></div>
        </label>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">Data Privacy</h3>
        <p className="text-sm text-yellow-700">Your study data is encrypted and never shared without your consent.</p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Anonymous Analytics</h3>
          <p className="text-sm text-gray-600">Help improve StudyAIde by sharing anonymous usage data</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.dataSharing}
            onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pulse-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pulse-600"></div>
        </label>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-medium text-gray-900 mb-4">Danger Zone</h3>
        <button className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </button>
        <p className="text-xs text-gray-500 mt-2">This action cannot be undone</p>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={settings.theme === 'light'}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="mr-3"
            />
            Light Theme
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={settings.theme === 'dark'}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="mr-3"
            />
            Dark Theme
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="theme"
              value="auto"
              checked={settings.theme === 'auto'}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="mr-3"
            />
            System Default
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
        <select
          value={settings.language}
          onChange={(e) => handleSettingChange('language', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
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
            <p className="text-gray-600">AI preference settings coming soon...</p>
          </div>
        );
      case 'data':
        return (
          <div className="space-y-6">
            <p className="text-gray-600">Data and storage management coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout activeSession="settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <nav className="p-2">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-1 ${
                          activeTab === tab.id
                            ? 'bg-pulse-50 text-pulse-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {settingsTabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                {renderCurrentTab()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
