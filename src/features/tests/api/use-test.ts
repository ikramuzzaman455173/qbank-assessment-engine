import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { testKeys } from "./keys";
import type { Test, TestQuestion } from "@/types/domain";
import { isGuestSession, GUEST_QUESTIONS } from "@/features/auth/demo-guest-data";

export function useTest(id: string) {
  return useQuery({
    queryKey: testKeys.detail(id),
    queryFn: async () => {
      if (id.startsWith("demo-test-") || isGuestSession()) {
        const isSecond = id === "demo-test-2";
        return {
          id,
          ownerId: "guest-demo-user-id",
          questionBankId: isSecond ? "demo-bank-2" : "demo-bank-1",
          title: isSecond
            ? "Distributed Systems & Storage Assessment"
            : "React 19 & Full-Stack Core Test",
          mode: "custom",
          totalQuestions: 4,
          difficulty: isSecond ? "hard" : "mixed",
          topic: isSecond ? "Distributed Systems" : "React 19 & Architecture",
          source: null,
          timerEnabled: true,
          durationSeconds: 600,
          randomizeQuestions: false,
          randomizeOptions: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          bankName: isSecond
            ? "Computer Science & System Architecture"
            : "Full-Stack Web & React Engineering",
          questions: GUEST_QUESTIONS.slice(0, 4).map((q, idx) => ({
            id: `demo-tq-${idx + 1}`,
            testId: id,
            originalQuestionId: q.id,
            questionOrder: idx + 1,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            topic: q.topic,
            difficulty: q.difficulty,
            sourceReference: q.sourceReference,
            createdAt: q.createdAt,
          })),
        } as Test & { bankName?: string; questions: TestQuestion[] };
      }

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
