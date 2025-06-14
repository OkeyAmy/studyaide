import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, Sparkles, ZoomIn, ZoomOut, RotateCcw, Network } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MaterialDisplay } from '@/types/api';
import { Markmap } from 'markmap-view';
import { Transformer } from 'markmap-lib';
import { Button } from '@/components/ui/button';

interface MaterialMindMapTabProps {
  content: any;
  material: MaterialDisplay;
}

const MaterialMindMapTab = ({ content, material }: MaterialMindMapTabProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<Markmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get mindmap data from content or use fallback
  const mindmapData = content?.mindMap || `# ${material?.title || 'Study Material'}

## Main Concepts
- Key topics and themes
- Important information
- Learning objectives

## Details  
- Supporting facts
- Examples and illustrations
- Additional context

## Applications
- Practical uses
- Real-world connections
- Further exploration`;

  const mindmapTitle = material?.title ? `Mind Map: ${material.title}` : 'Material Mind Map';

  // Initialize markmap
  useEffect(() => {
    if (svgRef.current && mindmapData) {
      const transformer = new Transformer();
      
      try {
        // Transform markdown to markmap data
        const { root } = transformer.transform(mindmapData);
        
        // Initialize or update markmap
        if (!markmapRef.current) {
          markmapRef.current = Markmap.create(svgRef.current, {
            zoom: true,
            pan: true,
            maxWidth: 300,
            initialExpandLevel: 3,
          });
        }
        
        // Render the mindmap
        markmapRef.current.setData(root);
        markmapRef.current.fit();
      } catch (error) {
        console.error('Error rendering mindmap:', error);
      }
    }

    // Cleanup function
    return () => {
      if (markmapRef.current) {
        markmapRef.current.destroy();
        markmapRef.current = null;
      }
    };
  }, [mindmapData]);

  const handleZoomIn = () => {
    if (markmapRef.current) {
      markmapRef.current.rescale(1.2);
    }
  };

  const handleZoomOut = () => {
    if (markmapRef.current) {
      markmapRef.current.rescale(0.8);
    }
  };

  const handleReset = () => {
    if (markmapRef.current) {
      markmapRef.current.fit();
    }
  };

  if (!content?.mindMap) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Network className="h-12 w-12 mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">No Mind Map Available</p>
        <p className="text-sm text-center">This material doesn't have an AI-generated mind map yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header - Redesigned */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Network className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{mindmapTitle}</h3>
              <p className="text-sm text-white/80">Visual representation of key concepts</p>
        </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="bg-white/20 hover:bg-white/30 text-white rounded-lg h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomOut}
              className="bg-white/20 hover:bg-white/30 text-white rounded-lg h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              onClick={handleZoomIn}
              className="bg-white/20 hover:bg-white/30 text-white rounded-lg h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mind Map Canvas */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden fade-in-start fade-in-active shadow-md">
        <div className="relative w-full h-[400px]">
          <svg
            ref={svgRef}
            className="w-full h-full"
          />
          </div>
        </div>

      {/* Footer - Redesigned */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-4">
          <div className="flex items-start space-x-3">
          <div className="bg-orange-100 p-1.5 rounded-full">
            <Sparkles className="h-4 w-4 text-orange-500" />
            </div>
            <div>
            <p className="text-sm font-medium text-orange-800">Mind Map Navigation</p>
            <ul className="text-xs text-orange-700 mt-1 space-y-0.5">
              <li className="flex items-center space-x-1">
                <span>•</span>
                <span>Click nodes to expand or collapse branches</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>•</span>
                <span>Drag to pan around the mind map</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>•</span>
                <span>Use mouse wheel or buttons to zoom</span>
              </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialMindMapTab; 