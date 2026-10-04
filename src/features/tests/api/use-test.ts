import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { testKeys } from "./keys";
import type { Test, TestQuestion } from "@/types/domain";

export function useTest(id: string) {
  return useQuery({
    queryKey: testKeys.detail(id),
    queryFn: async () => {
      // Fetch test details and its test_questions
      const { data, error } = await supabase
        .from("tests")
        .select(
          `
          *,
          question_banks ( name ),
          test_questions (
            id,
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
            source_reference,
            created_at
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);

      const testData: Test & { bankName?: string; questions: TestQuestion[] } = {
        id: data.id,
        ownerId: data.user_id,
        questionBankId: data.question_bank_id,
        title: data.title,
        mode: data.mode,
        totalQuestions: data.total_questions,
        difficulty: data.difficulty,
        topic: data.topic,
        source: data.source,
        timerEnabled: data.timer_enabled,
        durationSeconds: data.duration_seconds,
        randomizeQuestions: data.randomize_questions,
        randomizeOptions: data.randomize_options,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        bankName: data.question_banks?.name,
        questions: ((data as any).test_questions || [])
          .sort((a: any, b: any) => a.question_order - b.question_order)
          .map((q: any) => ({
            id: q.id,
            testId: q.test_id,
            originalQuestionId: q.original_question_id,
            questionOrder: q.question_order,
            questionText: q.question_text,
            optionA: q.option_a,
            optionB: q.option_b,
            optionC: q.option_c,
            optionD: q.option_d,
            correctAnswer: q.correct_answer,
            explanation: q.explanation,
            topic: q.topic,
            difficulty: q.difficulty,
            sourceReference: q.source_reference,
            createdAt: q.created_at,
          })),
      };

      return testData;
    },
    enabled: !!id,
  });
}
