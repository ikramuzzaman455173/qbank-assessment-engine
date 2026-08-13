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
