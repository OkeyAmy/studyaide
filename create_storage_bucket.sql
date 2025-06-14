-- Create storage bucket for study materials
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at)
VALUES (
  'study_materials',
  'study_materials', 
  true,
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the storage bucket
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'study_materials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'study_materials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'study_materials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'study_materials' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to files (optional - for easier file sharing)
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'study_materials'); 