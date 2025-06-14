import React, { useEffect, useRef } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

interface MindMapViewerProps {
  content: string;
  className?: string;
}

const MindMapViewer: React.FC<MindMapViewerProps> = ({ content, className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<Markmap>();

  useEffect(() => {
    if (!svgRef.current || !content) return;

    try {
      // Transform Mermaid content to Markmap format if needed
      let markdownContent = content;
      
      // If content is Mermaid format, convert to markdown
      if (content.includes('mindmap') || content.includes('graph')) {
        markdownContent = convertMermaidToMarkdown(content);
      }
      
      // Create transformer and transform the content
      const transformer = new Transformer();
      const { root } = transformer.transform(markdownContent);
      
      // Create or update the markmap
      if (!markmapRef.current) {
        markmapRef.current = Markmap.create(svgRef.current);
      }
      
      markmapRef.current.setData(root);
      markmapRef.current.fit();
      
    } catch (error) {
      console.error('Error rendering mind map:', error);
      // Fallback to simple text display
      if (svgRef.current) {
        svgRef.current.innerHTML = `
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666">
            Error rendering mind map
          </text>
        `;
      }
    }
  }, [content]);

  const convertMermaidToMarkdown = (mermaidContent: string): string => {
    // Simple conversion from Mermaid mindmap to markdown
    let markdown = '# Mind Map\n\n';
    
    const lines = mermaidContent.split('\n');
    let currentLevel = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'mindmap') continue;
      
      // Count indentation to determine level
      const indentLevel = line.search(/\S/) / 2;
      
      // Extract text content
      let text = trimmed.replace(/[()[\]{}]/g, '').trim();
      if (!text) continue;
      
      // Convert to markdown headers/lists
      if (indentLevel === 0) {
        markdown += `# ${text}\n\n`;
      } else if (indentLevel === 1) {
        markdown += `## ${text}\n\n`;
      } else if (indentLevel === 2) {
        markdown += `### ${text}\n\n`;
      } else {
        markdown += `${'  '.repeat(indentLevel - 3)}- ${text}\n`;
      }
    }
    
    return markdown;
  };

  return (
    <div className={`mind-map-container ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full min-h-[400px]"
        style={{ background: '#fafafa' }}
      />
    </div>
  );
};

export default MindMapViewer; 