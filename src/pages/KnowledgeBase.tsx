
import React, { useState } from 'react';
import { Search, Brain, FileText, Video, Headphones, Filter, Calendar, BookOpen, Tag } from 'lucide-react';

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const recentContent = [
    {
      id: 1,
      title: "Neural Network Fundamentals",
      type: "summary",
      subject: "Computer Science",
      createdAt: "2 hours ago",
      studyTime: "45 min",
      icon: Brain,
      color: "bg-purple-100 text-purple-600",
      tags: ["AI", "Machine Learning", "Deep Learning"],
      preview: "Understanding the basic structure and function of artificial neural networks..."
    },
    {
      id: 2,
      title: "Calculus Integration Techniques",
      type: "flashcards",
      subject: "Mathematics",
      createdAt: "1 day ago",
      studyTime: "30 min",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
      tags: ["Calculus", "Integration", "Mathematics"],
      preview: "Master various integration methods including substitution and integration by parts..."
    },
    {
      id: 3,
      title: "World War II Documentary",
      type: "notes",
      subject: "History",
      createdAt: "2 days ago",
      studyTime: "1.2 hours",
      icon: Video,
      color: "bg-green-100 text-green-600",
      tags: ["History", "WWII", "Documentary"],
      preview: "Comprehensive analysis of the European theater and major battles..."
    },
    {
      id: 4,
      title: "Spanish Pronunciation Guide",
      type: "audio",
      subject: "Languages",
      createdAt: "3 days ago",
      studyTime: "25 min",
      icon: Headphones,
      color: "bg-orange-100 text-orange-600",
      tags: ["Spanish", "Pronunciation", "Language Learning"],
      preview: "Audio guide covering Spanish phonetics and common pronunciation patterns..."
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

  const handleItemClick = (itemId: number) => {
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const filteredContent = recentContent.filter(item => 
    selectedFilter === 'all' || item.type === selectedFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Your personal learning repository</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      {/* Content Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedFilter === 'all' ? 'All Content' : filters.find(f => f.id === selectedFilter)?.label}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredContent.length} items found
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredContent.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedItem === item.id;
            
            return (
              <div 
                key={item.id} 
                className={`p-6 transition-colors cursor-pointer ${
                  isSelected ? 'bg-pulse-50 border-l-4 border-pulse-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleItemClick(item.id)}
              >
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

                    <div className="mt-2 flex items-center space-x-2">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-pulse-100 text-pulse-700 rounded-full">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {isSelected && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 mb-3">{item.preview}</p>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-pulse-500 text-white rounded text-sm hover:bg-pulse-600 transition-colors">
                            Open Item
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                            Add to Collection
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                            Export
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
