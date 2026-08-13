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
