
import React from 'react';
import { AITool } from '@/data/ai-tools-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface AIToolCardProps {
  tool: AITool;
  isSelected: boolean;
  isLaunching: boolean;
  onSelect: () => void;
  onLaunch: () => void;
}

const AIToolCard: React.FC<AIToolCardProps> = ({ tool, isSelected, isLaunching, onSelect, onLaunch }) => {
  return (
    <div
      onClick={onSelect}
      className={`group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/80 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 ${
        isSelected ? 'ring-2 ring-pulse-500 bg-white/90' : ''
      }`}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
              <tool.icon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-xl mb-1">{tool.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant={tool.status === 'active' ? 'default' : 'secondary'}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              tool.status === 'active' 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200' 
                : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200'
            }`}
          >
            {tool.status}
          </Badge>
          <span className="text-sm text-gray-500 font-medium">{tool.usage}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-1">
            <span className="text-gray-500 font-medium">Efficiency</span>
            <p className="font-bold text-lg text-green-600">{tool.efficiency}</p>
          </div>
          <div className="space-y-1">
            <span className="text-gray-500 font-medium">Accuracy</span>
            <p className="font-bold text-lg text-blue-600">{tool.accuracy}</p>
          </div>
        </div>

        {isSelected && (
          <div className="pt-4 border-t border-gray-100/60">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onLaunch();
              }}
              disabled={isLaunching}
              className={`w-full bg-gradient-to-r ${tool.color} hover:shadow-lg text-white shadow-md rounded-2xl py-3 font-medium`}
              size="sm"
            >
              {isLaunching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Launching...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Launch Tool
                </>
              )}
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Last used {tool.lastUsed}
        </div>
      </div>
    </div>
  );
};

export default AIToolCard;
