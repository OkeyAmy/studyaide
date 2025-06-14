import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateStructuredResponse, isAIAvailable } from './ai.service';

// We still need the GoogleGenAI client specifically for audio transcription
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const googleGenAI = geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here' 
    ? new GoogleGenerativeAI(geminiApiKey) 
    : null;

/**
 * Transcribes audio using the native GoogleGenAI SDK because it supports multimodal input (audio).
 * The OpenAI compatibility endpoint does not support this.
 * @param base64Audio The base64-encoded audio data.
 * @param mimeType The MIME type of the audio.
 * @returns The raw transcription text.
 */
export async function transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
    if (!googleGenAI) {
        throw new Error("AI service not configured. Please set VITE_GEMINI_API_KEY in your environment.");
    }

    const model = googleGenAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent([
        {
            inlineData: {
                data: base64Audio,
                mimeType: mimeType,
            },
        },
        "Please transcribe this audio accurately. Return only the transcribed text without any additional commentary."
    ]);

    const response = await result.response;
    return response.text() || "Unable to transcribe audio.";
}

/**
 * Polishes raw transcription text into well-formatted notes.
 * @param rawText The raw transcribed text.
 * @returns Polished, well-formatted text.
 */
export async function polishText(rawText: string): Promise<string> {
    if (!isAIAvailable()) {
        throw new Error("AI service not configured. Please set VITE_GEMINI_API_KEY in your environment.");
    }

    const prompt = `Polish the following transcribed text into well-formatted notes. Fix grammar, punctuation, and structure while preserving the original meaning and content. Make it clear and readable:

${rawText}`;

    try {
        return await generateStructuredResponse(prompt, 0.3, 800);
    } catch (error) {
        console.error('Error polishing text:', error);
        return "Unable to polish text.";
    }
}

// Export service object for context usage
export const noteService = {
    transcribeAudio,
    polishText
}; 