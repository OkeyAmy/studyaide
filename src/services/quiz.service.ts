import { 
    generateJSONResponse, 
    generateJSONResponseFromFile, 
    uploadFileToGemini, 
    isAIAvailable 
} from './ai.service';

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
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
    
    // Add a default question
    questions.push({
        question: "What's the most effective way to study?",
        options: [
            "Cramming the night before",
            "Passive re-reading",
            "Active recall and spaced repetition",
            "Highlighting text"
        ],
        correctAnswer: 2,
        explanation: "Active testing through quizzes and concept review helps consolidate learning."
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
        
        // Convert file to base64 for inline data
        const fileData = await uploadFileToGemini(file);
        console.log('File processed successfully for quiz');

        // Create file-specific prompt based on file type
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

        const prompt = `### ✅ Quiz Generation Prompt

This is a detailed quiz generation system. You'll notice how organized it is. Use the uploaded file exactly as it is—preserving all structure, tone, and subject matter. Your task is to generate quiz questions **directly and only** from the material provided.

Do **not** paraphrase, assume, or inject outside knowledge. Stay faithful to the source.
Your response must be in **clean JSON format**, ready for direct use in a quiz engine.

### 📋 Guidelines:

1. **Strictly Source-Based**:
   Extract questions *only* from the provided file. Do not make assumptions or add filler content.

2. **No Commentary or Explanation**:
   Output only the quiz JSON. Do not explain your logic, insert notes, or use meta language.

3. **Cultural & Linguistic Nuance**:
   * Respect all dialects, mixed-language sections (e.g., Pidgin, Yoruba, Hausa, Igbo), and informal expressions
   * Retain any cultural references or idiomatic context
   * If content includes code, math, or technical info—retain formatting and syntax as-is

4. **Question Variety**:
   Include a **mix** of:
   * Multiple choice questions (MCQs)
   * True/False
   * Fill-in-the-blank (optional, if relevant)
   * Short answer

5. **JSON Format Only**:
   Structure your response in the format below. No markdown, no headers, no preamble.

### 📤 Uploaded File Analysis:
File: "${file.name}"
Type: ${fileSpecificIntro}

### 📥 Required Response Format:

{
  "title": "Quiz: Neuroscience Fundamentals",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What does Hebbian learning state?",
      "options": [
        "Neurons that fire together wire together",
        "Neurons work independently of each other",
        "Learning only occurs during sleep",
        "All neurons fire at the same rate"
      ],
      "correct": 0,
      "explanation": "Hebbian learning is the principle that synaptic connections strengthen when neurons fire simultaneously."
    },
    {
      "type": "true-false",
      "question": "Neural plasticity only occurs in young brains.",
      "options": ["True", "False"],
      "correct": 1,
      "explanation": "Neural plasticity continues throughout life, allowing for lifelong learning and adaptation."
    }
  ]
}

You must have a deep understanding of the content of the file to generate the quiz questions. and a give a detailed explanation for each question.
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

            // Ensure the result has the correct structure
            if (!response || !response.title || !response.questions || !Array.isArray(response.questions)) {
                console.warn("Invalid quiz response format, using fallback");
                return generateFallbackQuiz(file.name);
            }
            
            // Validate that questions have required properties and map correct to correctAnswer
            const validQuestions = response.questions.filter((q: any) => 
                q.question && q.options && Array.isArray(q.options) && 
                q.options.length >= 2 && (typeof q.correct === 'number' || typeof q.correctAnswer === 'number') &&
                (q.correct >= 0 || q.correctAnswer >= 0) && 
                (q.correct < q.options.length || q.correctAnswer < q.options.length)
            ).map((q: any) => ({
                ...q,
                correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : q.correct,
                // Remove the original correct property if it was mapped
                correct: undefined
            }));
            
            if (validQuestions.length === 0) {
                console.warn("No valid quiz questions generated, using fallback");
                return generateFallbackQuiz(file.name);
            }
            
            const quiz: Quiz = {
                title: response.title || `Quiz - ${file.name}`,
                questions: validQuestions.slice(0, 5) // Ensure max 5 questions
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

    const prompt = `Create a multiple-choice quiz based on the following text. Generate 3-5 questions. Return ONLY valid JSON in this exact format:

{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Text to create quiz from:
${noteText}`;

    try {
        const result = await generateJSONResponse(prompt, 0.2);
        
        // Ensure the result has the correct structure
        if (!result || !result.title || !result.questions || !Array.isArray(result.questions)) {
            console.warn("Invalid quiz response format, using fallback");
            return generateFallbackQuiz('text-content');
        }
        
        // Validate that questions have required properties
        const validQuestions = result.questions.filter((q: any) => 
            q.question && q.options && Array.isArray(q.options) && 
            q.options.length >= 2 && typeof q.correctAnswer === 'number' &&
            q.correctAnswer >= 0 && q.correctAnswer < q.options.length
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