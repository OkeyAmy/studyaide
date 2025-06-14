import { supabase } from '@/integrations/supabase/client';
import { ProcessedContent } from './file-processor.service';

export interface ActivityLogData {
  action_type: 'upload' | 'record' | 'generate' | 'process';
  entity_type: 'file' | 'audio' | 'summary' | 'quiz' | 'mindmap' | 'chat';
  entity_id?: string;
  details?: Record<string, any>;
  user_id?: string;
}

export class ActivityLoggerService {
  
  /**
   * Log file upload activity
   */
  async logFileUpload(fileName: string, fileType: string, fileSize: number, processingResult?: ProcessedContent): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('activity_logs').insert({
        action_type: 'upload',
        entity_type: 'file',
        details: {
          fileName,
          fileType,
          fileSize,
          hasTranscription: !!processingResult?.transcription,
          hasPolishedNote: !!processingResult?.polishedNote,
          processingSuccess: !!processingResult,
          timestamp: new Date().toISOString()
        },
        user_id: user?.id
      });
    } catch (error) {
      console.error('Failed to log file upload activity:', error);
    }
  }

  /**
   * Log audio recording activity
   */
  async logAudioRecord(audioType: string, duration?: number, processingResult?: ProcessedContent): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('activity_logs').insert({
        action_type: 'record',
        entity_type: 'audio',
        details: {
          audioType,
          duration,
          hasTranscription: !!processingResult?.transcription,
          hasPolishedNote: !!processingResult?.polishedNote,
          processingSuccess: !!processingResult,
          timestamp: new Date().toISOString()
        },
        user_id: user?.id
      });
    } catch (error) {
      console.error('Failed to log audio record activity:', error);
    }
  }

  /**
   * Log AI generation activity
   */
  async logAIGeneration(
    contentType: 'summary' | 'quiz' | 'mindmap' | 'chat',
    success: boolean,
    inputLength?: number,
    outputLength?: number,
    generationTime?: number
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('activity_logs').insert({
        action_type: 'generate',
        entity_type: contentType,
        details: {
          success,
          inputLength,
          outputLength,
          generationTime,
          timestamp: new Date().toISOString()
        },
        user_id: user?.id
      });
    } catch (error) {
      console.error('Failed to log AI generation activity:', error);
    }
  }

  /**
   * Log file processing activity
   */
  async logFileProcessing(
    fileName: string,
    fileType: string,
    processingType: 'audio' | 'image' | 'video' | 'document' | 'text' | 'pdf' | 'unknown',
    success: boolean,
    errorMessage?: string,
    processingTime?: number
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('activity_logs').insert({
        action_type: 'process',
        entity_type: 'file',
        details: {
          fileName,
          fileType,
          processingType,
          success,
          errorMessage,
          processingTime,
          timestamp: new Date().toISOString()
        },
        user_id: user?.id
      });
    } catch (error) {
      console.error('Failed to log file processing activity:', error);
    }
  }

  /**
   * Log study session creation
   */
  async logStudySessionCreation(sessionData: {
    fileName: string;
    fileType: string;
    hasContent: boolean;
    featuresGenerated: string[];
  }): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create a material record for the study session
      const { data: material, error: materialError } = await supabase
        .from('materials')
        .insert({
          title: sessionData.fileName.replace(/\.[^/.]+$/, ""),
          file_type: this.mapFileType(sessionData.fileType),
          content_summary: 'AI-generated study materials from study session',
          tags: ['study-session', 'ai-generated', ...sessionData.featuresGenerated],
          headings: sessionData.featuresGenerated.map(feature => this.capitalizeFirst(feature)),
          user_id: user?.id
        })
        .select()
        .single();

      if (materialError) {
        console.error('Failed to create material record:', materialError);
        return;
      }

      // Log the session creation activity
      await supabase.from('activity_logs').insert({
        action_type: 'generate',
        entity_type: 'file',
        entity_id: material.id,
        details: {
          ...sessionData,
          materialId: material.id,
          timestamp: new Date().toISOString()
        },
        user_id: user?.id
      });
    } catch (error) {
      console.error('Failed to log study session creation:', error);
    }
  }

  /**
   * Get recent activities for dashboard
   */
  async getRecentActivities(limit: number = 10): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch recent activities:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get recent activities:', error);
      return [];
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<{
    totalUploads: number;
    totalRecordings: number;
    totalGenerations: number;
    recentActivity: number;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { totalUploads: 0, totalRecordings: 0, totalGenerations: 0, recentActivity: 0 };
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('activity_logs')
        .select('action_type, created_at')
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to fetch usage stats:', error);
        return { totalUploads: 0, totalRecordings: 0, totalGenerations: 0, recentActivity: 0 };
      }

      const totalUploads = data.filter(log => log.action_type === 'upload').length;
      const totalRecordings = data.filter(log => log.action_type === 'record').length;
      const totalGenerations = data.filter(log => log.action_type === 'generate').length;
      const recentActivity = data.filter(log => 
        new Date(log.created_at || '') >= sevenDaysAgo
      ).length;

      return { totalUploads, totalRecordings, totalGenerations, recentActivity };
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return { totalUploads: 0, totalRecordings: 0, totalGenerations: 0, recentActivity: 0 };
    }
  }

  /**
   * Utility functions
   */
  private mapFileType(mimeType: string): string {
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('document')) return 'docx';
    return 'other';
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export singleton instance
export const activityLogger = new ActivityLoggerService(); 