
import { 
    generateStructuredResponse, 
    isAIAvailable 
} from '../ai.service';
import { MaterialDisplay } from '@/types/api';

/**
 * Workflow Summary Service
 * Specialized service for generating comprehensive summaries that span multiple materials
 */
export class WorkflowSummaryService {
    /**
     * Generate a workflow summary from multiple materials
     */
    static async generateSummary(materials: MaterialDisplay[]): Promise<string> {
        console.log(`📋 Generating workflow summary for ${materials.length} materials...`);
        
        if (!isAIAvailable()) {
            console.warn('AI not available, using fallback summary');
            return this.generateFallbackSummary(materials);
        }

        try {
            const combinedContent = this.prepareMaterialsForSummary(materials);
            
            const prompt = `### 📋 Workflow Summary Generator

You are creating a comprehensive summary that synthesizes multiple study materials into a cohesive learning overview.

### Guidelines:
1. **Synthesis Over Repetition**: Don't just list each material separately - find common themes and connections
2. **Learning Journey**: Structure the summary as a logical learning progression
3. **Cross-References**: Highlight how different materials complement each other
4. **Actionable Insights**: Include study recommendations and key takeaways
5. **Clear Structure**: Use markdown headers and formatting for easy navigation

### Materials to Synthesize:
${combinedContent}

### Required Format:
# Comprehensive Workflow Summary

## Learning Overview
[Brief description of what this workflow covers and its educational goals]

## Core Concepts and Themes
### [Major Theme 1]
[Synthesized explanation drawing from relevant materials]

### [Major Theme 2] 
[Synthesized explanation drawing from relevant materials]

## Knowledge Integration
[How the materials work together to build comprehensive understanding]

## Study Recommendations
- [Suggested approach for working through these materials]
- [Tips for connecting concepts across materials]
- [Key areas to focus on]

## Key Takeaways
[Most important insights and knowledge gained from this collection]

Return only the markdown summary, no explanations or meta-commentary.`;

            const summary = await generateStructuredResponse(prompt, 0.3);
            console.log('✅ Workflow summary generated successfully');
            return summary;
            
        } catch (error) {
            console.error('❌ Error generating workflow summary:', error);
            return this.generateFallbackSummary(materials);
        }
    }

    /**
     * Prepare materials content for summary generation
     */
    private static prepareMaterialsForSummary(materials: MaterialDisplay[]): string {
        let content = '';
        
        materials.forEach((material, index) => {
            content += `\n--- MATERIAL ${index + 1}: ${material.title} ---\n`;
            content += `Type: ${material.file_type}\n`;
            content += `Tags: ${material.tags.join(', ')}\n`;
            
            if (material.parsedContent?.summary) {
                content += `Summary: ${material.parsedContent.summary}\n`;
            }
            
            if (material.content_summary) {
                content += `Content: ${material.content_summary}\n`;
            }
            
            content += '\n';
        });
        
        return content;
    }

    /**
     * Generate fallback summary when AI is not available
     */
    private static generateFallbackSummary(materials: MaterialDisplay[]): string {
        const materialCount = materials.length;
        const materialsList = materials.map((m, i) => `${i + 1}. **${m.title}** (${m.file_type})`).join('\n');
        
        return `# Workflow Summary

## Overview
This workflow contains ${materialCount} study materials designed for comprehensive learning.

## Materials Included
${materialsList}

## Study Approach
- Review each material systematically
- Identify key concepts and themes
- Look for connections between materials
- Practice active recall and self-testing
- Synthesize knowledge across all materials

## Learning Objectives
- Understand core concepts from each material
- Recognize relationships between different topics
- Build comprehensive knowledge through integration
- Develop mastery through practice and review

## Next Steps
1. Begin with the first material and work through sequentially
2. Take notes on key concepts and insights
3. Create connections between materials as you progress
4. Review and test your understanding regularly`;
    }
}

export default WorkflowSummaryService;
