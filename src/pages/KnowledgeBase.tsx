
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Search, Filter, MoreHorizontal, Plus, FileText, Play, Archive, ArrowRight, Trash2, AlertTriangle, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StatsGrid from '@/components/shared/StatsGrid';
import MaterialViewer from '@/components/material/MaterialViewer';
import { useMaterialsData, useDeleteMaterial } from '@/hooks/useDatabase';
import { MaterialDisplay } from '@/types/api';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import WorkflowSelector from '@/components/knowledge/WorkflowSelector';

const KnowledgeBase = () => {
  const { data: materialData, isLoading, refetch: refetchMaterials } = useMaterialsData();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialDisplay | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; material: MaterialDisplay | null }>({ isOpen: false, material: null });
  const [workflowSelectorState, setWorkflowSelectorState] = useState<{ isOpen: boolean; material: MaterialDisplay | null }>({ isOpen: false, material: null });
  const deleteMaterial = useDeleteMaterial();
  const isMobile = useIsMobile();

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

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.material) return;
    
    try {
      await deleteMaterial.mutateAsync(deleteConfirmation.material.id);
      toast.success(`"${deleteConfirmation.material.title}" has been deleted successfully`);
      setDeleteConfirmation({ isOpen: false, material: null });
    } catch (error) {
      toast.error('Failed to delete material. Please try again.');
      console.error('Error deleting material:', error);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, material: MaterialDisplay) => {
    e.stopPropagation(); // Prevent opening the material
    setDeleteConfirmation({ isOpen: true, material });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, material: null });
  };

  const handleAddToWorkflowClick = (e: React.MouseEvent, material: MaterialDisplay) => {
    e.stopPropagation();
    setWorkflowSelectorState({ isOpen: true, material: material });
  };

  const handleCloseWorkflowSelector = () => {
    setWorkflowSelectorState({ isOpen: false, material: null });
    refetchMaterials();
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
    return (
      <MaterialViewer 
        material={selectedMaterial} 
        onBack={() => setSelectedMaterial(null)}
        onAddToWorkflow={(material) => setWorkflowSelectorState({ isOpen: true, material })}
      />
    );
  }

  return (
    <AppLayout activeSession="knowledge">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-4 md:p-6">
        <div className="space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">Knowledge Base</h1>
              <p className="text-gray-600 text-base md:text-lg">Your personal learning materials and notes</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 sm:h-5 w-4 sm:w-5" />
                <Input
                  placeholder="Search materials..."
                  className="pl-10 sm:pl-12 w-full sm:w-64 md:w-80 bg-white/70 backdrop-blur-sm border-white/20 rounded-xl sm:rounded-2xl shadow-lg focus:bg-white/80 transition-all text-sm sm:text-base py-2.5 sm:py-3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2 sm:flex sm:gap-2`}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'active', label: 'Active' },
                  { key: 'in-workflow', label: 'In Workflow' },
                  { key: 'archived', label: 'Archived' }
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    variant={selectedFilter === filter.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`text-xs sm:text-sm py-2 sm:py-2.5 ${selectedFilter === filter.key 
                      ? 'bg-gradient-to-r from-pulse-500 to-pink-500 hover:from-pulse-600 hover:to-pink-600 text-white shadow-md rounded-lg sm:rounded-xl' 
                      : 'bg-white/70 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-lg sm:rounded-xl'
                    }`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {filteredMaterials.map((material) => {
              const handleMaterialClick = () => {
                setSelectedMaterial(material);
              };

              return (
                <div
                  key={material.id}
                  className="group bg-white/70 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg md:shadow-xl border border-white/20 hover:bg-white/80 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex items-start space-x-3 flex-1 min-w-0 cursor-pointer"
                      onClick={handleMaterialClick}
                    >
                      <span className="text-3xl md:text-4xl flex-shrink-0 pt-1">{getFileTypeIcon(material.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-tight break-words line-clamp-2 mb-0.5">
                          {material.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 capitalize">{material.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 md:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleAddToWorkflowClick(e, material)}
                        className="h-7 w-7 md:h-8 md:w-8 p-0 text-pulse-500 hover:text-pulse-700 hover:bg-pulse-50 rounded-full"
                        title="Add to workflow"
                      >
                        <Workflow className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteClick(e, material)}
                        className="h-7 w-7 md:h-8 md:w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleMaterialClick}
                        className="h-7 w-7 md:h-8 md:w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      >
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4 cursor-pointer" onClick={handleMaterialClick}>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {material.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 md:px-2.5 md:py-1 bg-gradient-to-r from-pulse-100 to-pink-100 text-pulse-700 border-pulse-200 rounded-full">
                          {tag}
                        </Badge>
                      ))}
                      {material.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 md:px-2.5 md:py-1 bg-gradient-to-r from-pulse-100 to-pink-100 text-pulse-700 border-pulse-200 rounded-full">
                          +{material.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                      <span>{material.studyTime}h study time</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0.5 md:px-2.5 md:py-1 rounded-full ${material.usedInWorkflow 
                          ? 'border-green-200 text-green-700 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        {material.usedInWorkflow ? 'In Workflow' : 'Standalone'}
                      </Badge>
                    </div>

                    <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
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
        
        {/* Delete Confirmation Modal */}
        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-auto">
              <div className="p-5 md:p-6">
                <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete Material</h3>
                    <p className="text-xs sm:text-sm text-gray-600">This action cannot be undone.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl sm:text-2xl">{deleteConfirmation.material && getFileTypeIcon(deleteConfirmation.material.type)}</span>
                    <div>
                      <p className="font-medium text-sm sm:text-base text-gray-900 line-clamp-1">{deleteConfirmation.material?.title}</p>
                      <p className="text-xs sm:text-sm text-gray-500 capitalize">{deleteConfirmation.material?.type}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
                  Are you sure you want to delete this material? This will remove it permanently.
                </p>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancelDelete}
                    className="flex-1 rounded-lg sm:rounded-md"
                    disabled={deleteMaterial.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    disabled={deleteMaterial.isPending}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-md"
                  >
                    {deleteMaterial.isPending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Deleting...</span>
                      </div>
                    ) : (
                      'Delete Material'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <WorkflowSelector
          isOpen={workflowSelectorState.isOpen}
          material={workflowSelectorState.material}
          onClose={handleCloseWorkflowSelector}
        />
      </div>
    </AppLayout>
  );
};

export default KnowledgeBase;
