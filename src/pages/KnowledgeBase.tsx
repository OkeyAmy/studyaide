
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Search, Filter, MoreHorizontal, Plus, FileText, Play, Archive, ArrowRight } from 'lucide-react';
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
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      trend: '+2 this week',
      trendDirection: 'up' as const
    },
    {
      label: 'In Workflows',
      value: materialData?.materials?.filter(m => m.usedInWorkflow).length || 0,
      icon: Play,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      trend: 'Active usage',
      trendDirection: 'neutral' as const
    },
    {
      label: 'Archived',
      value: materialData?.materials?.filter(m => m.status === 'archived').length || 0,
      icon: Archive,
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      trend: 'Stored safely',
      trendDirection: 'neutral' as const
    },
    {
      label: 'Study Hours',
      value: `${materialData?.materials?.reduce((acc, m) => acc + m.studyTime, 0) || 0}h`,
      icon: FileText,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
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
    return (
      <AppLayout activeSession="knowledge">
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-6">
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-white/60 rounded-2xl w-1/3 mb-2"></div>
              <div className="h-4 bg-white/40 rounded-xl w-1/4"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/60 rounded-2xl animate-pulse"></div>)}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (selectedMaterial) {
    return <MaterialViewer material={selectedMaterial} onBack={() => setSelectedMaterial(null)} />;
  }

  return (
    <AppLayout activeSession="knowledge">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
              <p className="text-gray-600 text-lg">Your personal learning materials and notes</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search materials by title or tags..."
                  className="pl-12 w-full sm:w-80 bg-white/70 backdrop-blur-sm border-white/20 rounded-2xl shadow-lg focus:bg-white/80 transition-all"
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
                    className={selectedFilter === filter.key 
                      ? 'bg-gradient-to-r from-pulse-500 to-pink-500 hover:from-pulse-600 hover:to-pink-600 text-white shadow-lg rounded-xl' 
                      : 'bg-white/70 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-xl'
                    }
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsGrid stats={stats} />

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((material) => {
              const handleMaterialClick = () => {
                const materialWithCorrectTypes: MaterialDisplay = {
                  ...material,
                  status: material.status as 'active' | 'archived'
                };
                setSelectedMaterial(materialWithCorrectTypes);
              };

              return (
                <div
                  key={material.id}
                  onClick={handleMaterialClick}
                  className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/80 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">{getFileTypeIcon(material.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">{material.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{material.type}</p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-5 w-5 text-pulse-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {material.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-pulse-100 to-pink-100 text-pulse-700 border-pulse-200">
                          {tag}
                        </Badge>
                      ))}
                      {material.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-pulse-100 to-pink-100 text-pulse-700 border-pulse-200">
                          +{material.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{material.studyTime}h study time</span>
                      <Badge 
                        variant="outline" 
                        className={material.usedInWorkflow 
                          ? 'border-green-200 text-green-700 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                        }
                      >
                        {material.usedInWorkflow ? 'In Workflow' : 'Standalone'}
                      </Badge>
                    </div>

                    <div className="text-xs text-gray-400">
                      Uploaded {new Date(material.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900 mb-3">No materials found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'Try adjusting your search terms or filters.' : 'Start by uploading your first study material.'}
                </p>
                <Button className="bg-gradient-to-r from-pulse-500 to-pink-500 hover:from-pulse-600 hover:to-pink-600 text-white shadow-lg rounded-2xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default KnowledgeBase;
