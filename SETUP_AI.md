# AI Features Setup

This project now includes AI-powered study features using Google's Gemini API through both the OpenAI SDK and native Google Generative AI SDK.

## Features Implemented

- ✅ **Voice Transcription**: Audio transcription using Gemini 1.5 Flash
- ✅ **Note Polishing**: Raw text enhancement with markdown formatting
- ✅ **Summary Generation**: Flashcard-style bullet-point summaries
- ✅ **Quiz Generation**: Multiple-choice quizzes with JSON output
- ✅ **Mind Map Generation**: Mermaid.js syntax for visual mind maps
- ✅ **Context-Aware Chatbot**: RAG-based Q&A using note content

## Setup Instructions

1. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Create a new API key
   - Copy the API key

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Add your API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

3. **Dependencies**
   All required packages are already installed:
   - `openai` - For OpenAI-compatible API calls
   - `@google/generative-ai` - For native multimodal features
   - `marked` - For markdown parsing
   - `mermaid` - For mind map rendering

## Architecture

### Services Structure
```
src/services/
├── ai.service.ts         # Central OpenAI client for Gemini
├── note.service.ts       # Audio transcription & text polishing
├── summary.service.ts    # Summary generation
├── quiz.service.ts       # Quiz generation
├── mindmap.service.ts    # Mind map generation
└── chatbot.service.ts    # Context-aware chat
```

### Hybrid Approach
- **Audio processing**: Uses native `@google/generative-ai` SDK (supports multimodal)
- **Text generation**: Uses `openai` SDK with Gemini compatibility endpoint
- **Model**: Gemini 2.0 Flash for fast, cost-effective generation

## Usage

1. **Upload a file or record audio** in the Study Session
2. **Processing**: Auto-transcribes and polishes content
3. **Generate features**: Click buttons in each tab to generate:
   - Summary (flashcard-style)
   - Quiz (multiple choice)
   - Mind Map (Mermaid.js)
   - Chat with your content

## Integration Points

- `StudySessionContext`: React context managing AI state
- Tab components updated to use AI services
- Real-time generation with loading states
- Error handling with user feedback

## Next Steps

The infrastructure is ready to:
- Connect to a knowledge base for persistent storage
- Add more AI features (flashcards, translations, etc.)
- Implement caching for improved performance
- Add user preferences for AI behavior

All AI services are modular and can be easily extended or modified. 