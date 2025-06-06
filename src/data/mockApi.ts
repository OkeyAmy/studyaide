
import { DashboardResponse, WorkflowResponse, MaterialResponse } from '@/types/api';

// Mock API responses
export const mockDashboardData: DashboardResponse = {
  loginStreak: 7,
  timeSavedHours: 35.2,
  materialsProcessed: 22,
  activeWorkflows: 2
};

export const mockWorkflowData: WorkflowResponse = {
  totalWorkflows: 8,
  activeSessions: 3,
  completedWorkflows: 4,
  studyHours: 12.5,
  recentWorkflowSessions: [
    {
      id: "session_001",
      title: "Quantum Physics Overview",
      materials: ["mat_101", "mat_203"],
      featuresUsed: ["summary", "mindmap", "quiz", "chatbot"],
      timeSpent: 2.5,
      status: "active",
      createdAt: "2025-06-04T10:00:00Z"
    },
    {
      id: "session_002",
      title: "Machine Learning Fundamentals",
      materials: ["mat_101", "mat_204", "mat_205"],
      featuresUsed: ["summary", "quiz", "chatbot"],
      timeSpent: 4.2,
      status: "active",
      createdAt: "2025-06-03T14:30:00Z"
    },
    {
      id: "session_003",
      title: "Data Structures and Algorithms",
      materials: ["mat_206"],
      featuresUsed: ["summary", "mindmap"],
      timeSpent: 1.8,
      status: "paused",
      createdAt: "2025-06-02T16:15:00Z"
    }
  ]
};

export const mockMaterialData: MaterialResponse = {
  totalItems: 10,
  materials: [
    {
      id: "mat_101",
      title: "Intro to Machine Learning",
      type: "pdf",
      status: "active",
      tags: ["AI", "Supervised Learning"],
      headings: ["Overview", "Algorithms", "Case Studies"],
      studyTime: 1.75,
      usedInWorkflow: true,
      uploadedAt: "2025-06-03T09:45:00Z"
    },
    {
      id: "mat_203",
      title: "Quantum Mechanics Lecture",
      type: "audio",
      status: "active",
      tags: ["Physics", "Quantum"],
      headings: ["Wave Functions", "Uncertainty Principle", "Schrödinger Equation"],
      studyTime: 3.2,
      usedInWorkflow: true,
      uploadedAt: "2025-06-02T11:20:00Z"
    },
    {
      id: "mat_204",
      title: "Neural Networks Deep Dive",
      type: "video",
      status: "active",
      tags: ["AI", "Deep Learning", "Neural Networks"],
      headings: ["Perceptrons", "Backpropagation", "CNN", "RNN"],
      studyTime: 2.8,
      usedInWorkflow: true,
      uploadedAt: "2025-06-01T08:15:00Z"
    },
    {
      id: "mat_205",
      title: "Python for Data Science",
      type: "docx",
      status: "active",
      tags: ["Python", "Data Science", "Programming"],
      headings: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
      studyTime: 0.9,
      usedInWorkflow: false,
      uploadedAt: "2025-05-30T13:45:00Z"
    },
    {
      id: "mat_206",
      title: "Algorithm Analysis Notes",
      type: "pdf",
      status: "active",
      tags: ["Algorithms", "Computer Science"],
      headings: ["Big O Notation", "Sorting", "Graph Algorithms"],
      studyTime: 1.5,
      usedInWorkflow: true,
      uploadedAt: "2025-05-29T10:30:00Z"
    }
  ]
};
