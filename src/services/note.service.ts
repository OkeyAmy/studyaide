
import { toast } from 'sonner';

export const generateDetailedNotes = async (
  text: string,
  materialId?: string,
  title?: string
): Promise<string> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const notes = `
# Detailed Notes for ${title || 'Material'}

## Section 1: Introduction
- Key point 1.1
- Key point 1.2

## Section 2: Main Content
- Sub-section 2.1
  - Detail A
  - Detail B
- Sub-section 2.2
  - Detail C

## Section 3: Conclusion
- Summary point 3.1
    `;
    return notes;
  } catch (error: any) {
    console.error(`Error generating detailed notes${materialId ? ` for material ${materialId}` : ''}:`, error);
    toast.error('Failed to generate detailed notes. Please try again.');
    throw new Error('Detailed notes generation failed: ' + (error.message || 'Unknown error'));
  }
};

// Export noteService object for compatibility
export const noteService = {
  generateDetailedNotes
};
