
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, FolderPlus, Layers } from 'lucide-react';
import MaterialCard from './MaterialCard';
import FolderCard from './FolderCard';
import { MaterialDisplay, FolderItem, ListItem } from '@/types/api';

interface MaterialListProps {
  items: ListItem[];
  selectedMaterial: MaterialDisplay | null;
  onMaterialSelect: (material: MaterialDisplay) => void;
  onCreateFolder: () => void;
}

const MaterialList = ({ items, selectedMaterial, onMaterialSelect, onCreateFolder }: MaterialListProps) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg p-6 h-full">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Materials ({items.length})</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onCreateFolder} className="rounded-full bg-white/60 hover:bg-white/80">
            <FolderPlus className="h-5 w-5 text-blue-600" />
          </Button>
        </div>
        
        <div className="space-y-3 overflow-y-auto max-h-[calc(100%-80px)]">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No materials in this workflow</p>
            </div>
          ) : (
            items.map((item) => {
              if ('type' in item && item.type === 'folder') {
                return <FolderCard key={item.id} folder={item as FolderItem} />;
              }
              const material = item as MaterialDisplay;
              return (
                <MaterialCard 
                  key={material.id} 
                  material={material} 
                  isSelected={selectedMaterial?.id === material.id}
                  onClick={onMaterialSelect}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialList;
