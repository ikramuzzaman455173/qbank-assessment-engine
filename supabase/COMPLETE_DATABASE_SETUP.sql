-- ==========================================================================
-- KNOWLEDGE CANVAS - COMPLETE DATABASE SCHEMA & RPC FUNCTIONS SETUP
-- Run this script once in your Supabase SQL Editor for fresh setup.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- Section: 20240801000000_initial_schema.sql
-- --------------------------------------------------------------------------

-- ==========================================
-- Source: 20240813000000_profiles.sql
-- ==========================================

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Create a trigger to automatically create a profile when a new user signs up
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO anon, authenticated;


-- ==========================================
-- Source: 20240814000000_storage.sql
-- ==========================================

-- Set up Storage for Avatars

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects if not already enabled
-- Note: Supabase enables this by default, but we ensure it here.
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Storage Policies for 'avatars' bucket

-- Allow public read access to avatars so they can be displayed
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
-- They can only upload to a path that matches their user ID (e.g., 'avatars/<uid>/...')
CREATE POLICY "Users can upload their own avatar."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar."
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );


-- ==========================================
-- Source: 20240815000000_question_banks.sql
-- ==========================================

-- Migration 20240815000000_question_banks.sql

CREATE TYPE question_difficulty AS ENUM ('easy', 'medium', 'hard');

-- QUESTION BANKS TABLE
CREATE TABLE IF NOT EXISTS public.question_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    topic TEXT,
    question_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_bank_id UUID NOT NULL REFERENCES public.question_banks(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    difficulty question_difficulty,
    topic TEXT,
    source_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_question_banks_user_id ON public.question_banks(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_bank_id ON public.questions(question_bank_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_question_banks_updated_at
BEFORE UPDATE ON public.question_banks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- TRIGGER TO MAINTAIN QUESTION COUNT
CREATE OR REPLACE FUNCTION maintain_question_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.question_banks
        SET question_count = question_count + 1
        WHERE id = NEW.question_bank_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.question_banks
        SET question_count = question_count - 1
        WHERE id = OLD.question_bank_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_maintain_question_count
AFTER INSERT OR DELETE ON public.questions
FOR EACH ROW EXECUTE FUNCTION maintain_question_count();


-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Question Banks Policies
CREATE POLICY "Users can view their own question banks"
ON public.question_banks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own question banks"
ON public.question_banks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own question banks"
ON public.question_banks FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own question banks"
ON public.question_banks FOR DELETE
USING (auth.uid() = user_id);

-- Questions Policies (Nested Ownership via question_banks)
CREATE POLICY "Users can view questions in their own banks"
ON public.questions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.question_banks
        WHERE id = questions.question_bank_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert questions into their own banks"
ON public.questions FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.question_banks
        WHERE id = question_bank_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can update questions in their own banks"
ON public.questions FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.question_banks
        WHERE id = questions.question_bank_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete questions in their own banks"
ON public.questions FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.question_banks
        WHERE id = questions.question_bank_id
        AND user_id = auth.uid()
    )
);


-- ==========================================
-- Source: 20240816000000_import_sources.sql
-- ==========================================

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


-- ==========================================
-- Source: 20240817000000_tests_and_attempts.sql
-- ==========================================

-- 1. Tests Table
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_bank_id UUID NOT NULL REFERENCES question_banks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('full', 'random', 'custom')),
    total_questions INTEGER NOT NULL,
    difficulty TEXT, -- easy, medium, hard, mixed
    topic TEXT,
    source TEXT,
    timer_enabled BOOLEAN NOT NULL DEFAULT false,
    duration_seconds INTEGER,
    randomize_questions BOOLEAN NOT NULL DEFAULT false,
    randomize_options BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure updated_at works
CREATE TRIGGER handle_updated_at_tests
    BEFORE UPDATE ON tests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. Test Questions (Immutable Snapshot)
CREATE TABLE test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    original_question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
    question_order INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    topic TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    source_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Attempts Table
CREATE TABLE attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'auto_submitted', 'abandoned')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ,
    time_spent_seconds INTEGER,
    total_questions INTEGER NOT NULL,
    answered_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER,
    incorrect_answers INTEGER,
    unanswered_questions INTEGER,
    score FLOAT,
    percentage FLOAT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure updated_at works
CREATE TRIGGER handle_updated_at_attempts
    BEFORE UPDATE ON attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Attempt Answers Table
CREATE TABLE attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    test_question_id UUID NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
    selected_answer TEXT CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
    is_correct BOOLEAN,
    is_marked_for_review BOOLEAN NOT NULL DEFAULT false,
    answered_at TIMESTAMPTZ,
    UNIQUE(attempt_id, test_question_id) -- A user can only have one answer record per question in an attempt
);

-- Enable RLS
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- tests
CREATE POLICY "Users can manage their own tests"
    ON tests
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- test_questions
CREATE POLICY "Users can manage their own test questions"
    ON test_questions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM tests
            WHERE tests.id = test_questions.test_id
            AND tests.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM tests
            WHERE tests.id = test_questions.test_id
            AND tests.user_id = auth.uid()
        )
    );

-- attempts
CREATE POLICY "Users can manage their own attempts"
    ON attempts
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- attempt_answers
CREATE POLICY "Users can manage their own attempt answers"
    ON attempt_answers
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM attempts
            WHERE attempts.id = attempt_answers.attempt_id
            AND attempts.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM attempts
            WHERE attempts.id = attempt_answers.attempt_id
            AND attempts.user_id = auth.uid()
        )
    );

-- 6. Indexes for performance
CREATE INDEX idx_tests_user_id ON tests(user_id);
CREATE INDEX idx_tests_question_bank_id ON tests(question_bank_id);
CREATE INDEX idx_test_questions_test_id ON test_questions(test_id);
CREATE INDEX idx_attempts_user_id ON attempts(user_id);
CREATE INDEX idx_attempts_test_id ON attempts(test_id);
CREATE INDEX idx_attempt_answers_attempt_id ON attempt_answers(attempt_id);

-- 7. PostgreSQL RPC for Server-Side Scoring
CREATE OR REPLACE FUNCTION submit_attempt(p_attempt_id UUID, p_status TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_attempt_record RECORD;
    v_correct INTEGER := 0;
    v_incorrect INTEGER := 0;
    v_unanswered INTEGER := 0;
    v_total INTEGER;
    v_score FLOAT;
    v_percentage FLOAT;
    v_time_spent INTEGER;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    -- Verify attempt belongs to user and is not already completed
    SELECT * INTO v_attempt_record 
    FROM attempts 
    WHERE id = p_attempt_id AND user_id = v_user_id;

    IF v_attempt_record IS NULL THEN
        RAISE EXCEPTION 'Attempt not found or unauthorized';
    END IF;

    IF v_attempt_record.status IN ('completed', 'auto_submitted') THEN
        RAISE EXCEPTION 'Attempt is already submitted';
    END IF;

    -- Update is_correct on answers by comparing with test_questions
    UPDATE attempt_answers aa
    SET is_correct = (aa.selected_answer = tq.correct_answer)
    FROM test_questions tq
    WHERE aa.test_question_id = tq.id
    AND aa.attempt_id = p_attempt_id
    AND aa.selected_answer IS NOT NULL;

    -- Calculate stats
    SELECT 
        COUNT(*) INTO v_total
    FROM test_questions 
    WHERE test_id = v_attempt_record.test_id;

    SELECT 
        COUNT(*) FILTER (WHERE is_correct = true),
        COUNT(*) FILTER (WHERE is_correct = false AND selected_answer IS NOT NULL),
        COUNT(*) FILTER (WHERE selected_answer IS NULL) + (v_total - COUNT(*))
    INTO v_correct, v_incorrect, v_unanswered
    FROM attempt_answers
    WHERE attempt_id = p_attempt_id;

    -- Calculate score (1 point per correct answer)
    v_score := v_correct::FLOAT;
    IF v_total > 0 THEN
        v_percentage := (v_correct::FLOAT / v_total::FLOAT) * 100.0;
    ELSE
        v_percentage := 0.0;
    END IF;

    -- Calculate time spent
    v_time_spent := EXTRACT(EPOCH FROM (now() - v_attempt_record.started_at))::INTEGER;

    -- Update the attempt record
    UPDATE attempts
    SET 
        status = p_status,
        submitted_at = now(),
        time_spent_seconds = v_time_spent,
        correct_answers = v_correct,
        incorrect_answers = v_incorrect,
        unanswered_questions = v_unanswered,
        answered_questions = v_total - v_unanswered,
        score = v_score,
        percentage = v_percentage
    WHERE id = p_attempt_id;

    RETURN json_build_object(
        'success', true,
        'score', v_score,
        'percentage', v_percentage,
        'correct', v_correct,
        'incorrect', v_incorrect,
        'unanswered', v_unanswered,
        'time_spent', v_time_spent
    )::JSONB;
END;
$$;


-- ==========================================
-- Source: 20240817000001_generate_test.sql
-- ==========================================

CREATE OR REPLACE FUNCTION generate_test(
    p_bank_id UUID,
    p_title TEXT,
    p_mode TEXT,
    p_total_questions INTEGER,
    p_difficulty TEXT,
    p_topic TEXT,
    p_source TEXT,
    p_timer_enabled BOOLEAN,
    p_duration_seconds INTEGER,
    p_randomize_questions BOOLEAN,
    p_randomize_options BOOLEAN
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_test_id UUID;
    v_available_count INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Create a temporary table to hold eligible questions
    CREATE TEMP TABLE tmp_eligible_questions ON COMMIT DROP AS
    SELECT q.* FROM public.questions q
    JOIN public.question_banks qb ON q.question_bank_id = qb.id
    WHERE q.question_bank_id = p_bank_id
    AND qb.user_id = v_user_id
    AND (p_difficulty IS NULL OR p_difficulty = 'mixed' OR q.difficulty::text = p_difficulty)
    AND (p_topic IS NULL OR p_topic = '' OR q.topic = p_topic);

    SELECT COUNT(*) INTO v_available_count FROM tmp_eligible_questions;

    IF v_available_count < p_total_questions THEN
        RAISE EXCEPTION 'Insufficient questions. Requested % but only % available matching filters.', p_total_questions, v_available_count;
    END IF;

    -- Insert Test
    INSERT INTO public.tests (
        user_id, question_bank_id, title, mode, total_questions, difficulty, topic, source,
        timer_enabled, duration_seconds, randomize_questions, randomize_options
    ) VALUES (
        v_user_id, p_bank_id, p_title, p_mode, LEAST(p_total_questions, v_available_count), p_difficulty, p_topic, p_source,
        p_timer_enabled, p_duration_seconds, p_randomize_questions, p_randomize_options
    ) RETURNING id INTO v_test_id;

    -- Insert Test Questions (Snapshot)
    INSERT INTO public.test_questions (
        test_id, original_question_id, question_order,
        question_text, option_a, option_b, option_c, option_d, correct_answer,
        explanation, topic, difficulty, source_reference
    )
    SELECT
        v_test_id, id, row_number() over (ORDER BY CASE WHEN p_mode IN ('random', 'custom') THEN random() ELSE 0.5 END),
        question_text, option_a, option_b, option_c, option_d, correct_answer,
        explanation, topic, difficulty, source_reference
    FROM tmp_eligible_questions
    ORDER BY CASE WHEN p_mode IN ('random', 'custom') THEN random() ELSE 0.5 END
    LIMIT p_total_questions;

    RETURN v_test_id;
END;
$$;


-- ==========================================
-- Source: 20240818000000_practice_and_performance.sql
-- ==========================================

-- 1. Alter tests table to support practice mode
ALTER TABLE tests DROP CONSTRAINT tests_mode_check;
ALTER TABLE tests ADD CONSTRAINT tests_mode_check CHECK (mode IN ('full', 'random', 'custom', 'practice'));

ALTER TABLE tests ADD COLUMN practice_mode TEXT CHECK (practice_mode IN ('all', 'incorrect', 'unanswered', 'marked', 'difficult', 'weak_topic', 'recent_mistakes'));

-- 2. Create user_question_performance view
-- This view aggregates performance at the original question level for a specific user
CREATE OR REPLACE VIEW user_question_performance AS
SELECT 
  t.user_id,
  t.question_bank_id,
  tq.original_question_id,
  COUNT(aa.id) as total_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = true) as correct_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = false AND aa.selected_answer IS NOT NULL) as incorrect_attempts,
  COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NULL) as unanswered_attempts,
  MAX(a.submitted_at) as last_attempted_at,
  CASE WHEN COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL) > 0 
       THEN (COUNT(aa.id) FILTER (WHERE aa.is_correct = true)::FLOAT / COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL)::FLOAT) * 100.0
       ELSE NULL 
  END as accuracy
FROM attempts a
JOIN attempt_answers aa ON a.id = aa.attempt_id
JOIN test_questions tq ON aa.test_question_id = tq.id
JOIN tests t ON a.test_id = t.id
WHERE a.status IN ('completed', 'auto_submitted') 
AND tq.original_question_id IS NOT NULL
GROUP BY t.user_id, t.question_bank_id, tq.original_question_id;

-- 3. Create user_topic_performance view
-- This view aggregates performance at the topic level for a specific user within a question bank
CREATE OR REPLACE VIEW user_topic_performance AS
SELECT 
  t.user_id,
  t.question_bank_id,
  tq.topic,
  COUNT(aa.id) as total_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = true) as correct_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = false AND aa.selected_answer IS NOT NULL) as incorrect_attempts,
  COUNT(DISTINCT tq.original_question_id) as distinct_questions_attempted,
  CASE WHEN COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL) > 0 
       THEN (COUNT(aa.id) FILTER (WHERE aa.is_correct = true)::FLOAT / COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL)::FLOAT) * 100.0
       ELSE NULL 
  END as accuracy
FROM attempts a
JOIN attempt_answers aa ON a.id = aa.attempt_id
JOIN test_questions tq ON aa.test_question_id = tq.id
JOIN tests t ON a.test_id = t.id
WHERE a.status IN ('completed', 'auto_submitted')
AND tq.topic IS NOT NULL
GROUP BY t.user_id, t.question_bank_id, tq.topic;

-- 4. Create user_difficulty_performance view
CREATE OR REPLACE VIEW user_difficulty_performance AS
SELECT 
  t.user_id,
  t.question_bank_id,
  tq.difficulty,
  COUNT(aa.id) as total_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = true) as correct_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = false AND aa.selected_answer IS NOT NULL) as incorrect_attempts,
  CASE WHEN COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL) > 0 
       THEN (COUNT(aa.id) FILTER (WHERE aa.is_correct = true)::FLOAT / COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL)::FLOAT) * 100.0
       ELSE NULL 
  END as accuracy
FROM attempts a
JOIN attempt_answers aa ON a.id = aa.attempt_id
JOIN test_questions tq ON aa.test_question_id = tq.id
JOIN tests t ON a.test_id = t.id
WHERE a.status IN ('completed', 'auto_submitted')
AND tq.difficulty IS NOT NULL
GROUP BY t.user_id, t.question_bank_id, tq.difficulty;

-- 5. Create RPC for generating practice test
CREATE OR REPLACE FUNCTION generate_practice_test(
    p_question_bank_id UUID,
    p_practice_mode TEXT,
    p_num_questions INTEGER,
    p_topic TEXT DEFAULT NULL,
    p_difficulty TEXT DEFAULT NULL,
    p_randomize_questions BOOLEAN DEFAULT true,
    p_randomize_options BOOLEAN DEFAULT true
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_test_id UUID;
    v_selected_count INTEGER := 0;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    -- Verify question bank access
    IF NOT EXISTS (SELECT 1 FROM question_banks WHERE id = p_question_bank_id AND user_id = v_user_id) THEN
        RAISE EXCEPTION 'Question bank not found or unauthorized';
    END IF;

    -- Create test record
    INSERT INTO tests (
        user_id, 
        question_bank_id, 
        title, 
        mode,
        practice_mode, 
        total_questions, 
        randomize_questions,
        randomize_options,
        topic,
        difficulty
    )
    VALUES (
        v_user_id, 
        p_question_bank_id, 
        'Practice Session - ' || p_practice_mode, 
        'practice',
        p_practice_mode,
        p_num_questions, 
        p_randomize_questions,
        p_randomize_options,
        p_topic,
        p_difficulty
    )
    RETURNING id INTO v_test_id;

    -- Insert questions based on practice_mode
    -- For 'marked', we could join attempt_answers to find questions marked for review
    -- For 'recent_mistakes', we could order by last_attempted_at DESC
    
    INSERT INTO test_questions (
        test_id,
        original_question_id,
        question_order,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        explanation,
        topic,
        difficulty,
        source_reference
    )
    SELECT 
        v_test_id,
        q.id,
        row_number() over (order by (CASE WHEN p_randomize_questions THEN random() ELSE 1 END)),
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_answer,
        q.explanation,
        q.topic,
        q.difficulty,
        q.source_reference
    FROM questions q
    LEFT JOIN user_question_performance p ON q.id = p.original_question_id AND p.user_id = v_user_id
    LEFT JOIN user_topic_performance tp ON q.topic = tp.topic AND tp.user_id = v_user_id AND tp.question_bank_id = p_question_bank_id
    WHERE q.question_bank_id = p_question_bank_id
    AND (p_topic IS NULL OR q.topic = p_topic)
    AND (p_difficulty IS NULL OR q.difficulty = p_difficulty)
    AND (
        (p_practice_mode = 'all') OR
        (p_practice_mode = 'incorrect' AND p.incorrect_attempts > 0) OR
        (p_practice_mode = 'unanswered' AND p.unanswered_attempts > 0) OR
        (p_practice_mode = 'difficult' AND q.difficulty = 'hard') OR
        (p_practice_mode = 'weak_topic' AND tp.accuracy < 70) OR
        (p_practice_mode = 'marked' AND EXISTS (
            SELECT 1 FROM attempt_answers aa
            JOIN test_questions tq ON aa.test_question_id = tq.id
            JOIN tests t ON tq.test_id = t.id
            WHERE tq.original_question_id = q.id AND t.user_id = v_user_id AND aa.is_marked_for_review = true
        )) OR
        (p_practice_mode = 'recent_mistakes' AND p.incorrect_attempts > 0)
    )
    ORDER BY 
        (CASE WHEN p_practice_mode = 'recent_mistakes' THEN p.last_attempted_at ELSE NULL END) DESC NULLS LAST,
        (CASE WHEN p_randomize_questions THEN random() ELSE q.created_at::float END)
    LIMIT p_num_questions;

    -- Get actual count
    SELECT COUNT(*) INTO v_selected_count FROM test_questions WHERE test_id = v_test_id;

    -- Update total_questions in test to actual count found
    UPDATE tests SET total_questions = v_selected_count WHERE id = v_test_id;

    IF v_selected_count = 0 THEN
        -- Cleanup if no questions found
        DELETE FROM tests WHERE id = v_test_id;
        RETURN json_build_object(
            'success', false,
            'message', 'No questions match your current practice filters.'
        )::JSONB;
    END IF;

    RETURN json_build_object(
        'success', true,
        'test_id', v_test_id,
        'questions_added', v_selected_count
    )::JSONB;
END;
$$;


-- ==========================================
-- Source: 20240819000000_secure_practice_views.sql
-- ==========================================

-- Ensure views enforce RLS by using the invoker's permissions
CREATE OR REPLACE VIEW user_question_performance WITH (security_invoker = true) AS
SELECT 
  t.user_id,
  t.question_bank_id,
  tq.original_question_id,
  COUNT(aa.id) as total_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = true) as correct_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = false AND aa.selected_answer IS NOT NULL) as incorrect_attempts,
  COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NULL) as unanswered_attempts,
  MAX(a.submitted_at) as last_attempted_at,
  CASE WHEN COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL) > 0 
       THEN (COUNT(aa.id) FILTER (WHERE aa.is_correct = true)::FLOAT / COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL)::FLOAT) * 100.0
       ELSE NULL 
  END as accuracy
FROM attempts a
JOIN attempt_answers aa ON a.id = aa.attempt_id
JOIN test_questions tq ON aa.test_question_id = tq.id
JOIN tests t ON a.test_id = t.id
WHERE a.status IN ('completed', 'auto_submitted') 
AND tq.original_question_id IS NOT NULL
GROUP BY t.user_id, t.question_bank_id, tq.original_question_id;

CREATE OR REPLACE VIEW user_topic_performance WITH (security_invoker = true) AS
SELECT 
  t.user_id,
  t.question_bank_id,
  tq.topic,
  COUNT(aa.id) as total_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = true) as correct_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = false AND aa.selected_answer IS NOT NULL) as incorrect_attempts,
  COUNT(DISTINCT tq.original_question_id) as distinct_questions_attempted,
  CASE WHEN COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL) > 0 
       THEN (COUNT(aa.id) FILTER (WHERE aa.is_correct = true)::FLOAT / COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL)::FLOAT) * 100.0
       ELSE NULL 
  END as accuracy
FROM attempts a
JOIN attempt_answers aa ON a.id = aa.attempt_id
JOIN test_questions tq ON aa.test_question_id = tq.id
JOIN tests t ON a.test_id = t.id
WHERE a.status IN ('completed', 'auto_submitted')
AND tq.topic IS NOT NULL
GROUP BY t.user_id, t.question_bank_id, tq.topic;

CREATE OR REPLACE VIEW user_difficulty_performance WITH (security_invoker = true) AS
SELECT 
  t.user_id,
  t.question_bank_id,
  tq.difficulty,
  COUNT(aa.id) as total_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = true) as correct_attempts,
  COUNT(aa.id) FILTER (WHERE aa.is_correct = false AND aa.selected_answer IS NOT NULL) as incorrect_attempts,
  CASE WHEN COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL) > 0 
       THEN (COUNT(aa.id) FILTER (WHERE aa.is_correct = true)::FLOAT / COUNT(aa.id) FILTER (WHERE aa.selected_answer IS NOT NULL)::FLOAT) * 100.0
       ELSE NULL 
  END as accuracy
FROM attempts a
JOIN attempt_answers aa ON a.id = aa.attempt_id
JOIN test_questions tq ON aa.test_question_id = tq.id
JOIN tests t ON a.test_id = t.id
WHERE a.status IN ('completed', 'auto_submitted')
AND tq.difficulty IS NOT NULL
GROUP BY t.user_id, t.question_bank_id, tq.difficulty;




-- --------------------------------------------------------------------------
-- Section: 20240820000000_dashboard_analytics.sql
-- --------------------------------------------------------------------------

-- Migration 20240820000000_dashboard_analytics.sql

CREATE OR REPLACE FUNCTION get_dashboard_metrics(p_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_total_questions INTEGER := 0;
    v_questions_practiced INTEGER := 0;
    v_tests_completed INTEGER := 0;
    v_overall_correct INTEGER := 0;
    v_overall_answered INTEGER := 0;
    v_overall_accuracy FLOAT := NULL;
    v_start_date TIMESTAMPTZ;
    
    v_trend JSONB;
    v_strong_topics JSONB;
    v_weak_topics JSONB;
    v_recent_activity JSONB;
    v_bank_summaries JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Calculate start date based on p_days
    -- If p_days is 0, we consider "All Time"
    IF p_days > 0 THEN
        v_start_date := now() - (p_days || ' days')::interval;
    ELSE
        v_start_date := '1970-01-01'::timestamptz;
    END IF;

    -- 1. Total Questions (across all banks)
    SELECT COALESCE(SUM(question_count), 0) INTO v_total_questions
    FROM question_banks
    WHERE user_id = v_user_id;

    -- 2. Base metrics from attempts
    -- For questions_practiced, we count distinct original questions attempted
    -- For total correct/answered, we sum across all valid attempts
    SELECT 
        COUNT(DISTINCT tq.original_question_id),
        COUNT(DISTINCT a.id),
        COALESCE(SUM(a.correct_answers), 0),
        COALESCE(SUM(a.answered_questions), 0)
    INTO 
        v_questions_practiced,
        v_tests_completed,
        v_overall_correct,
        v_overall_answered
    FROM attempts a
    LEFT JOIN attempt_answers aa ON a.id = aa.attempt_id
    LEFT JOIN test_questions tq ON aa.test_question_id = tq.id
    WHERE a.user_id = v_user_id
    AND a.status IN ('completed', 'auto_submitted')
    AND a.submitted_at >= v_start_date;

    IF v_overall_answered > 0 THEN
        v_overall_accuracy := (v_overall_correct::FLOAT / v_overall_answered::FLOAT) * 100.0;
    END IF;

    -- 3. Daily Performance Trend (Accuracy by day)
    WITH daily_stats AS (
        SELECT 
            date_trunc('day', a.submitted_at) as attempt_day,
            SUM(a.correct_answers) as daily_correct,
            SUM(a.answered_questions) as daily_answered
        FROM attempts a
        WHERE a.user_id = v_user_id
        AND a.status IN ('completed', 'auto_submitted')
        AND a.submitted_at >= v_start_date
        GROUP BY date_trunc('day', a.submitted_at)
        ORDER BY attempt_day ASC
    )
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'date', attempt_day,
            'accuracy', CASE WHEN daily_answered > 0 THEN (daily_correct::FLOAT / daily_answered::FLOAT) * 100.0 ELSE 0 END,
            'answered', daily_answered
        )
    ), '[]'::jsonb) INTO v_trend
    FROM daily_stats;

    -- 4. Topic Performance (Aggregated across banks)
    -- We need to sum up across the view, wait, the view user_topic_performance
    -- already aggregates by topic per bank. We need to aggregate across banks.
    -- Wait, user_topic_performance does NOT have unanswered_attempts in its SELECT list currently.
    -- We only have total_attempts, correct_attempts, incorrect_attempts, distinct_questions_attempted, accuracy.
    -- So total answered = correct_attempts + incorrect_attempts
    WITH topic_stats AS (
        SELECT 
            topic,
            SUM(total_attempts) as attempts,
            SUM(correct_attempts) as correct,
            SUM(incorrect_attempts) as incorrect,
            SUM(distinct_questions_attempted) as distinct_questions,
            CASE WHEN SUM(correct_attempts + incorrect_attempts) > 0 
                 THEN (SUM(correct_attempts)::FLOAT / SUM(correct_attempts + incorrect_attempts)::FLOAT) * 100.0 
                 ELSE 0 
            END as accuracy
        FROM user_topic_performance
        WHERE user_id = v_user_id
        GROUP BY topic
        HAVING SUM(total_attempts) > 0
    )
    SELECT 
        COALESCE((
            SELECT jsonb_agg(row_to_json(t))
            FROM (
                SELECT * FROM topic_stats 
                ORDER BY accuracy DESC, attempts DESC 
                LIMIT 3
            ) t
        ), '[]'::jsonb),
        COALESCE((
            SELECT jsonb_agg(row_to_json(t))
            FROM (
                SELECT * FROM topic_stats 
                ORDER BY accuracy ASC, attempts DESC 
                LIMIT 3
            ) t
        ), '[]'::jsonb)
    INTO v_strong_topics, v_weak_topics;

    -- 5. Recent Activity
    SELECT COALESCE(jsonb_agg(row_to_json(recent_sub)), '[]'::jsonb) INTO v_recent_activity
    FROM (
        SELECT 
            a.id,
            t.title,
            t.mode,
            t.practice_mode,
            a.score,
            a.percentage,
            a.answered_questions,
            a.total_questions,
            a.submitted_at
        FROM attempts a
        JOIN tests t ON a.test_id = t.id
        WHERE a.user_id = v_user_id
        AND a.status IN ('completed', 'auto_submitted')
        ORDER BY a.submitted_at DESC
        LIMIT 5
    ) recent_sub;

    -- 6. Question Bank Summaries
    WITH bank_stats AS (
        SELECT 
            qb.id,
            qb.name,
            qb.question_count,
            COUNT(DISTINCT a.id) as tests_completed,
            COALESCE(AVG(a.percentage), 0) as avg_accuracy,
            MAX(a.submitted_at) as last_activity
        FROM question_banks qb
        LEFT JOIN tests t ON qb.id = t.question_bank_id
        LEFT JOIN attempts a ON t.id = a.test_id AND a.status IN ('completed', 'auto_submitted')
        WHERE qb.user_id = v_user_id
        GROUP BY qb.id, qb.name, qb.question_count
    )
    SELECT COALESCE(jsonb_agg(row_to_json(b)), '[]'::jsonb) INTO v_bank_summaries
    FROM bank_stats b;

    -- Return full dashboard payload
    RETURN json_build_object(
        'total_questions', v_total_questions,
        'questions_practiced', v_questions_practiced,
        'tests_completed', v_tests_completed,
        'overall_accuracy', v_overall_accuracy,
        'trend', v_trend,
        'strong_topics', v_strong_topics,
        'weak_topics', v_weak_topics,
        'recent_activity', v_recent_activity,
        'bank_summaries', v_bank_summaries
    )::JSONB;
END;
$$;


-- --------------------------------------------------------------------------
-- Section: 20240825000000_user_settings.sql
-- --------------------------------------------------------------------------

-- 1. Alter public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create public.user_preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    theme TEXT DEFAULT 'system',
    default_test_question_count INTEGER DEFAULT 20,
    default_test_timer INTEGER,
    randomize_questions BOOLEAN DEFAULT true,
    randomize_options BOOLEAN DEFAULT false,
    default_practice_question_count INTEGER DEFAULT 10,
    immediate_feedback BOOLEAN DEFAULT true,
    show_explanations BOOLEAN DEFAULT true,
    notification_preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
    ON public.user_preferences FOR SELECT
    USING ( auth.uid() = id );

CREATE POLICY "Users can insert their own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own preferences"
    ON public.user_preferences FOR UPDATE
    USING ( auth.uid() = id );

CREATE POLICY "Users can delete their own preferences"
    ON public.user_preferences FOR DELETE
    USING ( auth.uid() = id );

-- TRIGGER FOR UPDATED_AT on user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Update the handle_new_user trigger to populate both tables
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, display_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Insert into user_preferences
  INSERT INTO public.user_preferences (id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- --------------------------------------------------------------------------
-- Section: 20240828000000_add_gemini_api_key.sql
-- --------------------------------------------------------------------------

-- Migration: Add gemini_api_key column to public.user_preferences
-- Allows authenticated users to securely store and sync their own Google Gemini API key across devices.

ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS gemini_api_key TEXT;


-- --------------------------------------------------------------------------
-- Section: 20240828000001_create_avatars_bucket.sql
-- --------------------------------------------------------------------------

-- Migration: Create public 'avatars' storage bucket and policies
-- Run this in your Supabase SQL Editor if the 'avatars' bucket is missing.

-- 1. Create the 'avatars' bucket (Make public = true so avatar images can be loaded)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar." ON storage.objects;

-- 3. Policy: Anyone can view avatars (Public Access)
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- 4. Policy: Authenticated users can upload their own avatar
CREATE POLICY "Users can upload their own avatar."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. Policy: Users can update/overwrite their own avatar
CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 6. Policy: Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar."
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );


