import { 
    generateStructuredResponse, 
    generateContentFromFile, 
    uploadFileToGemini, 
    isAIAvailable 
} from './ai.service';

/**
 * Generate fallback summary when AI is not available
 */
function generateFallbackSummary(identifier: string): string {
    const summary = `## Study Summary

• **Content Source**: ${identifier}
• **Study Approach**: Comprehensive review and analysis recommended
• **Key Focus Areas**: Main concepts, definitions, and important details
• **Review Strategy**: Read through content systematically, identify core concepts, and create personal notes
• **Study Tips**: 
  - Break content into manageable sections
  - Focus on understanding rather than memorization
  - Review material multiple times for better retention
  - Test understanding through practice questions

## Recommendations
- Set aside dedicated study time
- Take notes on key concepts
- Create connections between different topics
- Use active learning techniques`;
    
    return summary;
}

/**
 * Generate summary from uploaded file content using Gemini API
 */
export async function generateSummaryFromFile(
    file: File,
    regenerate: boolean = false
): Promise<string> {
    console.log(`${regenerate ? 'Regenerating' : 'Generating'} summary from file:`, file.name);
    
    try {
        if (!isAIAvailable()) {
            console.warn('AI not available, using fallback summary');
            return generateFallbackSummary(file.name);
        }

        console.log('Processing file for summary generation...');
        
        // Convert file to base64 for inline data
        const fileData = await uploadFileToGemini(file);
        console.log('File processed successfully for summary');

        // Create file-specific prompt based on file type
        let fileSpecificIntro = "";
        const fileType = file.type.toLowerCase();
        
        if (fileType.includes('word') || fileType.includes('document')) {
            fileSpecificIntro = `You are analyzing content from a Microsoft Word document "${file.name}".
Focus on identifying the main themes, key concepts, and important information that would be valuable for studying.`;
        } else if (fileType.includes('pdf')) {
            fileSpecificIntro = `You are analyzing content from a PDF document "${file.name}".
Focus on extracting the main ideas, key points, and essential information for study purposes.`;
        } else if (fileType.includes('image')) {
            fileSpecificIntro = `You are analyzing content extracted from an image "${file.name}".
Focus on summarizing any text, diagrams, or educational content visible in the image.`;
        } else {
            fileSpecificIntro = `You are analyzing content from the file "${file.name}".
Focus on identifying the main concepts and key information for effective studying.`;
        }

        const prompt = `### ✅ Summary Generator Prompt (Markdown Output)

This is a detailed summary generation system. It's structured, clean, and designed for quick review.

Use the uploaded file **exactly as it is**. Your task is to generate a well-structured **Markdown summary**, staying completely faithful to the file. Do not add, interpret, or infer beyond what's provided.

### 📋 Guidelines:

1. **Only Markdown**:
   Return the summary in plain Markdown using \`#\`, \`##\`, \`-\`, and \`*\` formatting. No other formats.

2. **Content Must Be File-Based**:
   Do **not** include external knowledge or context. Only summarize what's actually in the uploaded file.

3. **Structure**:
   Use this format:

   # Summary: ${file.name}

   ## Main Idea
   A single-sentence overview of the document's purpose or subject.

   ## Key Points
   - Key Point 1
   - Key Point 2
   - Key Point 3
   - (Continue as needed)

   ## Important Terms
   - **Term 1**: Short explanation
   - **Term 2**: Short explanation

   ## Conclusion
   A short summary or insight if present in the file.

4. **No Extra Text**:
   Do not explain your output, describe the process, or add system notes. Just the Markdown.

### 📤 Uploaded File Analysis:
File: "${file.name}"
Type: ${fileSpecificIntro}

### 📥 Required Response Format Example:

# Summary: ${file.name}

## Main Idea
An overview of how the document's main subject or purpose.

## Key Points
- Main concept or idea from the file
- Important fact or information from the file
- Key process or method described in the file

## Important Terms
- **Term 1**: Definition or explanation from the file
- **Term 2**: Definition or explanation from the file

## Conclusion
A short summary or insight if present in the file.

You should not write '''markdown''' at the beginning of the summary. just start straight away with the summary.

Provide a summary that helps students understand and learn the material effectively. You are not limited to this information, you can add more information if you think it is relevant. for understanding the material.`;

        console.log('Generating summary from file content...');
        
        console.log(`\n====================== SENDING SUMMARY PROMPT TO AI ======================`);
        console.log(prompt);
        console.log(`================================================================\n`);
        
        const response = await generateContentFromFile(
            fileData.base64Data,
            fileData.mimeType,
            prompt,
            0.3
        );

        console.log(`\n====================== RAW AI SUMMARY RESPONSE ======================`);
        console.log(response);
        console.log(`================================================================\n`);
        
        console.log('Summary generated successfully from file');

        // Validate that we got a meaningful response
        if (!response || response.trim().length < 20) {
            throw new Error("Generated summary is too short or empty");
        }
        
        return response;

    } catch (error) {
        console.error('Error generating summary from file:', error);
        console.warn('Falling back to default summary due to error');
        return generateFallbackSummary(file.name);
    }
}

/**
 * Generates a flashcard-style summary from the note's text.
 * @param noteText The polished text of the note.
 * @returns A markdown-formatted summary string.
 * @deprecated Use generateSummaryFromFile for better results
 */
export async function generateSummary(noteText: string): Promise<string> {
    if (!isAIAvailable()) {
        console.warn("AI service not available, generating fallback summary");
        return generateFallbackSummary('text-content');
    }

    const prompt = `Create a flashcard-style summary of the following text. Extract 3-5 key points. Format each as a bullet point with a bolded heading, followed by a brief explanation. Preserve the original language(s). Do NOT add any intro/outro commentary.

Text to summarize:
${noteText}`;

    try {
        const result = await generateStructuredResponse(prompt, 0.3);
        
        // Validate that we got a meaningful response
        if (!result || result.trim().length < 20) {
            throw new Error("Generated summary is too short or empty");
        }
        
        return result;
    } catch (error) {
        console.error('Error generating summary:', error);
        console.warn('Using fallback summary due to AI error');
        return generateFallbackSummary('text-content');
    }
}

/**
 * Regenerate summary from uploaded file
 */
export async function regenerateSummaryFromFile(file: File): Promise<string> {
    return generateSummaryFromFile(file, true);
}

// Export service object for context usage
export const summaryService = {
    generateSummary,
    generateSummaryFromFile,
    regenerateSummaryFromFile
}; 