import { generateStructuredResponse, isAIAvailable } from './ai.service';

/**
 * Fallback responses when AI is not available
 */
const FALLBACK_RESPONSES = [
    "I'm sorry, I'm having trouble accessing my AI capabilities right now. Please try again later.",
    "It looks like I can't generate a detailed response at the moment. Could you try rephrasing your question?",
    "I'm experiencing some technical difficulties. In the meantime, you might want to review your study materials directly.",
    "My AI services are temporarily unavailable. Please check your internet connection and try again.",
    "I'm unable to provide a detailed answer right now. Consider reviewing the main content in your notes tab."
];

/**
 * Get a random fallback response
 */
function getRandomFallbackResponse(): string {
    return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

/**
 * Generate contextual fallback response based on question
 */
function getContextualFallbackResponse(question: string, context: string): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('summary') || lowerQuestion.includes('summarize')) {
        return "I can't generate a summary right now, but you can find the main points in your Summary tab or review the polished notes.";
    }
    
    if (lowerQuestion.includes('quiz') || lowerQuestion.includes('test') || lowerQuestion.includes('question')) {
        return "I'm unable to create quiz questions at the moment. Check your Quiz tab for generated questions or create your own based on the key concepts.";
    }
    
    if (lowerQuestion.includes('mindmap') || lowerQuestion.includes('mind map') || lowerQuestion.includes('concept')) {
        return "I can't generate a mind map right now, but you can find one in your Mind Map tab or create your own visual representation of the concepts.";
    }
    
    if (lowerQuestion.includes('flashcard')) {
        return "I'm unable to create flashcards at the moment. You can find generated flashcards in your Flashcards tab or create your own study cards.";
    }
    
    // If we have some context, provide a basic response
    if (context && context.length > 50) {
        const preview = context.substring(0, 200).trim();
        return `I'm having trouble providing a detailed response right now. Based on your study material, here's a brief excerpt that might be relevant: "${preview}${context.length > 200 ? '...' : ''}"`;
    }
    
    return getRandomFallbackResponse();
}

/**
 * Generates a chatbot response using the knowledge base context.
 * @param question The user's question.
 * @param context The relevant context from the knowledge base.
 * @returns The chatbot's response.
 */
export async function generateChatbotResponse(question: string, context: string = ""): Promise<string> {
    if (!isAIAvailable()) {
        console.warn("AI service not available, using fallback response");
        return getContextualFallbackResponse(question, context);
    }

    const prompt = context 
        ? `You are a helpful study assistant. Use the following context to answer the user's question. If the context doesn't contain enough information to answer the question, say so politely and provide general guidance.

Context:
${context}

Question: ${question}`
        : `You are a helpful study assistant. Answer the following question to the best of your ability:

Question: ${question}`;

    try {
        return await generateStructuredResponse(prompt, 0.7, 500);
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        console.warn('Using fallback response due to AI error');
        return getContextualFallbackResponse(question, context);
    }
}

// Export service object for context usage
export const chatbotService = {
    generateChatbotResponse
}; 