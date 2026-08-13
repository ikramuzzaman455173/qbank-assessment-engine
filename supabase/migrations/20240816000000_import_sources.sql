-- Migration 20240816000000_import_sources.sql

CREATE TYPE source_kind AS ENUM ('pdf', 'json', 'manual');
CREATE TYPE source_status AS ENUM ('uploaded', 'processing', 'review', 'completed', 'failed');

-- UPLOADED SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.uploaded_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_bank_id UUID REFERENCES public.question_banks(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    source_type source_kind NOT NULL,
    storage_path TEXT,
    file_size BIGINT,
    status source_status NOT NULL DEFAULT 'uploaded',
    total_questions INTEGER DEFAULT 0,
    imported_questions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_uploaded_sources_user_id ON public.uploaded_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_sources_bank_id ON public.uploaded_sources(question_bank_id);

-- TRIGGER FOR UPDATED_AT
CREATE TRIGGER update_uploaded_sources_updated_at
BEFORE UPDATE ON public.uploaded_sources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.uploaded_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own uploaded sources"
ON public.uploaded_sources FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploaded sources"
ON public.uploaded_sources FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploaded sources"
ON public.uploaded_sources FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploaded sources"
ON public.uploaded_sources FOR DELETE
USING (auth.uid() = user_id);


-- STORAGE BUCKET FOR QUESTION SOURCES
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-sources', 'question-sources', false)
ON CONFLICT (id) DO NOTHING;

-- RLS ON STORAGE.OBJECTS is already enabled in previous migration

-- Allow users to read their own uploaded files
CREATE POLICY "Users can view their own question sources."
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'question-sources' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own question sources."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'question-sources' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own files
CREATE POLICY "Users can update their own question sources."
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'question-sources' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own question sources."
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'question-sources' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
