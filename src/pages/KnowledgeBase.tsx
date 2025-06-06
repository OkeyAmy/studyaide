
import React, { useState } from 'react';
import { ArrowLeft, Search, Brain, FileText, Video, Headphones, Filter, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const recentContent = [
    {
      id: 1,
      title: "Neural Network Fundamentals",
      type: "summary",
      subject: "Computer Science",
      createdAt: "2 hours ago",
      studyTime: "45 min",
      icon: Brain,
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 2,
      title: "Calculus Integration Techniques",
      type: "flashcards",
      subject: "Mathematics",
      createdAt: "1 day ago",
      studyTime: "30 min",
      icon: FileText,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 3,
      title: "World War II Documentary",
      type: "notes",
      subject: "History",
      createdAt: "2 days ago",
      studyTime: "1.2 hours",
      icon: Video,
      color: "bg-green-100 text-green-600"
    },
    {
      id: 4,
      title: "Spanish Pronunciation Guide",
      type: "audio",
      subject: "Languages",
      createdAt: "3 days ago",
      studyTime: "25 min",
      icon: Headphones,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  const knowledgeStats = {
    totalItems: 127,
    studyMaterials: 89,
    collections: 12,
    tagsUsed: 45
  };

  const filters = [
    { id: 'all', label: 'All Content' },
    { id: 'summary', label: 'Summaries' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'notes', label: 'Notes' },
    { id: 'audio', label: 'Audio' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pulse-500 rounded-full flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">Knowledge Base</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
              >
                {filters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{knowledgeStats.totalItems}</p>
              <p className="text-sm text-gray-600 mt-1">Total Items</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{knowledgeStats.studyMaterials}</p>
              <p className="text-sm text-gray-600 mt-1">Study Materials</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{knowledgeStats.collections}</p>
              <p className="text-sm text-gray-600 mt-1">Collections</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{knowledgeStats.tagsUsed}</p>
              <p className="text-sm text-gray-600 mt-1">Tags Used</p>
            </div>
          </div>
        </div>

        {/* Recent Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Content</h2>
            <p className="text-sm text-gray-600 mt-1">Your latest study materials and notes</p>
          </div>

          <div className="divide-y divide-gray-200">
            {recentContent.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <span className="text-sm text-gray-500">{item.createdAt}</span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <span className="inline-flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {item.subject}
                        </span>
                        <span>Study time: {item.studyTime}</span>
                        <span className="capitalize bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
