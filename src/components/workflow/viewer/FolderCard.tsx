
import React from 'react';
import { cn } from '@/lib/utils';
import { Folder, ChevronRight } from 'lucide-react';
import { FolderItem } from '@/types/api';

interface FolderCardProps {
  folder: FolderItem;
}

const FolderCard = ({ folder }: FolderCardProps) => (
  <div
    className={cn(
      "group p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2",
      "bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 hover:shadow-md"
    )}
  >
    <div className="flex items-center gap-3">
      <div className={cn(
        "p-2 rounded-xl flex items-center justify-center",
        "bg-gray-100"
      )}>
        <Folder className={cn("h-5 w-5", "text-gray-600")} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{folder.name}</h4>
        <p className="text-sm text-gray-500">{folder.children.length} items</p>
      </div>
      <ChevronRight className={cn("h-4 w-4 transition-transform", "text-gray-400")} />
    </div>
  </div>
);

export default FolderCard;
