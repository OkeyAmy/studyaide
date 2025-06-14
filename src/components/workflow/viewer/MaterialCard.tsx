
import React from 'react';
import { cn } from '@/lib/utils';
import { FileText, ChevronRight } from 'lucide-react';
import { MaterialDisplay } from '@/types/api';

interface MaterialCardProps {
  material: MaterialDisplay;
  isSelected: boolean;
  onClick: (material: MaterialDisplay) => void;
}

const MaterialCard = ({ material, isSelected, onClick }: MaterialCardProps) => (
  <div
    onClick={() => onClick(material)}
    className={cn(
      "group p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2",
      isSelected 
        ? "bg-gradient-to-br from-orange-100 to-amber-100 border-orange-300 shadow-lg" 
        : "bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 hover:shadow-md"
    )}
  >
    <div className="flex items-center gap-3">
      <div className={cn(
        "p-2 rounded-xl flex items-center justify-center",
        isSelected ? "bg-gradient-to-br from-orange-500 to-amber-500" : "bg-gray-100"
      )}>
        <FileText className={cn("h-5 w-5", isSelected ? "text-white" : "text-gray-600")} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{material.title}</h4>
        <p className="text-sm text-gray-500">{material.file_type}</p>
      </div>
      <ChevronRight className={cn("h-4 w-4 transition-transform", isSelected ? "rotate-90 text-orange-600" : "text-gray-400")} />
    </div>
  </div>
);

export default MaterialCard;
