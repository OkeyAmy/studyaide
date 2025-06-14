
import { 
    generateJSONResponse, 
    isAIAvailable 
} from '../ai.service';
import { MaterialDisplay } from '@/types/api';

export interface WorkflowQuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    materials: string[]; // Which materials this question relates to
}

export interface WorkflowQuiz {
    title: string;
    questions: WorkflowQuizQuestion[];
    totalMaterials: number;
    coverage: string[]; // List of materials covered
}

/**
 * Workflow Quiz Service
 * Specialized service for generating quizzes that span multiple materials
 */
export class WorkflowQuizService {
    /**
     * Generate a comprehensive quiz covering multiple materials
     */
    static async generateQuiz(materials: MaterialDisplay[]): Promise<WorkflowQuiz> {
        console.log(`🎯 Generating workflow quiz for ${materials.length} materials...`);
        
        if (!isAIAvailable()) {
            console.warn('AI not available, using fallback quiz');
            return this.generateFallbackQuiz(materials);
        }

        try {
            const combinedContent = this.prepareMaterialsForQuiz(materials);
            
            const prompt = `### 🎯 Comprehensive Workflow Quiz Generator

Create a quiz that tests understanding across multiple study materials, emphasizing connections and integrated knowledge.

### Guidelines:
1. **Cross-Material Questions**: Include questions that require knowledge from multiple materials
2. **Varied Difficulty**: Mix basic recall, comprehension, and application questions
3. **Knowledge Integration**: Test how concepts from different materials relate
4. **Clear Attribution**: Each question should reference which materials it covers
5. **Comprehensive Coverage**: Ensure all materials are represented

### Materials for Quiz:
${combinedContent}

### Required JSON Format:
{
  "title": "Comprehensive Workflow Quiz",
  "questions": [
    {
      "question": "Question text that may span multiple materials?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation referencing specific materials",
      "materials": ["Material 1 Title", "Material 2 Title"]
    }
  ],
  "totalMaterials": ${materials.length},
  "coverage": [${materials.map(m => `"${m.title}"`).join(', ')}]
}

Generate exactly 10 questions with good coverage of all materials. Return ONLY valid JSON.`;

            const response = await generateJSONResponse(prompt, 0.5);
            console.log('✅ Workflow quiz generated successfully');
            
            // Validate and structure the response
            if (!response || !response.questions || !Array.isArray(response.questions)) {
                console.warn('Invalid quiz response format, using fallback');
                return this.generateFallbackQuiz(materials);
            }
            
            const quiz: WorkflowQuiz = {
                title: response.title || `Comprehensive Quiz - ${materials.length} Materials`,
                questions: response.questions.slice(0, 10).map((q: any) => ({
                    question: q.question || 'Question not available',
                    options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
                    correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
                    explanation: q.explanation || 'Explanation not available',
                    materials: Array.isArray(q.materials) ? q.materials : [materials[0]?.title || 'Unknown']
                })),
                totalMaterials: materials.length,
                coverage: materials.map(m => m.title)
            };
            
            return quiz;
            
        } catch (error) {
            console.error('❌ Error generating workflow quiz:', error);
            return this.generateFallbackQuiz(materials);
        }
    }

    /**
     * Prepare materials content for quiz generation
     */
    private static prepareMaterialsForQuiz(materials: MaterialDisplay[]): string {
        let content = '';
        
        materials.forEach((material, index) => {
            content += `\n=== MATERIAL ${index + 1}: "${material.title}" ===\n`;
            content += `File Type: ${material.file_type}\n`;
            content += `Tags: ${material.tags.join(', ')}\n`;
            
            if (material.parsedContent?.summary) {
                content += `Summary: ${material.parsedContent.summary}\n`;
            }
            
            if (material.content_summary) {
                content += `Content: ${material.content_summary}\n`;
            }
            
            if (material.parsedContent?.polishedNote) {
                content += `Notes: ${material.parsedContent.polishedNote}\n`;
            }
            
            content += '\n';
        });
        
        return content;
    }

    /**
     * Generate fallback quiz when AI is not available
     */
    private static generateFallbackQuiz(materials: MaterialDisplay[]): WorkflowQuiz {
        console.log('📝 Generating fallback quiz for workflow');
        
        const questions: WorkflowQuizQuestion[] = [
            {
                question: `How many materials are included in this workflow?`,
                options: [
                    String(materials.length - 1),
                    String(materials.length),
                    String(materials.length + 1),
                    "Unknown"
                ],
                correctAnswer: 1,
                explanation: `This workflow contains exactly ${materials.length} materials for comprehensive study.`,
                materials: materials.map(m => m.title)
            },
            {
                question: "What is the primary goal of a study workflow?",
                options: [
                    "To collect random files",
                    "To organize related study materials for integrated learning",
                    "To create backup copies",
                    "To share files with others"
                ],
                correctAnswer: 1,
                explanation: "Study workflows are designed to organize related materials and facilitate integrated learning across multiple sources.",
                materials: ["Workflow Concept"]
            },
            {
                question: "Which study technique is most effective for workflow-based learning?",
                options: [
                    "Studying each material in isolation",
                    "Passive reading only",
                    "Making connections between materials and concepts",
                    "Memorizing everything word-for-word"
                ],
                correctAnswer: 2,
                explanation: "The most effective approach is to actively connect concepts and ideas across different materials in the workflow.",
                materials: ["Learning Strategy"]
            }
        ];
        
        return {
            title: `Workflow Study Quiz - ${materials.length} Materials`,
            questions,
            totalMaterials: materials.length,
            coverage: materials.map(m => m.title)
        };
    }
}

export default WorkflowQuizService;
