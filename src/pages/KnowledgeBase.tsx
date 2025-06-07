
import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Plus, FileText, Play, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StatsGrid from '@/components/shared/StatsGrid';
import MaterialViewer from '@/components/material/MaterialViewer';
import { useMaterialsData } from '@/hooks/useDatabase';
import { MaterialDisplay } from '@/types/api';

const KnowledgeBase = () => {
  const { data: materialData, isLoading } = useMaterialsData();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialDisplay | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const stats = [
    {
      label: 'Total Materials',
      value: materialData?.totalItems || 0,
      icon: FileText,
      color: 'bg-blue-500',
      trend: '+2 this week',
      trendDirection: 'up' as const
    },
    {
      label: 'In Workflows',
      value: materialData?.materials?.filter(m => m.usedInWorkflow).length || 0,
      icon: Play,
      color: 'bg-green-500',
      trend: 'Active usage',
      trendDirection: 'neutral' as const
    },
    {
      label: 'Archived',
      value: materialData?.materials?.filter(m => m.status === 'archived').length || 0,
      icon: Archive,
      color: 'bg-gray-500',
      trend: 'Stored safely',
      trendDirection: 'neutral' as const
    },
    {
      label: 'Study Hours',
      value: `${materialData?.materials?.reduce((acc, m) => acc + m.studyTime, 0) || 0}h`,
      icon: FileText,
      color: 'bg-purple-500',
      trend: 'Total time',
      trendDirection: 'up' as const
    }
  ];

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'audio': return '🎵';
      case 'video': return '🎥';
      default: return '📁';
    }
  };

  const filteredMaterials = materialData?.materials?.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && material.status === 'active') ||
                         (selectedFilter === 'archived' && material.status === 'archived') ||
                         (selectedFilter === 'in-workflow' && material.usedInWorkflow);
    
    return matchesSearch && matchesFilter;
  }) || [];

  if (isLoading) {
    return <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>)}
      </div>
    </div>;
  }

  if (selectedMaterial) {
    return <MaterialViewer material={selectedMaterial} onBack={() => setSelectedMaterial(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Your personal library of study materials</p>
        </div>
        <Button className="bg-pulse-500 hover:bg-pulse-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </div>

      {/* Stats Overview */}
      <StatsGrid stats={stats} />

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search materials by title or tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'in-workflow', label: 'In Workflows' },
              { key: 'archived', label: 'Archived' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter.key)}
                className={selectedFilter === filter.key ? 'bg-pulse-500 hover:bg-pulse-600' : ''}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <div
            key={material.id}
            onClick={() => setSelectedMaterial(material)}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getFileTypeIcon(material.type)}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{material.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{material.type}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {material.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {material.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{material.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{material.studyTime}h study time</span>
                <Badge 
                  variant="outline" 
                  className={material.usedInWorkflow ? 'border-green-200 text-green-700' : 'border-gray-200'}
                >
                  {material.usedInWorkflow ? 'In Workflow' : 'Standalone'}
                </Badge>
              </div>

              <div className="text-xs text-gray-400">
                Uploaded {new Date(material.uploadedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try adjusting your search terms or filters.' : 'Start by uploading your first study material.'}
          </p>
          <Button className="bg-pulse-500 hover:bg-pulse-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
