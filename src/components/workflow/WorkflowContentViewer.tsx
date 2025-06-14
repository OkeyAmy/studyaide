
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ListItem, MaterialDisplay, FolderItem } from '@/types/api';
import MaterialList from './viewer/MaterialList';
import StudyToolsPanel from './viewer/StudyToolsPanel';
import Chatbot from './viewer/Chatbot';

interface WorkflowContentViewerProps {
  workflow: any;
  onBack: () => void;
}

const WorkflowContentViewer = ({ workflow, onBack }: WorkflowContentViewerProps) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialDisplay | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  
  const workflowMaterials = workflow.materials || [];

  useEffect(() => {
    setItems(workflowMaterials);
    if (workflowMaterials.length > 0 && !selectedMaterial) {
      const firstMaterial = workflowMaterials.find(
        (item: ListItem) => !('type' in item && item.type === 'folder')
      );
      if (firstMaterial) {
        setSelectedMaterial(firstMaterial as MaterialDisplay);
      }
    }
  }, [workflowMaterials, selectedMaterial]);

  const handleMaterialSelect = (material: MaterialDisplay) => {
    setSelectedMaterial(material);
  };
  
  const handleCreateFolder = () => {
    const newFolderName = `New Folder ${items.filter(it => 'type' in it && it.type === 'folder').length + 1}`;
    const newFolder: FolderItem = {
      type: 'folder',
      id: `folder-${Date.now()}`,
      name: newFolderName,
      children: [],
    };
    setItems(prevItems => [...prevItems, newFolder]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{workflow.title}</h1>
            <p className="text-gray-600 mt-1">{workflow.description}</p>
          </div>
        </div>

        {/* Main Content - 2 Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
          <MaterialList 
            items={items}
            selectedMaterial={selectedMaterial}
            onMaterialSelect={handleMaterialSelect}
            onCreateFolder={handleCreateFolder}
          />
          <StudyToolsPanel selectedMaterial={selectedMaterial} />
        </div>

        {/* Floating Chatbot */}
        <Chatbot selectedMaterialTitle={selectedMaterial?.title} />
      </div>

      <style>{`
        .typing-indicator span { 
          height: 6px; 
          width: 6px; 
          background-color: #9ca3af; 
          border-radius: 50%; 
          display: inline-block; 
          margin: 0 1px; 
          animation: bounce 0.6s infinite alternate; 
        }
        .typing-indicator span:nth-of-type(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-of-type(3) { animation-delay: 0.4s; }
        @keyframes bounce { 
          to { 
            opacity: 0.3; 
            transform: translate3d(0, -3px, 0); 
          } 
        }
      `}</style>
    </div>
  );
};

export default WorkflowContentViewer;
