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
