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
