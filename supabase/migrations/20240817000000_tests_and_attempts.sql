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
    EXECUTE FUNCTION moddatetime(updated_at);

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
    EXECUTE FUNCTION moddatetime(updated_at);

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
