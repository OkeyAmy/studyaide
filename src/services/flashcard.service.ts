import { 
    generateJSONResponse, 
    generateJSONResponseFromFile, 
    uploadFileToGemini, 
    isAIAvailable 
} from './ai.service';

export interface Flashcard {
    question: string;
    answer: string;
    source?: string;
}

export interface FlashcardSet {
    title: string;
    cards: Flashcard[];
}

/**
 * Generate fallback flashcards when AI is not available
 */
function generateFallbackFlashcards(identifier: string): FlashcardSet {
    console.log('Generating fallback flashcards for:', identifier);
    
    const title = `Flashcards: ${identifier}`;
    const cards: Flashcard[] = [];
    
    // Add a default example card
    cards.push({
        question: "What is active recall?",
        answer: "A learning technique that involves actively retrieving information from memory rather than passively reviewing it.",
        source: "Learning Techniques"
    });

        cards.push({
        question: "What is spaced repetition?",
        answer: "A learning technique that involves reviewing information at increasing intervals to improve long-term retention.",
        source: "Learning Techniques"
    });

            cards.push({
        question: "Why are flashcards effective for studying?",
        answer: "Flashcards promote active recall and spaced repetition, both of which enhance memory formation and retention of information.",
        source: "Learning Techniques"
    });
    
    return { title, cards };
}

/**
 * Generate flashcards from uploaded file content using Gemini API
 */
export async function generateFlashcardsFromFile(
    file: File,
    regenerate: boolean = false
): Promise<FlashcardSet> {
    console.log(`${regenerate ? 'Regenerating' : 'Generating'} flashcards from file:`, file.name);
    
    try {
    if (!isAIAvailable()) {
            console.warn('AI not available, using fallback flashcards');
            return generateFallbackFlashcards(file.name);
        }

        console.log('Processing file for flashcard generation...');
        
        // Convert file to base64 for inline data
        const fileData = await uploadFileToGemini(file);
        console.log('File processed successfully for flashcards');

        // Create file-specific prompt based on file type
        let fileSpecificIntro = "";
        const fileType = file.type.toLowerCase();
        
        if (fileType.includes('word') || fileType.includes('document')) {
            fileSpecificIntro = `document`;
        } else if (fileType.includes('pdf')) {
            fileSpecificIntro = `PDF document`;
        } else if (fileType.includes('image')) {
            fileSpecificIntro = `image`;
        } else {
            fileSpecificIntro = `document`;
        }

        const prompt = `### 📝 Flashcard Generation Prompt

Your task is to extract and convert factual knowledge from the file into **flashcards** in JSON format.

### 📋 Guidelines:

1. **Source Fidelity**:
   Only use factual content **directly** from the uploaded file. Do not inject outside knowledge or context.

2. **Q&A Format**:
   Each flashcard must have a clear \`question\` and \`answer\` pair. Keep answers concise, correct, and informative.

3. **No Commentary**:
   Do not explain your choices, output examples, or format descriptions. Just return the flashcard JSON.

4. **Source Field**:
   The \`"source"\` field must exactly match the uploaded file name: "${file.name}".

5. **Content Scope**:
   Extract from any domain: science, literature, social science, programming, etc. Adapt to the document's domain without altering voice.

6. **Natural Language**:
   Write questions as naturally phrased as possible. Make answers clear and complete.

### 📤 Uploaded File Analysis:
File: "${file.name}"
Type: ${fileSpecificIntro}

### 📥 Required Response Format:

{
    "title": "Descriptive title summarizing the content area",
  "cards": [
    {
            "question": "What is the primary function of mitochondria in cells?",
            "answer": "Mitochondria are the powerhouse of the cell, responsible for producing ATP (energy) through cellular respiration.",
            "source": "${file.name}"
        },
        {
            "question": "What is the formula for calculating the area of a circle?",
            "answer": "A = πr², where A is the area, π (pi) is approximately 3.14159, and r is the radius of the circle.",
            "source": "${file.name}"
        }
    ]
}

Important: Generate EXACTLY 10 flashcards based on the document content. Return ONLY valid JSON.`;

        console.log('Generating flashcards from file content...');
        
        console.log(`\n====================== SENDING FLASHCARD PROMPT TO AI ======================`);
        console.log(prompt);
        console.log(`================================================================\n`);
        
        try {
            const response = await generateJSONResponseFromFile(
                fileData.base64Data,
                fileData.mimeType,
                prompt,
                0.7
            );

            console.log(`\n====================== RAW AI FLASHCARDS RESPONSE ======================`);
            console.log(JSON.stringify(response, null, 2));
            console.log(`======================================================================\n`);
            
            console.log('AI response received:', response);

            // Validate and structure the response
            if (!response || !response.cards || !Array.isArray(response.cards)) {
                console.warn('Invalid AI response format, using fallback');
                return generateFallbackFlashcards(file.name);
            }
            
            const flashcardSet: FlashcardSet = {
                title: response.title || `Flashcards from ${file.name}`,
                cards: response.cards.slice(0, 10).map((card: any) => ({
                    question: card.question || 'Question not available',
                    answer: card.answer || 'Answer not available',
                    source: card.source || file.name
                }))
            };

            console.log(`Successfully generated ${flashcardSet.cards.length} flashcards`);
            return flashcardSet;
        } catch (error) {
            console.error('Error with JSON parsing in flashcard generation:', error);
            return generateFallbackFlashcards(file.name);
        }

    } catch (error) {
        console.error('Error generating flashcards from file:', error);
        console.warn('Falling back to default flashcards due to error');
        return generateFallbackFlashcards(file.name);
    }
}

/**
 * Generate flashcards from text content (fallback method)
 * @deprecated Use generateFlashcardsFromFile for better results
 */
export async function generateFlashcards(
    noteText: string,
    regenerate: boolean = false
): Promise<FlashcardSet> {
    console.log(`${regenerate ? 'Regenerating' : 'Generating'} flashcards from text content...`);
    
    try {
        if (!isAIAvailable() || !noteText.trim()) {
            console.warn('AI not available or no content, using fallback flashcards');
            return generateFallbackFlashcards('text-content');
        }

        // Use 3 fallback examples in the prompt
        const exampleCards = generateFallbackFlashcards('examples').cards.slice(0, 3);
        const examplesText = exampleCards.map((card, index) => 
            `Example ${index + 1}:
{
    "question": "${card.question}",
    "answer": "${card.answer}",
    "source": "${card.source}"
}`
        ).join('\n\n');

        const prompt = `Create exactly 10 educational flashcards from the following content that will help someone study and learn this material effectively.

Here are 3 examples of well-formatted flashcards to guide your response format:

${examplesText}

Content to create flashcards from:
${noteText}

Requirements:
1. Generate exactly 10 flashcards
2. Make questions clear, specific, and educational
3. Provide comprehensive but concise answers
4. Include a source field that indicates the topic/subject area
5. Cover the most important concepts, facts, or skills from the content
6. Ensure questions test understanding, not just memorization
7. Use appropriate difficulty level for the content

Return your response as a JSON object with this exact structure:
{
    "title": "Descriptive title for the flashcard set",
  "cards": [
    {
            "question": "Your question here",
            "answer": "Detailed answer here",
            "source": "Topic/subject area"
        }
    ]
}

Generate exactly 10 flashcards.`;

        console.log('Sending request to AI service...');
        
        try {
            const response = await generateJSONResponse(prompt, 0.7);
            console.log('AI response received:', response);

            if (!response || !response.cards || !Array.isArray(response.cards)) {
                console.warn('Invalid AI response format, using fallback');
                return generateFallbackFlashcards('text-content');
            }
            
            const flashcardSet: FlashcardSet = {
                title: response.title || "Study Flashcards",
                cards: response.cards.slice(0, 10).map((card: any) => ({
                    question: card.question || 'Question not available',
                    answer: card.answer || 'Answer not available',
                    source: card.source || 'Unknown'
                }))
            };

            console.log(`Successfully generated ${flashcardSet.cards.length} flashcards`);
            return flashcardSet;
        } catch (error) {
            console.error('Error with JSON parsing in flashcard generation:', error);
            return generateFallbackFlashcards('text-content');
        }

    } catch (error) {
        console.error('Error generating flashcards:', error);
        console.warn('Falling back to default flashcards due to error');
        return generateFallbackFlashcards('text-content');
    }
}

/**
 * Regenerate flashcards from uploaded file
 */
export async function regenerateFlashcardsFromFile(file: File): Promise<FlashcardSet> {
    return generateFlashcardsFromFile(file, true);
}

/**
 * Regenerate flashcards from text content  
 * @deprecated Use regenerateFlashcardsFromFile for better results
 */
export async function regenerateFlashcards(noteText: string): Promise<FlashcardSet> {
    return generateFlashcards(noteText, true);
}

// Export service object for context usage
export const flashcardService = {
    generateFlashcards,
    regenerateFlashcards,
    generateFlashcardsFromFile,
    regenerateFlashcardsFromFile
}; 