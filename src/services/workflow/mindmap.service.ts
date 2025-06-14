
import { 
    generateStructuredResponse, 
    isAIAvailable 
} from '../ai.service';
import { MaterialDisplay } from '@/types/api';

/**
 * Workflow Mind Map Service
 * Specialized service for generating mind maps that show relationships between multiple materials
 */
export class WorkflowMindMapService {
    /**
     * Generate a comprehensive mind map for workflow materials
     */
    static async generateMindMap(materials: MaterialDisplay[]): Promise<string> {
        console.log(`🧠 Generating workflow mind map for ${materials.length} materials...`);
        
        if (!isAIAvailable()) {
            console.warn('AI not available, using fallback mind map');
            return this.generateFallbackMindMap(materials);
        }

        try {
            const combinedContent = this.prepareMaterialsForMindMap(materials);
            
            const prompt = `### 🧠 Comprehensive Workflow Mind Map Generator

Create a mind map that visualizes the relationships and connections between multiple study materials in a workflow.

### Guidelines:
1. **Central Theme**: Identify the overarching theme that unifies all materials
2. **Material Relationships**: Show how different materials relate to and complement each other
3. **Concept Hierarchy**: Organize from general themes to specific concepts
4. **Learning Pathways**: Suggest logical sequences for studying the materials
5. **Cross-References**: Highlight where concepts from different materials intersect
6. **Visual Structure**: Use markdown hierarchy that can be converted to visual mind maps

### Materials for Mind Map:
${combinedContent}

### Required Format:
# Workflow Learning Mind Map

## Central Theme
[The unifying concept or subject that connects all materials]

## Material Clusters
### [Cluster 1: Related Materials Group]
#### [Material 1 Title]
- [Key concepts from this material]
- [How it connects to other materials]
- [Prerequisites or follow-ups]

#### [Material 2 Title]
- [Key concepts from this material]
- [How it connects to other materials]
- [Prerequisites or follow-ups]

### [Cluster 2: Related Materials Group]
[Continue pattern for all materials]

## Knowledge Connections
### [Cross-Material Concept 1]
- [How this concept appears across materials]
- [Materials where this is covered: Material A, Material B]

### [Cross-Material Concept 2]
- [How this concept appears across materials]
- [Materials where this is covered: Material C, Material D]

## Learning Pathways
### Sequential Path
1. [Start with Material X because...]
2. [Then Material Y to build upon...]
3. [Follow with Material Z to complete...]

### Thematic Path
1. [Group materials by theme]
2. [Study related concepts together]
3. [Synthesize across themes]

## Key Relationships
- [Material A] → [Material B]: [Relationship description]
- [Material B] ↔ [Material C]: [Bidirectional relationship]
- [Multiple Materials] → [Concept]: [How materials contribute to understanding]

Return only the markdown mind map structure, no explanations.`;

            const mindMap = await generateStructuredResponse(prompt, 0.4);
            console.log('✅ Workflow mind map generated successfully');
            return mindMap;
            
        } catch (error) {
            console.error('❌ Error generating workflow mind map:', error);
            return this.generateFallbackMindMap(materials);
        }
    }

    /**
     * Prepare materials content for mind map generation
     */
    private static prepareMaterialsForMindMap(materials: MaterialDisplay[]): string {
        let content = '';
        
        materials.forEach((material, index) => {
            content += `\n=== MATERIAL ${index + 1}: "${material.title}" ===\n`;
            content += `File Type: ${material.file_type}\n`;
            content += `Tags: ${material.tags.join(', ')}\n`;
            content += `Study Time: ${material.studyTime} minutes\n`;
            
            if (material.parsedContent?.summary) {
                content += `Summary: ${material.parsedContent.summary}\n`;
            }
            
            if (material.content_summary) {
                content += `Content: ${material.content_summary}\n`;
            }
            
            if (material.headings && material.headings.length > 0) {
                content += `Headings: ${material.headings.join(', ')}\n`;
            }
            
            content += '\n';
        });
        
        return content;
    }

    /**
     * Generate fallback mind map when AI is not available
     */
    private static generateFallbackMindMap(materials: MaterialDisplay[]): string {
        console.log('📝 Generating fallback mind map for workflow');
        
        const materialCount = materials.length;
        let mindMap = `# Workflow Learning Mind Map\n\n`;
        
        mindMap += `## Central Theme\nComprehensive Study Workflow with ${materialCount} Materials\n\n`;
        
        mindMap += `## Material Overview\n`;
        materials.forEach((material, index) => {
            mindMap += `### ${index + 1}. ${material.title}\n`;
            mindMap += `- **Type**: ${material.file_type}\n`;
            mindMap += `- **Tags**: ${material.tags.join(', ')}\n`;
            mindMap += `- **Study Time**: ${material.studyTime} minutes\n`;
            if (material.parsedContent?.summary) {
                mindMap += `- **Focus**: ${material.parsedContent.summary.substring(0, 100)}...\n`;
            }
            mindMap += '\n';
        });
        
        mindMap += `## Learning Connections\n`;
        mindMap += `### Sequential Learning\n`;
        mindMap += `1. Start with foundational materials\n`;
        mindMap += `2. Progress to intermediate concepts\n`;
        mindMap += `3. Integrate advanced topics\n`;
        mindMap += `4. Synthesize all materials\n\n`;
        
        mindMap += `### Key Study Areas\n`;
        const allTags = [...new Set(materials.flatMap(m => m.tags))];
        allTags.forEach(tag => {
            const materialsWithTag = materials.filter(m => m.tags.includes(tag));
            mindMap += `#### ${tag}\n`;
            mindMap += `- Materials: ${materialsWithTag.map(m => m.title).join(', ')}\n`;
        });
        
        mindMap += `\n## Study Strategy\n`;
        mindMap += `- **Active Reading**: Engage with each material actively\n`;
        mindMap += `- **Connection Making**: Link concepts across materials\n`;
        mindMap += `- **Regular Review**: Revisit materials to strengthen understanding\n`;
        mindMap += `- **Practice Application**: Test knowledge through exercises and examples\n`;
        
        return mindMap;
    }
}

export default WorkflowMindMapService;
