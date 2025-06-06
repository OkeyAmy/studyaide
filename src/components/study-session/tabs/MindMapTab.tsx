
import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const MindMapTab = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const mindMapData = {
    root: {
      id: 'neural-networks',
      title: 'Neural Networks 101',
      x: 400,
      y: 300,
      children: [
        {
          id: 'neurons',
          title: 'Neurons',
          x: 200,
          y: 150,
          children: [
            { id: 'structure', title: 'Structure', x: 100, y: 100 },
            { id: 'types', title: 'Types', x: 100, y: 200 }
          ]
        },
        {
          id: 'communication',
          title: 'Communication',
          x: 600,
          y: 150,
          children: [
            { id: 'synapses', title: 'Synapses', x: 700, y: 100 },
            { id: 'signals', title: 'Signals', x: 700, y: 200 }
          ]
        },
        {
          id: 'plasticity',
          title: 'Plasticity',
          x: 200,
          y: 450,
          children: [
            { id: 'hebbian', title: 'Hebbian Learning', x: 100, y: 500 },
            { id: 'adaptation', title: 'Adaptation', x: 100, y: 550 }
          ]
        },
        {
          id: 'applications',
          title: 'Applications',
          x: 600,
          y: 450,
          children: [
            { id: 'ai', title: 'AI Systems', x: 700, y: 500 },
            { id: 'medicine', title: 'Medicine', x: 700, y: 550 }
          ]
        }
      ]
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setSelectedNode(null);
  };

  const renderNode = (node: any, isRoot = false) => (
    <g key={node.id}>
      {/* Node */}
      <g
        transform={`translate(${node.x}, ${node.y})`}
        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
        className="cursor-pointer"
      >
        <polygon
          points={isRoot ? "-40,-20 40,-20 30,20 -30,20" : "-30,-15 30,-15 25,15 -25,15"}
          className={cn(
            "transition-all duration-300",
            selectedNode === node.id
              ? "fill-pulse-500 stroke-pulse-600"
              : isRoot
                ? "fill-blue-500 stroke-blue-600"
                : "fill-white stroke-gray-300 hover:stroke-pulse-400"
          )}
          strokeWidth="2"
        />
        <text
          textAnchor="middle"
          dy="5"
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            selectedNode === node.id || isRoot ? "fill-white" : "fill-gray-700"
          )}
        >
          {node.title}
        </text>
      </g>

      {/* Lines to children */}
      {node.children?.map((child: any) => (
        <line
          key={`${node.id}-${child.id}`}
          x1={node.x}
          y1={node.y}
          x2={child.x}
          y2={child.y}
          className="stroke-gray-300 stroke-2"
        />
      ))}

      {/* Render children */}
      {node.children?.map((child: any) => renderNode(child))}
    </g>
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Interactive Mind Map</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600 min-w-[4rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mind Map Canvas */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="relative w-full h-96 overflow-hidden">
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            style={{ transform: `scale(${zoom})` }}
          >
            {renderNode(mindMapData.root, true)}
          </svg>
        </div>
      </div>

      {/* Node Details */}
      {selectedNode && (
        <div className="bg-pulse-50 rounded-xl p-6 border border-pulse-200">
          <h4 className="font-semibold text-pulse-900 mb-2">
            {selectedNode.charAt(0).toUpperCase() + selectedNode.slice(1).replace('-', ' ')}
          </h4>
          <p className="text-pulse-800 text-sm">
            Click on connected nodes to explore relationships and dive deeper into this topic.
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-gray-500">
        Click nodes to explore • Use zoom controls to navigate • Drag to move around
      </div>
    </div>
  );
};

export default MindMapTab;
