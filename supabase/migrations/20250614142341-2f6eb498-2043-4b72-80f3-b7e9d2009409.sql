
ALTER TABLE public.workflows
ADD COLUMN IF NOT EXISTS materials_data JSONB DEFAULT '[]'::jsonb;
