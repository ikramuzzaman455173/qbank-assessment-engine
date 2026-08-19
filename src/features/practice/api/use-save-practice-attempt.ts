import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Question } from "@/types/domain";
import { attemptKeys } from "@/features/tests/api/keys";

interface SavePracticeAttemptArgs {
  bankId?: string;
  questions: Question[];
  userAnswers: Record<string, string>;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timerEnabled?: boolean;
  durationMinutes?: number;
  startedAt?: string;
}

export function useSavePracticeAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bankId,
      questions,
      userAnswers,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      timerEnabled = false,
      durationMinutes = 10,
      startedAt,
    }: SavePracticeAttemptArgs) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      const userId = userData.user.id;

      const durationSeconds = timerEnabled ? durationMinutes * 60 : null;

      // 1. Create a Test entry in the tests table (mode = 'practice')
      const { data: testData, error: testError } = await supabase
        .from("tests")
        .insert({
          user_id: userId,
          question_bank_id: bankId || questions[0]?.bankId,
          title: `Practice Session (${new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })})`,
          mode: "practice",
          total_questions: questions.length,
          timer_enabled: timerEnabled,
          duration_seconds: durationSeconds,
          randomize_questions: false,
          randomize_options: false,
        })
        .select("id")
        .single();

      if (testError || !testData) {
        console.warn("Could not create practice test record:", testError);
        return null;
      }
      const testId = testData.id;

      // 2. Insert Test Questions snapshot
      const testQuestionsPayload = questions.map((q, idx) => ({
        test_id: testId,
        original_question_id: q.id,
        question_order: idx + 1,
        question_text: q.questionText,
        option_a: q.optionA,
        option_b: q.optionB,
        option_c: q.optionC,
        option_d: q.optionD,
        correct_answer: q.correctAnswer,
        explanation: q.explanation || null,
        topic: q.topic || null,
        difficulty: q.difficulty || null,
        source_reference: q.sourceReference || null,
      }));

      const { data: insertedQuestions, error: tqError } = await supabase
        .from("test_questions")
        .insert(testQuestionsPayload)
        .select("id, original_question_id, correct_answer");

      if (tqError || !insertedQuestions) {
        console.warn("Could not insert practice test questions:", tqError);
        return null;
      }

      // 3. Insert Completed Attempt record
      const startIso = startedAt || new Date(Date.now() - 60000).toISOString();
      const timeSpent = Math.max(1, Math.floor((Date.now() - new Date(startIso).getTime()) / 1000));

      const { data: attemptData, error: attemptError } = await supabase
        .from("attempts")
        .insert({
          test_id: testId,
          user_id: userId,
          status: "completed",
          started_at: startIso,
          submitted_at: new Date().toISOString(),
          time_spent_seconds: timeSpent,
          total_questions: questions.length,
          answered_questions: questions.length - unansweredCount,
          correct_answers: correctCount,
          incorrect_answers: incorrectCount,
          unanswered_questions: unansweredCount,
          score: correctCount,
          percentage: percentage,
        })
        .select("id")
        .single();

      if (attemptError || !attemptData) {
        console.warn("Could not insert practice attempt record:", attemptError);
        return null;
      }
      const attemptId = attemptData.id;

      // 4. Insert Attempt Answers
      const questionMap = new Map(insertedQuestions.map((q) => [q.original_question_id, q]));
      const answersPayload = questions
        .map((q, idx) => {
          const qKey = q.id || String(idx);
          const selectedAnswer = userAnswers[qKey] || null;
          const isCorrect = selectedAnswer ? selectedAnswer === q.correctAnswer : null;
          const tq = questionMap.get(q.id);

          if (!tq) return null;
          return {
            attempt_id: attemptId,
            test_question_id: tq.id,
            selected_answer: selectedAnswer,
            is_correct: isCorrect,
            is_marked_for_review: false,
            answered_at: selectedAnswer ? new Date().toISOString() : null,
          };
        })
        .filter(Boolean);

      if (answersPayload.length > 0) {
        await supabase.from("attempt_answers").insert(answersPayload as any);
      }

      return { testId, attemptId };
    },
    onSuccess: () => {
      // Invalidate dashboard metrics and attempt lists so UI updates everywhere
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      queryClient.invalidateQueries({ queryKey: attemptKeys.all });
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
}
