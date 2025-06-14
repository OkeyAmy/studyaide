
import { 
    generateJSONResponse, 
    isAIAvailable 
} from '../ai.service';
import { MaterialDisplay } from '@/types/api';

export interface WorkflowFlashcard {
    question: string;
    answer: string;
    source: string;
    materials: string[]; // Which materials this card relates to
    difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface WorkflowFlashcardSet {
    title: string;
    cards: WorkflowFlashcard[];
    totalMaterials: number;
    coverage: string[]; // List of materials covered
}

/**
 * Workflow Flashcards Service
 * Specialized service for generating flashcards that span multiple materials
 */
export class WorkflowFlashcardsService {
    /**
     * Generate comprehensive flashcards covering multiple materials
     */
    static async generateFlashcards(materials: MaterialDisplay[]): Promise<WorkflowFlashcardSet> {
        console.log(`🎴 Generating workflow flashcards for ${materials.length} materials...`);
        
        if (!isAIAvailable()) {
            console.warn('AI not available, using fallback flashcards');
            return this.generateFallbackFlashcards(materials);
        }

        try {
            const combinedContent = this.prepareMaterialsForFlashcards(materials);
            
            const prompt = `### 🎴 Comprehensive Workflow Flashcards Generator

Create flashcards that cover key concepts across multiple study materials, emphasizing both individual material knowledge and cross-material connections.

### Guidelines:
1. **Comprehensive Coverage**: Include important concepts from each material
2. **Cross-Material Connections**: Create cards that link concepts between materials
3. **Varied Difficulty**: Mix basic definitions, intermediate concepts, and advanced applications
4. **Clear Attribution**: Specify which materials each card relates to
5. **Active Recall Focus**: Design questions that promote active learning

### Materials for Flashcards:
${combinedContent}

### Required JSON Format:
{
  "title": "Comprehensive Workflow Flashcards",
  "cards": [
    {
      "question": "Clear, specific question or term to define",
      "answer": "Comprehensive answer with context",
      "source": "Primary topic or concept area",
      "materials": ["Material 1 Title", "Material 2 Title"],
      "difficulty": "basic"
    }
  ],
  "totalMaterials": ${materials.length},
  "coverage": [${materials.map(m => `"${m.title}"`).join(', ')}]
}

Generate exactly 15 flashcards with good coverage of all materials and varied difficulty levels. Return ONLY valid JSON.`;

            const response = await generateJSONResponse(prompt, 0.7);
            console.log('✅ Workflow flashcards generated successfully');
            
            // Validate and structure the response
            if (!response || !response.cards || !Array.isArray(response.cards)) {
                console.warn('Invalid flashcards response format, using fallback');
                return this.generateFallbackFlashcards(materials);
            }
            
            const flashcardSet: WorkflowFlashcardSet = {
                title: response.title || `Comprehensive Flashcards - ${materials.length} Materials`,
                cards: response.cards.slice(0, 15).map((card: any) => ({
                    question: card.question || 'Question not available',
                    answer: card.answer || 'Answer not available',
                    source: card.source || 'Unknown Source',
                    materials: Array.isArray(card.materials) ? card.materials : [materials[0]?.title || 'Unknown'],
                    difficulty: ['basic', 'intermediate', 'advanced'].includes(card.difficulty) ? card.difficulty : 'intermediate'
                })),
                totalMaterials: materials.length,
                coverage: materials.map(m => m.title)
            };
            
            return flashcardSet;
            
        } catch (error) {
            console.error('❌ Error generating workflow flashcards:', error);
            return this.generateFallbackFlashcards(materials);
        }
    }

    /**
     * Prepare materials content for flashcard generation
     */
    private static prepareMaterialsForFlashcards(materials: MaterialDisplay[]): string {
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
     * Generate fallback flashcards when AI is not available
     */
    private static generateFallbackFlashcards(materials: MaterialDisplay[]): WorkflowFlashcardSet {
        console.log('📝 Generating fallback flashcards for workflow');
        
        const cards: WorkflowFlashcard[] = [
            {
                question: "What is the purpose of organizing materials into a workflow?",
                answer: "To create a structured learning path that connects related materials and facilitates comprehensive understanding of a topic or subject area.",
                source: "Workflow Organization",
                materials: ["Learning Strategy"],
                difficulty: 'basic'
            },
            {
                question: "How many materials are included in this workflow?",
                answer: `This workflow contains ${materials.length} materials: ${materials.map(m => m.title).join(', ')}.`,
                source: "Workflow Composition",
                materials: materials.map(m => m.title),
                difficulty: 'basic'
            },
            {
                question: "What is active recall and why is it important for studying workflows?",
                answer: "Active recall is the practice of actively retrieving information from memory rather than passive review. It's crucial for workflows because it helps connect concepts across multiple materials and strengthens long-term retention.",
                source: "Learning Techniques",
                materials: ["Study Methods"],
                difficulty: 'intermediate'
            }
        ];
        
        // Add material-specific cards
        materials.forEach((material, index) => {
            if (index < 5) { // Limit to avoid too many fallback cards
                cards.push({
                    question: `What is the main focus of "${material.title}"?`,
                    answer: `${material.title} is a ${material.file_type} file covering topics related to: ${material.tags.join(', ')}. ${material.parsedContent?.summary || material.content_summary || 'Study this material to understand its key concepts.'}`,
                    source: material.title,
                    materials: [material.title],
                    difficulty: 'basic'
                });
            }
        });
        
        return {
            title: `Workflow Flashcards - ${materials.length} Materials`,
            cards,
            totalMaterials: materials.length,
            coverage: materials.map(m => m.title)
        };
    }
}

export default WorkflowFlashcardsService;
