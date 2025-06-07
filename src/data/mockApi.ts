import { DashboardResponse, WorkflowResponse, MaterialResponse, MaterialDisplay } from '@/types/api';

const mockMaterials: MaterialDisplay[] = [
  {
    id: '1',
    user_id: 'user-1',
    title: 'Introduction to Neural Networks',
    file_type: 'pdf',
    type: 'pdf',
    file_size: 2048000,
    status: 'active' as const,
    tags: ['AI', 'Machine Learning', 'Deep Learning'],
    headings: ['Introduction', 'Basic Concepts', 'Applications'],
    content_summary: 'Comprehensive guide to neural networks and their applications in modern AI.',
    study_time: 3.5,
    studyTime: 3.5,
    usedInWorkflow: true,
    uploadedAt: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    user_id: 'user-1',
    title: 'Lecture Recording - Week 3',
    file_type: 'audio',
    type: 'audio',
    file_size: 15728640,
    status: 'active' as const,
    tags: ['Lecture', 'Computer Science', 'Algorithms'],
    headings: ['Sorting Algorithms', 'Time Complexity', 'Space Complexity'],
    content_summary: 'Weekly lecture covering fundamental sorting algorithms and complexity analysis.',
    study_time: 2.0,
    studyTime: 2.0,
    usedInWorkflow: true,
    uploadedAt: '2024-01-12T14:30:00Z',
    created_at: '2024-01-12T14:30:00Z',
    updated_at: '2024-01-12T14:30:00Z'
  },
  {
    id: '3',
    user_id: 'user-1',
    title: 'Python Programming Tutorial',
    file_type: 'video',
    type: 'video',
    file_size: 524288000,
    status: 'active' as const,
    tags: ['Python', 'Programming', 'Tutorial'],
    headings: ['Variables', 'Functions', 'Classes', 'Error Handling'],
    content_summary: 'Complete Python programming tutorial for beginners.',
    study_time: 4.0,
    studyTime: 4.0,
    usedInWorkflow: true,
    uploadedAt: '2024-01-10T09:15:00Z',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-10T09:15:00Z'
  },
  {
    id: '4',
    user_id: 'user-1',
    title: 'Research Paper Notes',
    file_type: 'docx',
    type: 'docx',
    file_size: 1024000,
    status: 'active' as const,
    tags: ['Research', 'Academic', 'Notes'],
    headings: ['Abstract', 'Methodology', 'Results', 'Conclusion'],
    content_summary: 'Personal notes and annotations from recent research papers.',
    study_time: 1.5,
    studyTime: 1.5,
    usedInWorkflow: false,
    uploadedAt: '2024-01-08T16:45:00Z',
    created_at: '2024-01-08T16:45:00Z',
    updated_at: '2024-01-08T16:45:00Z'
  },
  {
    id: '5',
    user_id: 'user-1',
    title: 'Statistics Handbook',
    file_type: 'pdf',
    type: 'pdf',
    file_size: 3072000,
    status: 'active' as const,
    tags: ['Statistics', 'Mathematics', 'Reference'],
    headings: ['Descriptive Statistics', 'Probability', 'Hypothesis Testing'],
    content_summary: 'Comprehensive handbook covering statistical methods and applications.',
    study_time: 5.0,
    studyTime: 5.0,
    usedInWorkflow: true,
    uploadedAt: '2024-01-05T11:20:00Z',
    created_at: '2024-01-05T11:20:00Z',
    updated_at: '2024-01-05T11:20:00Z'
  }
];

const mockDashboardData: DashboardResponse = {
  loginStreak: 5,
  timeSavedHours: 42,
  materialsProcessed: 15,
  activeWorkflows: 3
};

const mockWorkflowData: WorkflowResponse = {
  totalWorkflows: 10,
  activeSessions: 2,
  completedWorkflows: 8,
  studyHours: 120,
  recentWorkflowSessions: [
    {
      id: 'session-1',
      title: 'Deep Learning Fundamentals',
      materials: ['1', '2'],
      featuresUsed: ['summary', 'mindmap'],
      timeSpent: 15,
      status: 'active',
      createdAt: '2024-01-20T14:00:00Z'
    },
    {
      id: 'session-2',
      title: 'Advanced Python Concepts',
      materials: ['3', '4'],
      featuresUsed: ['quiz', 'chatbot'],
      timeSpent: 20,
      status: 'completed',
      createdAt: '2024-01-18T10:00:00Z'
    }
  ]
};

export const mockApi = {
  getDashboardData: (): Promise<DashboardResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDashboardData);
      }, 500);
    });
  },
  getWorkflowData: (): Promise<WorkflowResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockWorkflowData);
      }, 500);
    });
  },
  
  getMaterials: (): Promise<MaterialResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalItems: mockMaterials.length,
          materials: mockMaterials
        });
      }, 500);
    });
  }
};
