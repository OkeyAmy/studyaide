
import { toast } from 'sonner';

export const generateMindmap = async (
  text: string,
  materialId?: string,
  title?: string
): Promise<string> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call

    const mindMapData = `
# ${title || 'Mind Map from Text'}

## Central Topic
${title || 'Main Subject: ' + text.substring(0, 30)}...

### Branch 1: Key Concepts Extracted
- Concept based on: ${text.substring(0, 20)}...
- Another concept from text

### Branch 2: Document Structure
- Section Foo
- Section Bar
    `;
    return mindMapData;
  } catch (error: any) {
    console.error(`Error generating mind map from text${materialId ? ` for material ${materialId}` : ''}:`, error);
    toast.error('Failed to generate mind map from text. Please try again.');
    throw new Error('Mind map generation from text failed: ' + (error.message || 'Unknown error'));
  }
};

export const generateMindmapFromFile = async (
  file: File,
  materialId?: string,
  title?: string
): Promise<string> => {
  const effectiveTitle = title || file.name;
  console.log(`Generating mind map from file: ${file.name}, materialId: ${materialId}, title: ${effectiveTitle}`);
  try {
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate file processing

    const mindMapData = `
# Mind Map for ${effectiveTitle} (File Based)

## File Overview
- Type: ${file.type}
- Size: ${file.size} bytes

## Key Sections (Simulated)
- Introduction from ${file.name}
- Main content points
- Conclusion of ${file.name}
    `;
    return mindMapData;
  } catch (error: any) {
    console.error(`Error generating mind map from file ${materialId ? ` for material ${materialId}` : ''}:`, error);
    toast.error('Failed to generate mind map from file. Please try again.');
    throw new Error('Mind map generation from file failed: ' + (error.message || 'Unknown error'));
  }
};

export const mindmapService = {
  generateMindmap,
  generateMindmapFromFile,
};

