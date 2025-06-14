
import { 
    generateContentFromFile, 
    uploadFileToGemini, 
    isAIAvailable 
} from '../ai.service';
import { MaterialDisplay } from '@/types/api';

/**
 * Main AI service for workflow content generation
 * Orchestrates the generation of all AI content for a workflow
 */
export class WorkflowAIService {
    /**
     * Generate all AI content for a workflow's materials
     */
    static async generateWorkflowContent(materials: MaterialDisplay[]): Promise<{
        summary: string;
        quiz: any;
        flashcards: any;
        mindMap: string;
    }> {
        console.log('🚀 Starting AI content generation for workflow materials...');
        
        if (!isAIAvailable()) {
            console.warn('AI not available, using fallback content');
            return this.generateFallbackContent(materials);
        }

        try {
            // Combine all material content for comprehensive analysis
            const combinedContent = await this.prepareMaterialsContent(materials);
            
            // Generate all content types in parallel for efficiency
            const [summary, quiz, flashcards, mindMap] = await Promise.all([
                this.generateWorkflowSummary(combinedContent),
                this.generateWorkflowQuiz(combinedContent),
                this.generateWorkflowFlashcards(combinedContent),
                this.generateWorkflowMindMap(combinedContent)
            ]);

            console.log('✅ Successfully generated all AI content for workflow');
            
            return {
                summary,
                quiz,
                flashcards,
                mindMap
            };
        } catch (error) {
            console.error('❌ Error generating workflow AI content:', error);
            return this.generateFallbackContent(materials);
        }
    }

    /**
     * Prepare and combine content from all materials in the workflow
     */
    private static async prepareMaterialsContent(materials: MaterialDisplay[]): Promise<string> {
        console.log(`📝 Preparing content from ${materials.length} materials...`);
        
        let combinedContent = '';
        
        for (const material of materials) {
            // Add material title and metadata
            combinedContent += `\n\n=== MATERIAL: ${material.title} ===\n`;
            combinedContent += `File Type: ${material.file_type}\n`;
            combinedContent += `Tags: ${material.tags.join(', ')}\n\n`;
            
            // Add existing content if available
            if (material.parsedContent?.summary) {
                combinedContent += `Summary: ${material.parsedContent.summary}\n\n`;
            }
            
            if (material.parsedContent?.polishedNote) {
                combinedContent += `Notes: ${material.parsedContent.polishedNote}\n\n`;
            }
            
            if (material.content_summary) {
                combinedContent += `Content: ${material.content_summary}\n\n`;
            }
        }
        
        console.log(`📊 Combined content length: ${combinedContent.length} characters`);
        return combinedContent;
    }

    /**
     * Generate comprehensive summary for the entire workflow
     */
    private static async generateWorkflowSummary(content: string): Promise<string> {
        const prompt = `### 📋 Workflow Summary Generator

Create a comprehensive summary that synthesizes all the materials in this workflow into a cohesive learning overview.

### Guidelines:
1. **Holistic Approach**: Connect themes and concepts across all materials
2. **Learning Objectives**: Identify key learning goals and outcomes
3. **Knowledge Structure**: Organize information in a logical learning progression
4. **Cross-References**: Highlight connections between different materials
5. **Markdown Format**: Use clean markdown formatting

### Content to Summarize:
${content}

### Required Format:
# Workflow Learning Summary

## Overview
[Brief overview of the workflow's educational scope]

## Key Learning Objectives
- [Objective 1]
- [Objective 2]
- [Continue as needed]

## Major Concepts
### [Concept Category 1]
[Explanation connecting materials]

### [Concept Category 2]
[Explanation connecting materials]

## Learning Progression
[Suggested order and approach for studying these materials]

## Key Takeaways
[Main insights and knowledge gained from this workflow]

Return only the markdown content, no explanations.`;

        try {
            const { generateStructuredResponse } = await import('../ai.service');
            return await generateStructuredResponse(prompt, 0.3);
        } catch (error) {
            console.error('Error generating workflow summary:', error);
            return `# Workflow Summary\n\nThis workflow contains ${content.split('=== MATERIAL:').length - 1} materials for comprehensive study.`;
        }
    }

    /**
     * Generate quiz questions covering all workflow materials
     */
    private static async generateWorkflowQuiz(content: string): Promise<any> {
        const prompt = `### 🎯 Workflow Quiz Generator

Create a comprehensive quiz that tests understanding across all materials in this workflow.

### Guidelines:
1. **Cross-Material Questions**: Include questions that span multiple materials
2. **Varied Difficulty**: Mix of basic recall and complex application questions
3. **Concept Integration**: Test understanding of how concepts connect
4. **JSON Format**: Return valid JSON only

### Content for Quiz:
${content}

### Required JSON Format:
{
  "title": "Workflow Comprehensive Quiz",
  "questions": [
    {
      "question": "Question text that may reference multiple materials?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation referencing relevant materials"
    }
  ]
}

Generate exactly 8 questions. Return ONLY valid JSON.`;

        try {
            const { generateJSONResponse } = await import('../ai.service');
            return await generateJSONResponse(prompt, 0.5);
        } catch (error) {
            console.error('Error generating workflow quiz:', error);
            return {
                title: "Workflow Quiz",
                questions: [{
                    question: "What is the main focus of this workflow?",
                    options: ["Study materials", "Learning objectives", "Knowledge application", "All of the above"],
                    correctAnswer: 3,
                    explanation: "This workflow encompasses comprehensive learning across multiple materials."
                }]
            };
        }
    }

    /**
     * Generate flashcards covering key concepts from all materials
     */
    private static async generateWorkflowFlashcards(content: string): Promise<any> {
        const prompt = `### 🎴 Workflow Flashcards Generator

Create flashcards that cover key concepts across all materials in this workflow.

### Guidelines:
1. **Comprehensive Coverage**: Include concepts from all materials
2. **Interconnected Learning**: Show relationships between materials
3. **Progressive Difficulty**: Mix basic and advanced concepts
4. **JSON Format**: Return valid JSON only

### Content for Flashcards:
${content}

### Required JSON Format:
{
  "title": "Workflow Study Flashcards",
  "cards": [
    {
      "question": "Clear, specific question",
      "answer": "Comprehensive answer",
      "source": "Material reference or workflow topic"
    }
  ]
}

Generate exactly 12 flashcards. Return ONLY valid JSON.`;

        try {
            const { generateJSONResponse } = await import('../ai.service');
            return await generateJSONResponse(prompt, 0.7);
        } catch (error) {
            console.error('Error generating workflow flashcards:', error);
            return {
                title: "Workflow Flashcards",
                cards: [{
                    question: "What are the key learning objectives of this workflow?",
                    answer: "To understand and integrate concepts from multiple study materials.",
                    source: "Workflow Overview"
                }]
            };
        }
    }

    /**
     * Generate mind map connecting all workflow materials
     */
    private static async generateWorkflowMindMap(content: string): Promise<string> {
        const prompt = `### 🧠 Workflow Mind Map Generator

Create a comprehensive mind map that shows the relationships and connections between all materials in this workflow.

### Guidelines:
1. **Central Theme**: Identify the unifying theme of the workflow
2. **Material Connections**: Show how different materials relate to each other
3. **Concept Hierarchy**: Organize from general to specific concepts
4. **Learning Flow**: Suggest logical study progression
5. **Markdown Format**: Use hierarchical markdown structure

### Content for Mind Map:
${content}

### Required Format:
# Workflow Learning Map

## Core Theme
[Central unifying concept]

## Material Connections
### [Material Group 1]
- [Material 1]
  - [Key concepts]
  - [Connections to other materials]
- [Material 2]
  - [Key concepts]
  - [Connections to other materials]

### [Material Group 2]
- [Continue pattern]

## Learning Pathways
### [Pathway 1]
- [Step-by-step learning sequence]

### [Pathway 2]
- [Alternative learning approach]

## Key Relationships
- [How concepts connect across materials]
- [Interdependencies and prerequisites]

Return only the markdown content, no explanations.`;

        try {
            const { generateStructuredResponse } = await import('../ai.service');
            return await generateStructuredResponse(prompt, 0.4);
        } catch (error) {
            console.error('Error generating workflow mind map:', error);
            return `# Workflow Mind Map\n\n## Materials Overview\n- Multiple study materials\n- Integrated learning approach\n- Comprehensive knowledge building`;
        }
    }

    /**
     * Generate fallback content when AI is not available
     */
    private static generateFallbackContent(materials: MaterialDisplay[]): {
        summary: string;
        quiz: any;
        flashcards: any;
        mindMap: string;
    } {
        console.log('📝 Generating fallback content for workflow');
        
        const materialCount = materials.length;
        const materialTitles = materials.map(m => m.title).join(', ');
        
        return {
            summary: `# Workflow Summary\n\nThis workflow contains ${materialCount} materials: ${materialTitles}.\n\n## Learning Approach\n- Review each material systematically\n- Identify key concepts and connections\n- Practice active recall and testing\n- Synthesize knowledge across materials`,
            
            quiz: {
                title: "Workflow Study Quiz",
                questions: [{
                    question: "How many materials are in this workflow?",
                    options: [String(materialCount-1), String(materialCount), String(materialCount+1), "Unknown"],
                    correctAnswer: 1,
                    explanation: `This workflow contains exactly ${materialCount} materials for comprehensive study.`
                }]
            },
            
            flashcards: {
                title: "Workflow Flashcards",
                cards: [{
                    question: "What is the focus of this study workflow?",
                    answer: `Comprehensive learning across ${materialCount} materials covering: ${materialTitles}`,
                    source: "Workflow Overview"
                }]
            },
            
            mindMap: `# Workflow Mind Map\n\n## Study Materials (${materialCount})\n${materials.map(m => `- ${m.title}\n  - File Type: ${m.file_type}\n  - Tags: ${m.tags.join(', ')}`).join('\n')}\n\n## Learning Strategy\n- Sequential study approach\n- Cross-material connections\n- Active recall practice`
        };
    }
}

export default WorkflowAIService;
