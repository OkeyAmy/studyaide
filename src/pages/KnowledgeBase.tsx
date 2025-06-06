
import React, { useState } from 'react';
import { Search, Brain, FileText, Video, Headphones, Filter, Calendar, BookOpen, Tag, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StatsGrid from '@/components/shared/StatsGrid';
import SessionCard from '@/components/shared/SessionCard';
import MaterialViewer from '@/components/material/MaterialViewer';
import { mockMaterialData } from '@/data/mockApi';
import { Material } from '@/types/api';

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const stats = [
    {
      label: 'Total Items',
      value: mockMaterialData.totalItems,
      icon: BookOpen,
      color: 'bg-blue-500',
      trend: '+12 this week',
      trendDirection: 'up' as const
    },
    {
      label: 'Study Materials',
      value: mockMaterialData.materials.filter(m => m.status === 'active').length,
      icon: FileText,
      color: 'bg-green-500',
      trend: 'Active content',
      trendDirection: 'neutral' as const
    },
    {
      label: 'In Workflows',
      value: mockMaterialData.materials.filter(m => m.usedInWorkflow).length,
      icon: Brain,
      color: 'bg-purple-500',
      trend: '3 new',
      trendDirection: 'up' as const
    },
    {
      label: 'Total Study Time',
      value: `${mockMaterialData.materials.reduce((acc, m) => acc + m.studyTime, 0).toFixed(1)}h`,
      icon: Tag,
      color: 'bg-orange-500',
      trend: 'Organized',
      trendDirection: 'neutral' as const
    }
  ];

  const filters = [
    { id: 'all', label: 'All Content' },
    { id: 'pdf', label: 'PDFs' },
    { id: 'video', label: 'Videos' },
    { id: 'audio', label: 'Audio' },
    { id: 'docx', label: 'Documents' }
  ];

  const filteredContent = mockMaterialData.materials.filter(item => 
    (selectedFilter === 'all' || item.type === selectedFilter) &&
    (searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'pdf':
      case 'docx':
      default: return FileText;
    }
  };

  const handleViewMaterial = (material: Material) => {
    setSelectedMaterial(material);
  };

  const handleBackToList = () => {
    setSelectedMaterial(null);
  };

  if (selectedMaterial) {
    return <MaterialViewer material={selectedMaterial} onBack={handleBackToList} />;
  }

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
              description={`${item.headings.length} topics • ${item.tags.length} tags`}
              icon={getIconForType(item.type)}
              lastActivity={new Date(item.uploadedAt).toLocaleDateString()}
              studyTime={`${item.studyTime}h`}
              onClick={() => setSelectedItem(selectedItem === parseInt(item.id.split('_')[1]) ? null : parseInt(item.id.split('_')[1]))}
              className={selectedItem === parseInt(item.id.split('_')[1]) ? 'ring-2 ring-pulse-500' : ''}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline" className="capitalize">
                    {item.type}
                  </Badge>
                  <Badge className={item.usedInWorkflow ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {item.usedInWorkflow ? 'In Workflow' : 'Standalone'}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {selectedItem === parseInt(item.id.split('_')[1]) && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-pulse-500 hover:bg-pulse-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMaterial(item);
                        }}
                      >
                        View Material
                      </Button>
                      <Button size="sm" variant="outline">
                        Add to Workflow
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
