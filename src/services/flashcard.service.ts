
import { 
    generateJSONResponse, 
    generateJSONResponseFromFile, 
    uploadFileToGemini, 
    isAIAvailable 
} from './ai.service';

export interface Flashcard {
    question: string;
    answer: string;
    source: string;
}

export interface FlashcardSet {
    title: string;
    cards: Flashcard[];
}

/**
 * Generate flashcards from uploaded file content using Gemini API
 */
export async function generateFlashcardsFromFile(file: File): Promise<FlashcardSet> {
    console.log(`Generating flashcards from file: ${file.name}`);
    
    try {
        if (!isAIAvailable()) {
            console.warn('AI not available, using fallback flashcards');
            return generateFallbackFlashcards(file.name);
        }

        console.log('Processing file for flashcard generation...');
        
        const fileData = await uploadFileToGemini(file);
        console.log('File processed successfully for flashcards');

        const prompt = `### Flashcard Generation

Create educational flashcards from the uploaded document. Generate questions that test understanding of key concepts, definitions, and important information.

Guidelines:
- Create 8-10 flashcards
- Mix question types (definitions, explanations, applications)
- Keep answers concise but complete
- Focus on the most important concepts

Return ONLY valid JSON in this format:
{
  "title": "Flashcards: Document Title",
  "cards": [
    {
      "question": "What is...?",
      "answer": "Clear, concise answer",
      "source": "Document section or topic"
    }
  ]
}`;

        console.log('Generating flashcards from file content...');
        
        const response = await generateJSONResponseFromFile(
            fileData.base64Data,
            fileData.mimeType,
            prompt,
            0.5
        );

        console.log('Flashcards generated successfully from file');

        if (!response || !response.cards || !Array.isArray(response.cards)) {
            console.warn("Invalid flashcard response format, using fallback");
            return generateFallbackFlashcards(file.name);
        }
        
        const validCards = response.cards.filter((card: any) => 
            card.question && card.answer
        ).map((card: any) => ({
            question: card.question,
            answer: card.answer,
            source: card.source || file.name
        }));
        
        if (validCards.length === 0) {
            console.warn("No valid flashcards generated, using fallback");
            return generateFallbackFlashcards(file.name);
        }
        
        const flashcardSet: FlashcardSet = {
            title: response.title || `Flashcards - ${file.name}`,
            cards: validCards.slice(0, 10)
        };

        console.log(`Successfully generated ${flashcardSet.cards.length} flashcards`);
        return flashcardSet;

    } catch (error) {
        console.error('Error generating flashcards from file:', error);
        console.warn('Falling back to default flashcards due to error');
        return generateFallbackFlashcards(file.name);
    }
}

/**
 * Generate fallback flashcards when AI is not available
 */
function generateFallbackFlashcards(fileName: string): FlashcardSet {
    console.log('Generating fallback flashcards for:', fileName);
    
    return {
        title: `Sample Flashcards - ${fileName}`,
        cards: [
            {
                question: "What is the most effective study technique?",
                answer: "Active recall - testing yourself on the material rather than passive re-reading",
                source: "Study Methods"
            },
            {
                question: "How does spaced repetition work?",
                answer: "It involves reviewing information at increasing intervals to strengthen long-term memory",
                source: "Memory Techniques"
            },
            {
                question: "What is the benefit of practice testing?",
                answer: "It improves retention and helps identify knowledge gaps for focused study",
                source: "Learning Strategies"
            }
        ]
    };
}

// Export service object for context usage
export const flashcardService = {
    generateFlashcardsFromFile
};
