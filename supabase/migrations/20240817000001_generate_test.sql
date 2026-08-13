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
    SELECT * FROM questions
    WHERE bank_id = p_bank_id
    AND owner_id = v_user_id
    AND (p_difficulty IS NULL OR p_difficulty = 'mixed' OR difficulty = p_difficulty)
    AND (p_topic IS NULL OR p_topic = '' OR topic = p_topic);
    -- Source filter requires joining with uploaded_sources but questions table doesn't track source directly,
    -- except via source_reference maybe? We will ignore source filter for now as it's complex 
    -- without a direct link, or we assume all are eligible if source filter is not implemented on question table.

    SELECT COUNT(*) INTO v_available_count FROM tmp_eligible_questions;

    IF v_available_count < p_total_questions THEN
        RAISE EXCEPTION 'Insufficient questions. Requested % but only % available matching filters.', p_total_questions, v_available_count;
    END IF;

    -- Insert Test
    INSERT INTO tests (
        user_id, question_bank_id, title, mode, total_questions, difficulty, topic, source,
        timer_enabled, duration_seconds, randomize_questions, randomize_options
    ) VALUES (
        v_user_id, p_bank_id, p_title, p_mode, LEAST(p_total_questions, v_available_count), p_difficulty, p_topic, p_source,
        p_timer_enabled, p_duration_seconds, p_randomize_questions, p_randomize_options
    ) RETURNING id INTO v_test_id;

    -- Insert Test Questions (Snapshot)
    -- We can use ORDER BY random() to shuffle if p_randomize_questions or if p_mode = 'random'
    -- Actually if p_mode = 'random', we definitely want a random sample.
    -- If p_mode = 'full', we take all.
    -- If p_mode = 'custom', we take N random.
    
    INSERT INTO test_questions (
        test_id, original_question_id, question_order,
        question_text, option_a, option_b, option_c, option_d, correct_answer,
        explanation, topic, difficulty, source_reference
    )
    SELECT
        v_test_id, id, row_number() over (ORDER BY CASE WHEN p_mode IN ('random', 'custom') THEN random() ELSE id::text::float END),
        question_text, option_a, option_b, option_c, option_d, correct_answer,
        explanation, topic, difficulty, source_reference
    FROM tmp_eligible_questions
    ORDER BY CASE WHEN p_mode IN ('random', 'custom') THEN random() ELSE id::text::float END
    LIMIT p_total_questions;

    RETURN v_test_id;
END;
$$;
