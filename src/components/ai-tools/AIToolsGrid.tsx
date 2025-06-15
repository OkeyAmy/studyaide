
import React from 'react';
import { AITool } from '@/data/ai-tools-data';
import AIToolCard from './AIToolCard';

interface AIToolsGridProps {
  tools: AITool[];
  selectedTool: number | null;
  launchedTool: number | null;
  onSelectTool: (id: number | null) => void;
  onLaunchTool: (id: number) => void;
}

const AIToolsGrid: React.FC<AIToolsGridProps> = ({ tools, selectedTool, launchedTool, onSelectTool, onLaunchTool }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {tools.map((tool) => (
        <AIToolCard
          key={tool.id}
          tool={tool}
          isSelected={selectedTool === tool.id}
          isLaunching={launchedTool === tool.id}
          onSelect={() => onSelectTool(selectedTool === tool.id ? null : tool.id)}
          onLaunch={() => onLaunchTool(tool.id)}
        />
      ))}
    </div>
  );
};

export default AIToolsGrid;
