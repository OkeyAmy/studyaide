import { supabase } from '@/integrations/supabase/client';
import { ProcessedContent } from './file-processor.service';
import { TablesInsert } from '@/integrations/supabase/types';

class MaterialService {
  async createMaterialFromProcessedContent(
    processedContent: ProcessedContent,
    userId: string,
    fileUrl?: string
  ): Promise<string> {
    const { fileMetadata, summary, polishedNote } = processedContent;

    const newMaterial: TablesInsert<'materials'> = {
      user_id: userId,
      title: fileMetadata.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      file_type: this.mapFileType(fileMetadata.type),
      file_size: fileMetadata.size,
      content_summary: summary || 'AI-generated study materials',
      headings: this.extractHeadings(polishedNote),
      status: 'active', // Changed from 'processed' to 'active'
      file_url: fileUrl,
      tags: ['ai-generated', 'study-material'],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('materials')
      .insert(newMaterial)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating material:', error);
      throw new Error(`Failed to create material: ${error.message}`);
    }

    return data.id;
  }

  private extractHeadings(text: string): string[] {
    // Extract headings from markdown-style headers or structured text
    const headings = text.match(/^#+\s*(.*)/gm) || text.match(/^[A-Z][^.!?]*:/gm) || [];
    return headings ? headings.map(h => h.replace(/^#+\s*/, '').replace(/:$/, '')) : ['Main Content'];
  }

  private mapFileType(mimeType: string): string {
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('document') || mimeType.includes('wordprocessingml')) return 'docx';
    if (mimeType.startsWith('text/')) return 'text';
    return 'document';
  }
}

export const materialService = new MaterialService();
