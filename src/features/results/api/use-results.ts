import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isGuestSession, GUEST_RESULTS } from "@/features/auth/demo-guest-data";

export interface TestResultItem {
  id: string; // attempt id
  testId: string;
  title: string;
  bankName: string;
  subject?: string;
  topic?: string;
  mode: string;
  score: number;
  percentage: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  timeSpentSeconds?: number;
  startedAt: string;
  submittedAt: string;
  status: string;
}

export function useResults() {
  return useQuery({
    queryKey: ["test-results"],
    queryFn: async (): Promise<TestResultItem[]> => {
      if (isGuestSession()) {
        return GUEST_RESULTS;
      }

      try {
        const { data, error } = await supabase
          .from("attempts")
          .select(
            `
            id,
            test_id,
            user_id,
            status,
            started_at,
            submitted_at,
            time_spent_seconds,
            total_questions,
            answered_questions,
            correct_answers,
            incorrect_answers,
            unanswered_questions,
            score,
            percentage,
            tests (
              id,
              title,
              mode,
              topic,
              difficulty,
              question_banks (
                name,
                subject
              )
            )
          `,
          )
          .in("status", ["completed", "auto_submitted"])
          .order("submitted_at", { ascending: false });

        if (error) {
          console.warn("Error fetching results from Supabase:", error.message);
          return GUEST_RESULTS;
        }

        if (!data || data.length === 0) {
          return [];
        }

        return data.map((item: any) => {
          const test = item.tests;
          const bank = test?.question_banks;
          return {
            id: item.id,
            testId: item.test_id,
            title: test?.title || "Assessment",
            bankName: bank?.name || "General Question Bank",
            subject: bank?.subject,
            topic: test?.topic || "General",
            mode: test?.mode || "standard",
            score: item.score ?? item.correct_answers ?? 0,
            percentage: Math.round(item.percentage ?? 0),
            totalQuestions: item.total_questions,
            answeredQuestions: item.answered_questions,
            correctAnswers: item.correct_answers ?? 0,
            incorrectAnswers: item.incorrect_answers ?? 0,
            unansweredQuestions: item.unanswered_questions ?? 0,
            timeSpentSeconds: item.time_spent_seconds,
            startedAt: item.started_at,
            submittedAt: item.submitted_at || item.created_at,
            status: item.status,
          };
        });
      } catch (err) {
        console.warn("Failed to fetch results, falling back:", err);
        return GUEST_RESULTS;
      }
    },
  });
}
