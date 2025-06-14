import React, { useState, useMemo } from 'react';
import { Plus, Search, LayoutGrid, List, Filter, Download, Eye, Edit3, Trash2, FolderPlus, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useMaterials, useDeleteMaterial } from '@/hooks/useDatabase';
import { MaterialDisplay, MaterialType } from '@/types/api';
import { toast } from 'sonner';
import MaterialViewer from '@/components/material/MaterialViewer';
import WorkflowSelector from '@/components/knowledge/WorkflowSelector'; // Added import

interface MaterialCardProps {
  material: MaterialDisplay;
  onView: () => void;
  onEdit?: () => void; // Optional: if edit functionality exists
  onDelete: () => void;
  onDownload?: () => void; // Optional
  onAddToWorkflow: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onView, onDelete, onAddToWorkflow }) => {
  const typeIcons: Record<MaterialType | 'other', string> = {
    pdf: '📄',
    docx: '📝',
    audio: '🎵',
    video: '🎥',
    image: '🖼️',
    text: 'TXT',
    other: '📁',
  };

  const getFileIcon = (type: MaterialType | 'other') => typeIcons[type] || typeIcons.other;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl border border-gray-200 flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{getFileIcon(material.type)}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
              {/* <DropdownMenuItem onClick={onEdit}><Edit3 className="mr-2 h-4 w-4" /> Edit (coming soon)</DropdownMenuItem> */}
              <DropdownMenuItem onClick={onAddToWorkflow}><Workflow className="mr-2 h-4 w-4" /> Add to Workflow</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600 hover:!text-red-700"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-1" title={material.title}>{material.title}</h3>
        <p className="text-xs text-gray-500 uppercase mb-3">{material.type} - {new Date(material.uploadedAt).toLocaleDateString()}</p>
        
        <div className="text-sm text-gray-600 mb-4 line-clamp-2">
          {material.content_summary || 'No summary available.'}
        </div>

      </div>
      <div className="bg-gray-50 p-4 border-t border-gray-100">
         <Button onClick={onView} variant="outline" size="sm" className="w-full">
          View Material
        </Button>
      </div>
    </div>
  );
};


const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialDisplay | null>(null);
  const [isWorkflowSelectorOpen, setIsWorkflowSelectorOpen] = useState(false);
  const [workflowMaterial, setWorkflowMaterial] = useState<MaterialDisplay | null>(null);

  const [filterState, setFilterState] = useState<{
    types: MaterialType[];
    status: ('active' | 'archived')[];
    // Add other filter criteria like date ranges if needed
  }>({
    types: [],
    status: ['active'], // Default to active materials
  });

  const materialsQuery = useMaterials();
  const deleteMaterialMutation = useDeleteMaterial();

  const handleDeleteMaterial = async (materialId: string) => {
    if (window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      try {
        await deleteMaterialMutation.mutateAsync(materialId);
        toast.success('Material deleted successfully');
        if (selectedMaterial?.id === materialId) {
          setSelectedMaterial(null); // Close viewer if deleted material was selected
        }
      } catch (error) {
        toast.error('Failed to delete material. Please try again.');
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleViewMaterial = (material: MaterialDisplay) => {
    setSelectedMaterial(material);
  };
  
  const handleAddToWorkflow = (material: MaterialDisplay) => {
    setWorkflowMaterial(material);
    setIsWorkflowSelectorOpen(true);
  };

  const materialTypes: MaterialType[] = ['pdf', 'docx', 'audio', 'video', 'image', 'text'];
  const statuses: ('active' | 'archived')[] = ['active', 'archived'];


  const filteredMaterials = useMemo(() => {
    let materials = materialsQuery.data || [];

    // Search term filter
    if (searchTerm) {
      materials = materials.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Type filter
    if (filterState.types.length > 0) {
      materials = materials.filter(m => filterState.types.includes(m.type as MaterialType));
    }
    
    // Status filter
    if (filterState.status.length > 0) {
      materials = materials.filter(m => filterState.status.includes(m.status as 'active' | 'archived'));
    }

    return materials.map(m => ({
      ...m,
      // Ensure status conforms to MaterialDisplay['status'] for downstream components
      status: m.status as "active" | "archived",
    } as MaterialDisplay)); // Cast the whole object to MaterialDisplay
  }, [materialsQuery.data, searchTerm, filterState]);


  if (materialsQuery.isLoading) return <div className="p-8 text-center">Loading materials...</div>;
  if (materialsQuery.isError) return <div className="p-8 text-center text-red-500">Error loading materials.</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Manage and explore your learning materials.</p>
        </div>
        <Button size="lg" className="bg-pulse-500 hover:bg-pulse-600 text-white">
          <Plus className="h-5 w-5 mr-2" /> Add New Material (Soon)
        </Button>
      </div>

      {/* Controls: Search, Filter, View Mode */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search materials by title..."
            className="pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {materialTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={filterState.types.includes(type)}
                  onCheckedChange={(checked) => {
                    setFilterState(prev => ({
                      ...prev,
                      types: checked ? [...prev.types, type] : prev.types.filter(t => t !== type)
                    }));
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statuses.map((status) => (
                 <DropdownMenuCheckboxItem
                  key={status}
                  checked={filterState.status.includes(status)}
                  onCheckedChange={(checked) => {
                    setFilterState(prev => ({
                      ...prev,
                      status: checked ? [...prev.status, status] : prev.status.filter(s => s !== status)
                    }));
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')} className="hidden md:block">
            <TabsList>
              <TabsTrigger value="grid"><LayoutGrid className="h-5 w-5" /></TabsTrigger>
              <TabsTrigger value="list"><List className="h-5 w-5" /></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Materials Display */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <FolderPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Materials Found</h3>
          <p className="text-gray-500">
            {materialsQuery.data?.length === 0 
              ? "Your knowledge base is empty. Start by adding some materials!"
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material} // material is now correctly typed MaterialDisplay
                onView={() => handleViewMaterial(material)}
                onDelete={() => handleDeleteMaterial(material.id)}
                onAddToWorkflow={() => handleAddToWorkflow(material)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* List View (Simplified - implement if needed) */}
            {filteredMaterials.map((material) => (
               <div key={material.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{material.title}</h4>
                  <p className="text-sm text-gray-500">{material.type} - {new Date(material.uploadedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewMaterial(material)}>View</Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddToWorkflow(material)}>Add to Workflow</Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteMaterial(material.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Material Viewer Modal/Drawer */}
      {selectedMaterial && (
        <MaterialViewer
          material={selectedMaterial}
          isOpen={!!selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
        />
      )}

      {/* Workflow Selector Modal */}
      {workflowMaterial && (
        <WorkflowSelector
          material={workflowMaterial}
          isOpen={isWorkflowSelectorOpen}
          onClose={() => {
            setIsWorkflowSelectorOpen(false);
            setWorkflowMaterial(null);
          }}
        />
      )}
    </div>
  );
};

export default KnowledgeBase;
