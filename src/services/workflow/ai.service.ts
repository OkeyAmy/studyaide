
import { supabase } from '@/integrations/supabase/client';
import { Material } from '@/types/api';
import { summaryService } from '../summary.service';
import { quizService } from '../quiz.service';
import { flashcardService } from '../flashcard.service';
import { mindmapService } from '../mindmap.service';
import { toast } from 'sonner';

async function fetchFileAsBlob(fileUrl: string): Promise<Blob | null> {
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        return await response.blob();
    } catch (error) {
        console.error('Error fetching file from URL:', error);
        return null;
    }
}

export async function generateAIContentForMaterial(material: Material): Promise<void> {
    if (!material.file_url) {
        console.warn(`Material "${material.title}" has no file_url, skipping AI generation.`);
        return;
    }

    toast.info(`🤖 Starting AI generation for "${material.title}"...`);

    const blob = await fetchFileAsBlob(material.file_url);
    if (!blob) {
        toast.error(`Failed to download file for "${material.title}".`);
        return;
    }

    // Use a generic name for the file to avoid issues with special characters in title
    const fileName = `material-file.${material.file_type.split('/')[1] || 'tmp'}`;
    const file = new File([blob], fileName, { type: material.file_type });

    try {
        const [summary, quiz, flashcards, mindMap] = await Promise.all([
            summaryService.generateSummaryFromFile(file),
            quizService.generateQuizFromFile(file),
            flashcardService.generateFlashcardsFromFile(file),
            mindmapService.generateMindmapFromFile(file),
        ]);

        const parsedContent = {
            summary,
            quiz,
            flashcards,
            mindMap,
            polishedNote: `Content from ${material.title}` // Placeholder
        };

        const { error } = await supabase
            .from('materials')
            .update({ content_summary: JSON.stringify(parsedContent) })
            .eq('id', material.id);

        if (error) {
            throw error;
        }

        toast.success(`✅ AI content generated for "${material.title}"!`);

    } catch (error) {
        console.error('Error generating or saving AI content:', error);
        toast.error(`Failed to generate AI content for "${material.title}".`);
    }
}

export async function processWorkflowMaterials(materials: Material[]): Promise<void> {
    const generationPromises = materials.map(material => {
        // Check if content already exists to avoid re-generation
        if (!material.content_summary) {
            return generateAIContentForMaterial(material);
        }
        return Promise.resolve();
    });

    await Promise.all(generationPromises);
}

export const workflowAIService = {
    generateAIContentForMaterial,
    processWorkflowMaterials,
};
