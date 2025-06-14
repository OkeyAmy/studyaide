import { 
    generateStructuredResponse, 
    generateContentFromFile, 
    uploadFileToGemini, 
    isAIAvailable 
} from './ai.service';

/**
 * Generate fallback mindmap when AI is not available
 */
function generateFallbackMindmap(identifier: string): string {
    // Create a markdown mindmap structure
    let mindmap = `# Study Material - ${identifier}\n\n`;
    
        mindmap += `## Key Concepts\n\n`;
    mindmap += `- Main Topics\n`;
    mindmap += `  - Core Ideas\n`;
    mindmap += `  - Supporting Details\n`;
    mindmap += `- Important Facts\n`;
    mindmap += `  - Key Information\n`;
    mindmap += `  - Relevant Data\n\n`;
    
    mindmap += `## Study Areas\n\n`;
    mindmap += `- Content Review\n`;
    mindmap += `  - Read Material\n`;
    mindmap += `  - Take Notes\n`;
    mindmap += `- Practice\n`;
    mindmap += `  - Quiz Yourself\n`;
    mindmap += `  - Test Understanding\n\n`;
    
    mindmap += `## Learning Strategies\n\n`;
    mindmap += `- Active Reading\n`;
    mindmap += `- Regular Review\n`;
    mindmap += `- Concept Mapping\n`;
    mindmap += `- Practice Questions\n`;
    
    return mindmap;
}

/**
 * Generate mindmap from uploaded file content using Gemini API
 */
export async function generateMindmapFromFile(
    file: File,
    regenerate: boolean = false
): Promise<string> {
    console.log(`${regenerate ? 'Regenerating' : 'Generating'} mindmap from file:`, file.name);
    
    try {
        if (!isAIAvailable()) {
            console.warn('AI not available, using fallback mindmap');
            return generateFallbackMindmap(file.name);
        }

        console.log('Processing file for mindmap generation...');
        
        // Convert file to base64 for inline data
        const fileData = await uploadFileToGemini(file);
        console.log('File processed successfully for mindmap');

        // Create file-specific prompt based on file type
        let fileSpecificIntro = "";
        const fileType = file.type.toLowerCase();
        
        if (fileType.includes('word') || fileType.includes('document')) {
            fileSpecificIntro = `You are analyzing content from a Microsoft Word document "${file.name}".
Create a hierarchical mind map that organizes the key concepts, topics, and relationships from this document.`;
        } else if (fileType.includes('pdf')) {
            fileSpecificIntro = `You are analyzing content from a PDF document "${file.name}".
Create a hierarchical mind map that shows the main ideas, concepts, and their connections from this document.`;
        } else if (fileType.includes('image')) {
            fileSpecificIntro = `You are analyzing content extracted from an image "${file.name}".
Create a mind map that organizes any educational content, diagrams, or text visible in the image.`;
        } else {
            fileSpecificIntro = `You are analyzing content from the file "${file.name}".
Create a hierarchical mind map that organizes the key concepts and information from this material.`;
        }

        const prompt = `### ✅ Mindmap Generator Prompt

This is a detailed mindmap generation system. You'll notice how logically structured and readable it is.
Use the uploaded file exactly as it is—do not summarize, skip sections, or infer extra content.

Your task is to extract and organize the content into a **Markdown mindmap**, built to enhance study and retention. All outputs must be generated **entirely from the uploaded file**, without introducing content from outside the source.

### 📋 Guidelines:

1. **Verbatim Extraction**:
   Use only what is present in the uploaded file. Do not invent or extrapolate topics not discussed in the material.

2. **Markdown Format Only**:
   Output should be a valid Markdown structure using \`#\`, \`##\`, \`-\`, and indentation—compatible with mindmap tools.

3. **Top-Level Structure**:
   * Title: \`# Study Material - ${file.name}\`{I want a short file name for the file not verbatim of the file name}
   * Primary Categories:
     * \`## Key Concepts\`
     * \`## Study Areas\`
     * \`## Learning Strategies\`

4. **Subtopics Must Be Organized**:
   Break down main ideas into:
   * \`- Main Topics\`
     * \`- Core Ideas\`
     * \`- Supporting Details\`
   * \`- Important Facts\`
     * \`- Key Information\`
     * \`- Relevant Data\`

5. **Adapt to Domain**:
   If the content is technical, scientific, or literary, reflect that in the structure while keeping the overall format intact.

6. **No Commentary or Explanation**:
   Only return the generated Markdown—no extra text, labels, or notes.

7. **You are not limited to the information provided, you can add more information if you think it is relevant based on the content of the file.**

### 📤 Uploaded File Analysis:
File: "${file.name}"
Type: ${fileSpecificIntro}

### 📤 Required Response Format:

# Study Material - ${file.name}(I want a short file name for the file not verbatim of the file name)

## Key Concepts

- Main Topics
  - Core Ideas
  - Supporting Details
- Important Facts
  - Key Information
  - Relevant Data

## Study Areas

- Content Review
  - Read Material
  - Take Notes
- Practice
  - Quiz Yourself
  - Test Understanding

## Learning Strategies

- Active Reading
- Regular Review
- Concept Mapping
- Practice Questions

Return ONLY the markdown text, no explanation or code blocks. Make it comprehensive but organized for easy study reference. You can expand the mindmap if you think it is relevant based on the content of the file.`;

        console.log('Generating mindmap from file content...');
        
        console.log(`\n====================== SENDING MINDMAP PROMPT TO AI ======================`);
        console.log(prompt);
        console.log(`================================================================\n`);
        
        const response = await generateContentFromFile(
            fileData.base64Data,
            fileData.mimeType,
            prompt,
            0.4
        );

        console.log(`\n====================== RAW AI MINDMAP RESPONSE ======================`);
        console.log(response);
        console.log(`================================================================\n`);
        
        console.log('Mindmap generated successfully from file');

        // Clean up the response to ensure it's valid markdown
        let cleanedResult = response.trim();
        
        // Remove any markdown code blocks if present
        if (cleanedResult.includes('```')) {
            cleanedResult = cleanedResult.replace(/```markdown\s*/g, '').replace(/```/g, '');
        }
        
        // Ensure it starts with a header
        if (!cleanedResult.startsWith('#')) {
            cleanedResult = `# Study Content - ${file.name}\n\n${cleanedResult}`;
        }
        
        // Validate that it's not empty or malformed
        if (cleanedResult.split('\n').length < 3) {
            throw new Error("Generated mindmap is too short or malformed");
        }
        
        return cleanedResult;

    } catch (error) {
        console.error('Error generating mindmap from file:', error);
        console.warn('Falling back to default mindmap due to error');
        return generateFallbackMindmap(file.name);
    }
}

/**
 * Generates a mindmap from the note's text in markdown format for markmap.
 * @param noteText The polished text of the note.
 * @returns Markdown formatted text for markmap rendering.
 * @deprecated Use generateMindmapFromFile for better results
 */
export async function generateMindmap(noteText: string): Promise<string> {
    if (!isAIAvailable()) {
        console.warn("AI service not available, generating fallback mindmap");
        return generateFallbackMindmap('text-content');
    }

    const prompt = `Create a mind map from the following text using markdown format. The mind map should be structured as a hierarchical outline using markdown headers (# ## ###) and bullet points (-). 

Structure it like this:
# Main Topic
## Major Concept 1
- Sub-point 1
- Sub-point 2
  - Detail 1
  - Detail 2
## Major Concept 2
- Sub-point 1
- Sub-point 2

Extract key concepts and their relationships. Make it hierarchical and logical. Return ONLY the markdown text, no explanation or code blocks.

Text to create mindmap from:
${noteText}`;

    try {
        const response = await generateStructuredResponse(prompt, 0.4, 800);
        
        // Clean up the response to ensure it's valid markdown
        let cleanedResult = response.trim();
        
        // Remove any markdown code blocks if present
        if (cleanedResult.includes('```')) {
            cleanedResult = cleanedResult.replace(/```markdown\s*/g, '').replace(/```/g, '');
        }
        
        // Ensure it starts with a header
        if (!cleanedResult.startsWith('#')) {
            cleanedResult = `# Study Content\n\n${cleanedResult}`;
        }
        
        // Validate that it's not empty or malformed
        if (cleanedResult.split('\n').length < 3) {
            throw new Error("Generated mindmap is too short or malformed");
        }
        
        return cleanedResult;
    } catch (error) {
        console.error('Failed to generate mindmap:', error);
        console.warn('Using fallback mindmap due to AI error');
        return generateFallbackMindmap('text-content');
    }
}

/**
 * Regenerate mindmap from uploaded file
 */
export async function regenerateMindmapFromFile(file: File): Promise<string> {
    return generateMindmapFromFile(file, true);
}

/**
 * Generate mindmap data from text
 * @param text The text to generate the mindmap from
 * @param materialId The ID of the material
 * @param title The title of the mindmap
 * @returns The generated mindmap data
 */
export const generateMindmapDataFromText = async (
  text: string,
  materialId?: string,
  title?: string
): Promise<string> => {
  try {
    // Simulate API call for mind map generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Example Mermaid syntax for a mind map
    const mindmapMarkdown = `
markmap
# ${title || 'Mind Map'}
## Key Concept 1
### Detail A
### Detail B
## Key Concept 2
### Detail C
### Detail D
    `;
    return mindmapMarkdown;
  } catch (error: any) {
    console.error(`Error generating mind map data${materialId ? ` for material ${materialId}` : ''}:`, error);
    // Using only one argument for toast.error
    toast.error('Failed to generate mind map. Please try again.');
    throw new Error('Mind map generation failed: ' + (error.message || 'Unknown error'));
  }
};

// Export service object for context usage
export const mindmapService = {
    generateMindmap,
    generateMindmapFromFile,
    regenerateMindmapFromFile,
    generateMindmapDataFromText
};
