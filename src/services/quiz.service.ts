
import { 
    generateJSONResponse, 
    generateJSONResponseFromFile, 
    uploadFileToGemini, 
    isAIAvailable 
} from './ai.service';

export interface QuizQuestion {
    question: string;
    answer?: string; // Made optional for compatibility with multiple-choice question types used elsewhere.
    explanation: string;
    options?: string[];
    correctAnswer?: string | number;
}

export interface Quiz {
    title: string;
    questions: QuizQuestion[];
}

/**
 * Generate a fallback quiz when the AI generation fails
 */
function generateFallbackQuiz(identifier: string): Quiz {
    console.log('Generating fallback quiz for:', identifier);
    
    const title = `Quiz: ${identifier}`;
    const questions: QuizQuestion[] = [];
    
    questions.push({
        question: "What are the two core principles of effective learning discussed in many study guides?",
        answer: "Active recall and spaced repetition.",
        explanation: "Active recall involves actively retrieving information from memory, while spaced repetition involves reviewing information at increasing intervals. Both are proven to enhance long-term retention."
    });
    
    return { title, questions };
}

/**
 * Generate quiz from uploaded file content using Gemini API
 */
export async function generateQuizFromFile(
    file: File,
    regenerate: boolean = false
): Promise<Quiz> {
    console.log(`${regenerate ? 'Regenerating' : 'Generating'} quiz from file:`, file.name);
    
    try {
        if (!isAIAvailable()) {
            console.warn('AI not available, using fallback quiz');
            return generateFallbackQuiz(file.name);
        }

        console.log('Processing file for quiz generation...');
        
        const fileData = await uploadFileToGemini(file);
        console.log('File processed successfully for quiz');

        let fileSpecificIntro = "";
        const fileType = file.type.toLowerCase();
        
        if (fileType.includes('word') || fileType.includes('document')) {
            fileSpecificIntro = `You are analyzing content from a document "${file.name}".
Create quiz questions that test understanding of the key concepts, definitions, and important information from this document.`;
        } else if (fileType.includes('pdf')) {
            fileSpecificIntro = `You are analyzing content from a PDF document "${file.name}".
Create quiz questions that test comprehension of the main ideas, facts, and educational content from this document.`;
        } else if (fileType.includes('image')) {
            fileSpecificIntro = `You are analyzing content extracted from an image "${file.name}".
Create quiz questions that test understanding of any educational content, diagrams, or text visible in the image.`;
        } else {
            fileSpecificIntro = `You are analyzing content from the file "${file.name}".
Create quiz questions that test understanding of the key concepts and information from this material.`;
        }

        const prompt = `### ✍️ Open-Ended Quiz Generation Prompt

Your task is to create a set of open-ended quiz questions based on the provided document. These questions should test understanding and require a written answer, not multiple-choice selection.

### 📋 Guidelines:

1.  **Source Fidelity**: Base all questions and answers **strictly** on the content of the uploaded file. Do not introduce external knowledge.
2.  **Question Style**: Formulate clear, specific questions that prompt a concise, factual answer from the user. Avoid ambiguity.
3.  **Answer & Explanation**:
    *   Provide a correct, succinct \`answer\`.
    *   Write a helpful \`explanation\` that clarifies why the answer is correct, providing context from the source material.
4.  **No Commentary**: Your output must be **only** the clean JSON. Do not add any introductory text, markdown formatting, or notes.
5.  **Content Nuance**: Preserve any cultural, linguistic, or technical nuances from the source document in your questions and answers.

### 📤 Uploaded File Analysis:
File: "${file.name}"
Type: ${fileSpecificIntro}

### 📥 Required Response Format:

{
  "title": "Quiz: Key Concepts from ${file.name}",
  "questions": [
    {
      "question": "What is the primary function of the mitochondria?",
      "answer": "The primary function of mitochondria is to generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
      "explanation": "Mitochondria are often referred to as the 'powerhouses' of the cell because they are responsible for cellular respiration and energy production in the form of ATP."
    },
    {
      "question": "Who wrote the play 'Hamlet'?",
      "answer": "William Shakespeare",
      "explanation": "William Shakespeare, an English playwright, poet, and actor, is widely regarded as the greatest writer in the English language and the world's pre-eminent dramatist. 'Hamlet' is one of his most famous tragedies."
    }
  ]
}

Generate exactly 5 quiz questions based on the document content. Return ONLY valid JSON.`;

        console.log('Generating quiz from file content...');
        
        console.log(`\n====================== SENDING QUIZ PROMPT TO AI ======================`);
        console.log(prompt);
        console.log(`================================================================\n`);
        
        try {
            const response = await generateJSONResponseFromFile(
                fileData.base64Data,
                fileData.mimeType,
                prompt,
                0.5
            );

            console.log(`\n====================== RAW AI QUIZ RESPONSE ======================`);
            console.log(JSON.stringify(response, null, 2));
            console.log(`================================================================\n`);
            
            console.log('Quiz generated successfully from file');

            if (!response || !response.title || !response.questions || !Array.isArray(response.questions)) {
                console.warn("Invalid quiz response format, using fallback");
                return generateFallbackQuiz(file.name);
            }
            
            const validQuestions = response.questions.filter((q: any) => 
                q.question && typeof q.question === 'string' &&
                q.answer && typeof q.answer === 'string' &&
                q.explanation && typeof q.explanation === 'string'
            ).map((q: any) => ({
                question: q.question,
                answer: q.answer,
                explanation: q.explanation,
            }));
            
            if (validQuestions.length === 0) {
                console.warn("No valid quiz questions generated, using fallback");
                return generateFallbackQuiz(file.name);
            }
            
            const quiz: Quiz = {
                title: response.title || `Quiz - ${file.name}`,
                questions: validQuestions.slice(0, 5)
            };

            console.log(`Successfully generated ${quiz.questions.length} quiz questions`);
            return quiz;
        } catch (error) {
            console.error('Error with JSON parsing in quiz generation:', error);
            return generateFallbackQuiz(file.name);
        }

    } catch (error) {
        console.error('Error generating quiz from file:', error);
        console.warn('Falling back to default quiz due to error');
        return generateFallbackQuiz(file.name);
    }
}

/**
 * Generates a quiz from the note's text.
 * @param noteText The polished text of the note.
 * @returns A Quiz object.
 * @deprecated Use generateQuizFromFile for better results
 */
export async function generateQuiz(noteText: string): Promise<Quiz> {
    if (!isAIAvailable()) {
        console.warn("AI service not available, generating fallback quiz");
        return generateFallbackQuiz('text-content');
    }

    const prompt = `Create an open-ended quiz based on the following text. Generate 3-5 questions. Each question should have a correct answer and an explanation. Return ONLY valid JSON in this exact format:

{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text?",
      "answer": "Correct answer text.",
      "explanation": "Why this answer is correct."
    }
  ]
}

Text to create quiz from:
${noteText}`;

    try {
        const result = await generateJSONResponse(prompt, 0.2);
        
        if (!result || !result.title || !result.questions || !Array.isArray(result.questions)) {
            console.warn("Invalid quiz response format, using fallback");
            return generateFallbackQuiz('text-content');
        }
        
        const validQuestions = result.questions.filter((q: any) => 
            q.question && typeof q.question === 'string' &&
            q.answer && typeof q.answer === 'string' &&
            q.explanation && typeof q.explanation === 'string'
        );
        
        if (validQuestions.length === 0) {
            console.warn("No valid quiz questions generated, using fallback");
            return generateFallbackQuiz('text-content');
        }
        
        return {
            title: result.title,
            questions: validQuestions
        };
    } catch (error) {
        console.error('Error generating quiz:', error);
        return generateFallbackQuiz('text-content');
    }
}

/**
 * Generate a new quiz from file
 */
export async function regenerateQuizFromFile(file: File): Promise<Quiz> {
    return generateQuizFromFile(file, true);
}

/**
 * Regenerate quiz from text
 * @deprecated Use regenerateQuizFromFile for better results
 */
export async function regenerateQuiz(noteText: string): Promise<Quiz> {
    return generateQuiz(noteText);
}

// Export service object for context usage
export const quizService = {
    generateQuiz,
    regenerateQuiz,
    generateQuizFromFile,
    regenerateQuizFromFile
};
