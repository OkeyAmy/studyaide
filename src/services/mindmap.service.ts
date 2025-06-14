
import { toast } from 'sonner';

export const generateMindmap = async (
  text: string,
  materialId?: string,
  title?: string
): Promise<string> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mindMapData = `
# Mind Map for ${title || 'Material'}

## Central Topic
${title || 'Main Subject'}

### Branch 1: Key Concepts
- Concept A
  - Detail 1
  - Detail 2
- Concept B
  - Detail 3

### Branch 2: Important Points
- Point A
- Point B
- Point C

### Branch 3: Applications
- Application 1
- Application 2
    `;
    return mindMapData;
  } catch (error: any) {
    console.error(`Error generating mind map${materialId ? ` for material ${materialId}` : ''}:`, error);
    toast.error('Failed to generate mind map. Please try again.');
    throw new Error('Mind map generation failed: ' + (error.message || 'Unknown error'));
  }
};

export const generateMindmapFromFile = async (
  file: File,
  materialId?: string
): Promise<string> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mindMapData = `
# Mind Map for ${file.name}

## Central Topic
${file.name.replace(/\.[^/.]+$/, "")}

### Branch 1: Key Concepts
- Concept A
  - Detail 1
  - Detail 2
- Concept B
  - Detail 3

### Branch 2: Important Points
- Point A
- Point B
- Point C

### Branch 3: Applications
- Application 1
- Application 2
    `;
    return mindMapData;
  } catch (error: any) {
    console.error(`Error generating mind map from file${materialId ? ` for material ${materialId}` : ''}:`, error);
    toast.error('Failed to generate mind map from file. Please try again.');
    throw new Error('Mind map generation from file failed: ' + (error.message || 'Unknown error'));
  }
};

export const mindmapService = {
  generateMindmap,
  generateMindmapFromFile,
};
