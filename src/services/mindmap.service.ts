
import { toast } from 'sonner';

export const generateMindMap = async (
  text: string,
  materialId?: string,
  title?: string
): Promise<string> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mindMapData = `
# ${title || 'Mind Map'}

## Central Topic
${title || 'Main Subject'}

### Branch 1: Key Concepts
- Concept A
  - Sub-concept A1
  - Sub-concept A2
- Concept B
  - Sub-concept B1

### Branch 2: Applications
- Application 1
- Application 2

### Branch 3: Related Topics
- Related Topic 1
- Related Topic 2
    `;

    return mindMapData;
  } catch (error: any) {
    console.error(`Error generating mind map${materialId ? ` for material ${materialId}` : ''}:`, error);
    toast.error('Failed to generate mind map. Please try again.');
    throw new Error('Mind map generation failed: ' + (error.message || 'Unknown error'));
  }
};
