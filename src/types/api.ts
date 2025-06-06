
// API Response Types
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

export interface Material {
  id: string;
  title: string;
  type: "pdf" | "docx" | "audio" | "video" | "other";
  status: "active" | "archived";
  tags: string[];
  headings: string[];
  studyTime: number;
  usedInWorkflow: boolean;
  uploadedAt: string;
}

export interface MaterialResponse {
  totalItems: number;
  materials: Material[];
}
