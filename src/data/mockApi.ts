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

const mockWorkflowData = {
  totalWorkflows: 8,
  activeSessions: 3,
  completedWorkflows: 5,
  studyHours: 24.5,
  recentWorkflowSessions: [
    {
      id: "wf-001",
      title: "Machine Learning Fundamentals",
      materials: [
        {
          id: "mat-001",
          user_id: "user-1",
          title: "Introduction to Neural Networks",
          file_type: "pdf",
          file_url: "https://example.com/neural-networks.pdf",
          file_size: 2048000,
          status: "active" as const,
          tags: ["machine learning", "neural networks"],
          headings: ["Introduction", "Neural Network Basics"],
          content_summary: "Basic concepts of neural networks",
          study_time: 120,
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          type: "pdf" as const,
          studyTime: 120,
          usedInWorkflow: true,
          uploadedAt: "2024-01-15T10:00:00Z",
          parsedContent: {
            summary: "Introduction to neural networks and deep learning concepts",
            quiz: null,
            mindMap: null,
            flashcards: null,
            polishedNote: "Neural networks are computational models inspired by biological neural networks"
          }
        },
        {
          id: "mat-002",
          user_id: "user-1",
          title: "Deep Learning Algorithms",
          file_type: "docx",
          file_url: "https://example.com/deep-learning.docx",
          file_size: 1536000,
          status: "active" as const,
          tags: ["deep learning", "algorithms"],
          headings: ["CNN", "RNN", "LSTM"],
          content_summary: "Overview of deep learning algorithms",
          study_time: 90,
          created_at: "2024-01-16T11:00:00Z",
          updated_at: "2024-01-16T11:00:00Z",
          type: "docx" as const,
          studyTime: 90,
          usedInWorkflow: true,
          uploadedAt: "2024-01-16T11:00:00Z",
          parsedContent: {
            summary: "Comprehensive overview of CNN, RNN, and LSTM architectures",
            quiz: null,
            mindMap: null,
            flashcards: null,
            polishedNote: "Deep learning algorithms including convolutional and recurrent neural networks"
          }
        }
      ],
      featuresUsed: ["summary", "mindmap"] as Array<"summary" | "mindmap" | "quiz" | "chatbot">,
      timeSpent: 210,
      status: "active" as const,
      createdAt: "2024-01-15T09:00:00Z"
    },
    {
      id: "wf-002", 
      title: "Data Science Project",
      materials: [
        {
          id: "mat-003",
          user_id: "user-1",
          title: "Statistical Analysis Methods",
          file_type: "pdf",
          file_url: "https://example.com/statistics.pdf",
          file_size: 1024000,
          status: "active" as const,
          tags: ["statistics", "data science"],
          headings: ["Descriptive Statistics", "Inferential Statistics"],
          content_summary: "Statistical methods for data analysis",
          study_time: 150,
          created_at: "2024-01-17T12:00:00Z",
          updated_at: "2024-01-17T12:00:00Z",
          type: "pdf" as const,
          studyTime: 150,
          usedInWorkflow: true,
          uploadedAt: "2024-01-17T12:00:00Z",
          parsedContent: {
            summary: "Statistical methods including descriptive and inferential statistics",
            quiz: null,
            mindMap: null,
            flashcards: null,
            polishedNote: "Comprehensive guide to statistical analysis methods"
          }
        }
      ],
      featuresUsed: ["quiz", "flashcards"] as Array<"summary" | "mindmap" | "quiz" | "chatbot">,
      timeSpent: 150,
      status: "completed" as const,
      createdAt: "2024-01-17T08:00:00Z"
    }
  ]
};

export const fetchMaterials = async (): Promise<MaterialResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const materials: MaterialDisplay[] = [
    {
      id: '1',
      user_id: 'user1',
      title: 'Introduction to Machine Learning',
      file_type: 'pdf',
      file_url: '/documents/ml-intro.pdf',
      file_size: 2500000,
      status: 'active' as const,
      tags: ['machine learning', 'AI', 'fundamentals'],
      headings: ['What is ML?', 'Types of Learning', 'Applications'],
      content_summary: 'Comprehensive introduction to machine learning concepts and applications',
      study_time: 4,
      type: 'pdf',
      studyTime: 4,
      usedInWorkflow: true,
      uploadedAt: '2024-01-15T10:00:00Z',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      user_id: 'user1',
      title: 'Data Structures and Algorithms',
      file_type: 'pdf',
      file_url: '/documents/dsa.pdf',
      file_size: 3200000,
      status: 'active' as const,
      tags: ['algorithms', 'data structures', 'computer science'],
      headings: ['Arrays', 'Linked Lists', 'Trees', 'Graphs'],
      content_summary: 'Complete guide to fundamental data structures and algorithms',
      study_time: 6,
      type: 'pdf',
      studyTime: 6,
      usedInWorkflow: false,
      uploadedAt: '2024-01-14T14:30:00Z',
      created_at: '2024-01-14T14:30:00Z',
      updated_at: '2024-01-14T14:30:00Z'
    },
    {
      id: '3',
      user_id: 'user1',
      title: 'Physics Lecture 5: Quantum Mechanics',
      file_type: 'audio',
      file_url: '/audio/physics-quantum.mp3',
      file_size: 45000000,
      status: 'active' as const,
      tags: ['physics', 'quantum mechanics', 'lecture'],
      headings: ['Wave-Particle Duality', 'Heisenberg Principle', 'Schrödinger Equation'],
      content_summary: 'Lecture covering fundamental principles of quantum mechanics',
      study_time: 2,
      type: 'audio',
      studyTime: 2,
      usedInWorkflow: true,
      uploadedAt: '2024-01-13T09:15:00Z',
      created_at: '2024-01-13T09:15:00Z',
      updated_at: '2024-01-13T09:15:00Z'
    },
    {
      id: '4',
      user_id: 'user1',
      title: 'Chemistry Lab: Organic Synthesis',
      file_type: 'video',
      file_url: '/videos/chem-lab.mp4',
      file_size: 120000000,
      status: 'active' as const,
      tags: ['chemistry', 'organic synthesis', 'lab work'],
      headings: ['Preparation', 'Reaction Steps', 'Analysis'],
      content_summary: 'Step-by-step guide to organic synthesis in laboratory setting',
      study_time: 3,
      type: 'video',
      studyTime: 3,
      usedInWorkflow: false,
      uploadedAt: '2024-01-12T16:45:00Z',
      created_at: '2024-01-12T16:45:00Z',
      updated_at: '2024-01-12T16:45:00Z'
    },
    {
      id: '5',
      user_id: 'user1',
      title: 'History of Ancient Rome',
      file_type: 'docx',
      file_url: '/documents/ancient-rome.docx',
      file_size: 1800000,
      status: 'archived' as const,
      tags: ['history', 'ancient rome', 'civilization'],
      headings: ['Roman Republic', 'The Empire', 'Fall of Rome'],
      content_summary: 'Detailed study of Roman history from republic to fall',
      study_time: 5,
      type: 'docx',
      studyTime: 5,
      usedInWorkflow: false,
      uploadedAt: '2024-01-11T11:20:00Z',
      created_at: '2024-01-11T11:20:00Z',
      updated_at: '2024-01-11T11:20:00Z'
    }
  ];

  return {
    totalItems: materials.length,
    materials
  };
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
