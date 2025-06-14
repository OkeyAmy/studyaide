-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- File information
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  file_url TEXT, -- URL to the uploaded file in storage
  
  -- Processing status
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  processing_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  -- Raw content
  raw_transcription TEXT,
  polished_note TEXT,
  
  -- AI-generated content (stored as JSONB for better querying)
  ai_summary TEXT,
  ai_quiz JSONB,
  ai_mindmap TEXT,
  ai_flashcards JSONB,
  
  -- Processing metadata
  processing_time_ms INTEGER,
  features_generated TEXT[], -- Array of features like ['summary', 'quiz', 'mindmap', 'flashcards']
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for study_sessions
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own study sessions
CREATE POLICY "Users can view their own study sessions" ON study_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own study sessions
CREATE POLICY "Users can create their own study sessions" ON study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own study sessions
CREATE POLICY "Users can update their own study sessions" ON study_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own study sessions
CREATE POLICY "Users can delete their own study sessions" ON study_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Add study_session_id column to materials table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'materials' 
        AND column_name = 'study_session_id'
    ) THEN
        ALTER TABLE materials ADD COLUMN study_session_id UUID REFERENCES study_sessions(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create function to create study_sessions table if not exists (for RPC calls)
CREATE OR REPLACE FUNCTION create_study_sessions_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  -- This function is just a placeholder since the table creation is handled above
  -- We include it so the RPC call doesn't fail
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to insert study session
CREATE OR REPLACE FUNCTION insert_study_session(
  user_id UUID,
  file_name TEXT,
  file_type TEXT,
  file_size BIGINT DEFAULT NULL,
  file_url TEXT DEFAULT NULL,
  raw_transcription TEXT DEFAULT NULL,
  polished_note TEXT DEFAULT NULL,
  ai_summary TEXT DEFAULT NULL,
  ai_quiz JSONB DEFAULT NULL,
  ai_mindmap TEXT DEFAULT NULL,
  ai_flashcards JSONB DEFAULT NULL,
  processing_time_ms INTEGER DEFAULT NULL,
  features_generated TEXT[] DEFAULT NULL,
  status TEXT DEFAULT 'completed',
  processing_completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO study_sessions (
    user_id,
    file_name,
    file_type,
    file_size,
    file_url,
    raw_transcription,
    polished_note,
    ai_summary,
    ai_quiz,
    ai_mindmap,
    ai_flashcards,
    processing_time_ms,
    features_generated,
    status,
    processing_completed_at
  ) VALUES (
    user_id,
    file_name,
    file_type,
    file_size,
    file_url,
    raw_transcription,
    polished_note,
    ai_summary,
    ai_quiz,
    ai_mindmap,
    ai_flashcards,
    processing_time_ms,
    features_generated,
    status,
    processing_completed_at
  ) RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create an updated_at trigger for study_sessions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_study_sessions_updated_at
    BEFORE UPDATE ON study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 