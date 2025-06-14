# StudyAide - AI-Powered Learning Platform

StudyAide is a comprehensive learning management system that transforms your study materials into interactive learning experiences using AI. Upload documents, create workflows, and access powerful study tools like summaries, quizzes, mind maps, and flashcards.

## 🚀 Features Overview

### 📚 Knowledge Base Management
- **File Upload & Processing**: Support for PDF, DOCX, audio, and video files
- **AI Content Analysis**: Automatic content extraction and summarization
- **Smart Organization**: Tag-based categorization and search functionality
- **Material Viewer**: Integrated document viewer with study tools

### 🔄 Workflow System
- **Custom Learning Paths**: Create structured learning workflows with multiple materials
- **Progress Tracking**: Monitor study progress and time spent
- **Workflow Templates**: Pre-built workflows for common study patterns
- **Material Sequencing**: Organize materials in optimal learning order

### 🧠 AI Study Tools
- **Smart Summaries**: AI-generated summaries of your materials
- **Interactive Quizzes**: Auto-generated questions based on content
- **Mind Maps**: Visual concept mapping and relationship visualization
- **Flashcards**: Spaced repetition learning cards
- **AI Chatbot**: Ask questions about your materials

### 📊 Dashboard & Analytics
- **Study Statistics**: Track learning progress and time spent
- **Quick Actions**: Fast access to common tasks
- **Recent Activity**: Overview of recent study sessions
- **Performance Metrics**: Detailed analytics on learning outcomes

### 🎯 Study Sessions
- **Focused Learning**: Distraction-free study environment
- **Multi-modal Support**: Text, audio, and video content
- **Real-time Recording**: Live lecture capture and processing
- **Session Management**: Pause, resume, and organize study sessions

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **State Management**: React Hooks + Context API
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API
- **File Processing**: Custom parsers for multiple formats
- **Icons**: Lucide React

## 📋 Prerequisites

Before setting up StudyAide, ensure you have:

- **Node.js** (v18 or higher)
- **pnpm** package manager
- **Supabase** account and project
- **OpenAI** API key (optional, for AI features)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd studyaide
```

### 2. Install Dependencies
```bash
# Remove any existing lock files and node_modules (if build errors occur)
rm -rf node_modules package-lock.json pnpm-lock.yaml

# Install dependencies
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (Optional)
VITE_OPENAI_API_KEY=your_openai_api_key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 4. Database Setup
Set up your Supabase database with the required tables:

```sql
-- Materials table
CREATE TABLE materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  content_summary TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflows table
CREATE TABLE workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  materials UUID[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study sessions table
CREATE TABLE study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id),
  duration INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Start Development Server
```bash
pnpm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Build & Deployment

### Development Build
```bash
pnpm run build
```

### Production Deployment
```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## 📖 User Guide

### Getting Started

1. **Dashboard Overview**
   - Access quick actions for common tasks
   - View study statistics and recent activity
   - Navigate to different sections of the app

2. **Upload Your First Material**
   - Go to Knowledge Base
   - Click "Upload Material"
   - Select PDF, DOCX, audio, or video files
   - Add tags and descriptions
   - Wait for AI processing to complete

3. **Create Your First Workflow**
   - Navigate to "My Workflows"
   - Click "Create Workflow"
   - Select "Import from Knowledge Base"
   - Choose materials and arrange them in order
   - Save your workflow

### Core Workflows

#### 📚 Knowledge Base Management
1. **Upload Materials**
   - Drag & drop files or click to browse
   - Supported formats: PDF, DOCX, MP3, MP4, etc.
   - Automatic content extraction and analysis

2. **Organize Content**
   - Add descriptive tags
   - Create categories
   - Use search and filters

3. **Access Study Tools**
   - Click on any material
   - Choose from Summary, Quiz, Mind Map, or Flashcards
   - Each tool provides different learning perspectives

#### 🔄 Workflow Creation
1. **Plan Your Learning Path**
   - Identify learning objectives
   - Select relevant materials
   - Arrange in logical sequence

2. **Create Workflow**
   - Use the workflow creator
   - Add materials from knowledge base
   - Set difficulty and estimated duration

3. **Execute Workflow**
   - Start study session
   - Follow the structured path
   - Track progress automatically

#### 🎯 Study Sessions
1. **Start Focused Session**
   - Choose a workflow or individual material
   - Enter distraction-free mode
   - Use integrated study tools

2. **Multi-modal Learning**
   - Read documents
   - Watch videos
   - Listen to audio
   - Take notes and quizzes

3. **Track Progress**
   - Monitor time spent
   - Complete assessments
   - Review performance metrics

### Advanced Features

#### 🧠 AI Study Tools

**Smart Summaries**
- AI-generated content summaries
- Key points extraction
- Customizable summary length
- Export options

**Interactive Quizzes**
- Auto-generated questions
- Multiple choice and open-ended
- Immediate feedback
- Progress tracking

**Mind Maps**
- Visual concept relationships
- Interactive node exploration
- Export and sharing options
- Collaborative features

**Flashcards**
- Spaced repetition algorithm
- Difficulty-based scheduling
- Performance analytics
- Custom card creation

#### 📊 Analytics & Insights
- Study time tracking
- Performance metrics
- Learning pattern analysis
- Progress visualization
- Goal setting and tracking

## 🏗️ Project Structure

```
studyaide/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (AppLayout, Sidebar)
│   │   ├── material/       # Material-related components
│   │   ├── workflow/       # Workflow management components
│   │   ├── shared/         # Shared utility components
│   │   └── ui/            # shadcn/ui components
│   ├── pages/              # Main application pages
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── KnowledgeBase.tsx # Material management
│   │   ├── MyWorkflows.tsx # Workflow management
│   │   └── StudySession.tsx # Study interface
│   ├── hooks/              # Custom React hooks
│   │   ├── useDatabase.ts  # Database operations
│   │   └── useAuth.ts      # Authentication
│   ├── lib/                # Utility libraries
│   │   ├── supabase.ts     # Supabase client
│   │   └── utils.ts        # Helper functions
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles and themes
├── public/                 # Static assets
├── docs/                   # Documentation
└── tests/                  # Test files
```

## 🔍 Key Components

### Navigation & Layout
- **Sidebar**: Collapsible navigation with dynamic counts
- **AppLayout**: Main layout wrapper with responsive design
- **Header**: User information and quick actions

### Material Management
- **MaterialViewer**: Integrated document viewer
- **FilePreviewer**: Preview component for various file types
- **MaterialUpload**: Drag & drop file upload interface

### Workflow System
- **WorkflowCreator**: Visual workflow builder
- **WorkflowContentViewer**: Detailed workflow display
- **WorkflowSessionView**: Active session management

### Study Tools
- **SummaryTab**: AI-generated summaries
- **QuizTab**: Interactive assessments
- **MindMapTab**: Visual concept mapping
- **FlashcardTab**: Spaced repetition learning

## 🐛 Troubleshooting

### Common Build Issues

**Rollup Module Error**
```bash
# Remove dependencies and reinstall
rm -rf node_modules package-lock.json pnpm-lock.yaml
pnpm install
```

**TypeScript Errors**
```bash
# Clear TypeScript cache
rm -rf .tsbuildinfo
pnpm run build
```

**Supabase Connection Issues**
- Verify environment variables
- Check Supabase project status
- Ensure database tables exist

### Performance Optimization

**Large File Handling**
- Implement file chunking for uploads
- Use lazy loading for material lists
- Optimize image and video assets

**Database Queries**
- Use pagination for large datasets
- Implement proper indexing
- Cache frequently accessed data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review troubleshooting guide

## 🚀 Future Roadmap

- [ ] Mobile application
- [ ] Collaborative study groups
- [ ] Advanced AI tutoring
- [ ] Integration with external LMS
- [ ] Offline mode support
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

---

**StudyAide** - Transform your learning experience with AI-powered study tools.
