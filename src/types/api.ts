
// Database types matching Supabase schema
export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  user_id: string;
  title: string;
  file_type: string;
  file_url?: string;
  file_size?: number;
  status: 'active' | 'archived';
  tags: string[];
  headings: string[];
  content_summary?: string;
  study_time: number;
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: string;
  user_id: string;
  title: string;
  status: 'active' | 'paused' | 'completed';
  time_spent: number;
  features_used: string[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowMaterial {
  id: string;
  workflow_id: string;
  material_id: string;
  added_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id?: string;
  details: Record<string, any>;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  login_streak: number;
  total_study_time: number;
  materials_processed: number;
  last_login: string;
  updated_at: string;
}

// API Response Types (for compatibility)
export interface DashboardResponse {
  loginStreak: number;
  timeSavedHours: number;
  materialsProcessed: number;
  activeWorkflows: number;
}

export interface WorkflowSession {
  id: string;
  title: string;
  materials: string[];
  featuresUsed: Array<"summary" | "mindmap" | "quiz" | "chatbot">;
  timeSpent: number;
  status: "active" | "paused" | "completed";
  createdAt: string;
}

export interface WorkflowResponse {
  totalWorkflows: number;
  activeSessions: number;
  completedWorkflows: number;
  studyHours: number;
  recentWorkflowSessions: WorkflowSession[];
}

export interface MaterialResponse {
  totalItems: number;
  materials: Array<{
    id: string;
    title: string;
    type: "pdf" | "docx" | "audio" | "video" | "other";
    status: "active" | "archived";
    tags: string[];
    headings: string[];
    studyTime: number;
    usedInWorkflow: boolean;
    uploadedAt: string;
  }>;
}
