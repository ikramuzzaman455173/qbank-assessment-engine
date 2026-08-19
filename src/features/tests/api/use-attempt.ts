import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { attemptKeys } from "./keys";
import type { Attempt, AttemptAnswer } from "@/types/domain";

export function useCurrentAttempt(testId: string) {
  return useQuery({
    queryKey: [...attemptKeys.lists(testId), "current"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attempts")
        .select("*")
        .eq("test_id", testId)
        .eq("status", "in_progress")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;

      return {
        id: data.id,
        ownerId: data.user_id,
        testId: data.test_id,
        status: data.status,
        startedAt: data.started_at,
        submittedAt: data.submitted_at,
        timeSpentSeconds: data.time_spent_seconds,
        totalQuestions: data.total_questions,
        answeredQuestions: data.answered_questions,
        correctAnswers: data.correct_answers,
        incorrectAnswers: data.incorrect_answers,
        unansweredQuestions: data.unanswered_questions,
        score: data.score,
        percentage: data.percentage,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Attempt;
    },
    enabled: !!testId,
  });
}

export function useTestAttempts(testId: string) {
  return useQuery({
    queryKey: [...attemptKeys.lists(testId), "history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attempts")
        .select("*")
        .eq("test_id", testId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return (data || []).map((item) => ({
        id: item.id,
        ownerId: item.user_id,
        testId: item.test_id,
        status: item.status,
        startedAt: item.started_at,
        submittedAt: item.submitted_at,
        timeSpentSeconds: item.time_spent_seconds,
        totalQuestions: item.total_questions,
        answeredQuestions: item.answered_questions,
        correctAnswers: item.correct_answers,
        incorrectAnswers: item.incorrect_answers,
        unansweredQuestions: item.unanswered_questions,
        score: item.score,
        percentage: item.percentage,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })) as Attempt[];
    },
    enabled: !!testId,
  });
}

export function useAttempt(attemptId: string) {
  return useQuery({
    queryKey: attemptKeys.detail(attemptId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attempts")
        .select(`
          *,
          attempt_answers (*)
        `)
        .eq("id", attemptId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;

      const attempt: Attempt & { answers: AttemptAnswer[] } = {
        id: data.id,
        ownerId: data.user_id,
        testId: data.test_id,
        status: data.status,
        startedAt: data.started_at,
        submittedAt: data.submitted_at,
        timeSpentSeconds: data.time_spent_seconds,
        totalQuestions: data.total_questions,
        answeredQuestions: data.answered_questions,
        correctAnswers: data.correct_answers,
        incorrectAnswers: data.incorrect_answers,
        unansweredQuestions: data.unanswered_questions,
        score: data.score,
        percentage: data.percentage,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        answers: (data.attempt_answers || []).map((ans: any) => ({
          id: ans.id,
          attemptId: ans.attempt_id,
          testQuestionId: ans.test_question_id,
          selectedAnswer: ans.selected_answer,
          isCorrect: ans.is_correct,
          isMarkedForReview: ans.is_marked_for_review,
          answeredAt: ans.answered_at,
        })),
      };

      return attempt;
    },
    enabled: !!attemptId,
  });
}
