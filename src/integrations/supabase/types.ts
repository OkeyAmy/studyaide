export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          content_summary: string | null
          created_at: string | null
          file_size: number | null
          file_type: string
          file_url: string | null
          headings: string[] | null
          id: string
          status: string | null
          study_session_id: string | null
          study_time: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content_summary?: string | null
          created_at?: string | null
          file_size?: number | null
          file_type: string
          file_url?: string | null
          headings?: string[] | null
          id?: string
          status?: string | null
          study_session_id?: string | null
          study_time?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content_summary?: string | null
          created_at?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string | null
          headings?: string[] | null
          id?: string
          status?: string | null
          study_session_id?: string | null
          study_time?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          ai_flashcards: Json | null
          ai_mindmap: string | null
          ai_quiz: Json | null
          ai_summary: string | null
          created_at: string | null
          error_message: string | null
          features_generated: string[] | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string | null
          id: string
          polished_note: string | null
          processing_completed_at: string | null
          processing_started_at: string | null
          processing_time_ms: number | null
          raw_transcription: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_flashcards?: Json | null
          ai_mindmap?: string | null
          ai_quiz?: Json | null
          ai_summary?: string | null
          created_at?: string | null
          error_message?: string | null
          features_generated?: string[] | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url?: string | null
          id?: string
          polished_note?: string | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          processing_time_ms?: number | null
          raw_transcription?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_flashcards?: Json | null
          ai_mindmap?: string | null
          ai_quiz?: Json | null
          ai_summary?: string | null
          created_at?: string | null
          error_message?: string | null
          features_generated?: string[] | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string | null
          id?: string
          polished_note?: string | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          processing_time_ms?: number | null
          raw_transcription?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          id: string
          last_login: string | null
          login_streak: number | null
          materials_processed: number | null
          total_study_time: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          last_login?: string | null
          login_streak?: number | null
          materials_processed?: number | null
          total_study_time?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          last_login?: string | null
          login_streak?: number | null
          materials_processed?: number | null
          total_study_time?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workflow_materials: {
        Row: {
          added_at: string | null
          id: string
          material_id: string
          workflow_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          material_id: string
          workflow_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          material_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_materials_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_materials_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string | null
          features_used: string[] | null
          id: string
          materials_data: Json | null
          status: string | null
          time_spent: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          features_used?: string[] | null
          id?: string
          materials_data?: Json | null
          status?: string | null
          time_spent?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          features_used?: string[] | null
          id?: string
          materials_data?: Json | null
          status?: string | null
          time_spent?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_study_sessions_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      insert_study_session: {
        Args: {
          user_id: string
          file_name: string
          file_type: string
          file_size?: number
          file_url?: string
          raw_transcription?: string
          polished_note?: string
          ai_summary?: string
          ai_quiz?: Json
          ai_mindmap?: string
          ai_flashcards?: Json
          processing_time_ms?: number
          features_generated?: string[]
          status?: string
          processing_completed_at?: string
        }
        Returns: string
      }
      log_activity: {
        Args: {
          action_type: string
          entity_type: string
          entity_id?: string
          details?: Json
        }
        Returns: undefined
      }
      update_user_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
