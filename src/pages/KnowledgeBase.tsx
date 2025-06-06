
import React, { useState } from 'react';
import { Search, Brain, FileText, Video, Headphones, Filter, Calendar, BookOpen, Tag, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StatsGrid from '@/components/shared/StatsGrid';
import SessionCard from '@/components/shared/SessionCard';

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const stats = [
    {
      label: 'Total Items',
      value: 127,
      icon: BookOpen,
      color: 'bg-blue-500',
      trend: '+12 this week',
      trendDirection: 'up' as const
    },
    {
      label: 'Study Materials',
      value: 89,
      icon: FileText,
      color: 'bg-green-500',
      trend: 'Active content',
      trendDirection: 'neutral' as const
    },
    {
      label: 'Collections',
      value: 12,
      icon: Brain,
      color: 'bg-purple-500',
      trend: '3 new',
      trendDirection: 'up' as const
    },
    {
      label: 'Tags Used',
      value: 45,
      icon: Tag,
      color: 'bg-orange-500',
      trend: 'Organized',
      trendDirection: 'neutral' as const
    }
  ];

  const recentContent = [
    {
      id: 1,
      title: "Neural Network Fundamentals",
      type: "summary",
      subject: "Computer Science",
      createdAt: "2 hours ago",
      studyTime: "45 min",
      icon: Brain,
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
      tags: ["Spanish", "Pronunciation", "Language Learning"],
      preview: "Audio guide covering Spanish phonetics and common pronunciation patterns..."
    }
  ];

  const filters = [
    { id: 'all', label: 'All Content' },
    { id: 'summary', label: 'Summaries' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'notes', label: 'Notes' },
    { id: 'audio', label: 'Audio' }
  ];

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
        <Button variant="outline">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          Manage Collections
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
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
      <StatsGrid stats={stats} />

      {/* Content Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedFilter === 'all' ? 'All Content' : filters.find(f => f.id === selectedFilter)?.label}
          </h2>
          <p className="text-sm text-gray-600">{filteredContent.length} items found</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContent.map((item) => (
            <SessionCard
              key={item.id}
              title={item.title}
              description={item.preview}
              icon={item.icon}
              lastActivity={item.createdAt}
              studyTime={item.studyTime}
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              className={selectedItem === item.id ? 'ring-2 ring-pulse-500' : ''}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.subject}</span>
                  <Badge variant="outline" className="capitalize">
                    {item.type}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {selectedItem === item.id && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-pulse-500 hover:bg-pulse-600">
                        Open Item
                      </Button>
                      <Button size="sm" variant="outline">
                        Add to Collection
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SessionCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
