import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudySession } from '@/contexts/StudySessionContext';
import { Markmap } from 'markmap-view';
import { Transformer } from 'markmap-lib';

const MindMapTab = () => {
  const { sessionData, generateMindMap, isGeneratingContent } = useStudySession();
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<Markmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get mindmap data from session or use fallback
  const mindmapData = sessionData?.mindMap || `# Study Material

## Main Content
- Educational content for learning
- Study materials and resources
- Key concepts and information

## Study Areas  
- Content Review
- Practice Questions
- Knowledge Application

## Study Tips
- Regular review sessions
- Active engagement with material
- Test your understanding`;

  const mindmapTitle = sessionData?.fileName ? `Mind Map: ${sessionData.fileName}` : 'Study Mind Map';

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

  const handleGenerateMindMap = async () => {
    if (!sessionData?.polishedNote) {
      return;
    }
    setIsLoading(true);
    try {
      await generateMindMap();
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!sessionData?.polishedNote) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Sparkles className="h-12 w-12 mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">No Content Available</p>
        <p className="text-sm text-center">Upload a file or record audio to generate a mind map</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{mindmapTitle}</h3>
          <p className="text-sm text-gray-600">Interactive mind map visualization</p>
        </div>
        <div className="flex items-center space-x-2">
          {!sessionData.mindMap && (
            <button
              onClick={handleGenerateMindMap}
              disabled={isGeneratingContent || isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-pulse-500 text-white rounded-lg hover:bg-pulse-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={cn("h-4 w-4", (isGeneratingContent || isLoading) && "animate-spin")} />
              <span>{isGeneratingContent || isLoading ? 'Generating...' : 'Generate Mind Map'}</span>
            </button>
          )}
          
          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mind Map Canvas */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="relative w-full h-96">
          <svg
            ref={svgRef}
            className="w-full h-full"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <span className="mr-2">🗺️</span>
          How to Use the Mind Map
        </h4>
        <div className="text-blue-800 text-sm space-y-2">
          <p>• <strong>Navigate:</strong> Click and drag to pan around the mind map</p>
          <p>• <strong>Zoom:</strong> Use the zoom controls or scroll wheel to zoom in/out</p>
          <p>• <strong>Expand/Collapse:</strong> Click on nodes to expand or collapse branches</p>
          <p>• <strong>Reset:</strong> Use the reset button to fit the entire map in view</p>
        </div>
      </div>

      {/* Regenerate Button */}
      {sessionData.mindMap && (
        <div className="text-center">
          <button
            onClick={handleGenerateMindMap}
            disabled={isGeneratingContent || isLoading}
            className="text-sm text-pulse-600 hover:text-pulse-700 underline disabled:opacity-50"
          >
            {isGeneratingContent || isLoading ? 'Regenerating...' : 'Regenerate Mind Map'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MindMapTab;
