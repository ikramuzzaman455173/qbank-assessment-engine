import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { questionKeys } from "./keys";
import type { Question } from "@/types/domain";

interface ImportQuestionsArgs {
  bankId: string;
  sourceId?: string;
  questions: Omit<
    Question,
    "id" | "ownerId" | "createdAt" | "updatedAt" | "bankId"
  >[];
}

export function useImportQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bankId, sourceId, questions }: ImportQuestionsArgs) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      // Format questions for bulk insert
      const questionsToInsert = questions.map((q) => ({
        question_bank_id: bankId,
        question_text: q.questionText,
        option_a: q.optionA,
        option_b: q.optionB,
        option_c: q.optionC,
        option_d: q.optionD,
        correct_answer: q.correctAnswer,
        explanation: q.explanation || null,
        difficulty: q.difficulty || null,
        topic: q.topic || null,
        source_reference: q.sourceReference || null,
      }));

      // 1. Insert questions
      const { data, error } = await supabase
        .from("questions")
        .insert(questionsToInsert)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      // 2. Update source record if applicable
      if (sourceId) {
        await supabase
          .from("uploaded_sources")
          .update({
            status: "completed",
            imported_questions: questionsToInsert.length,
          })
          .eq("id", sourceId);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(variables.bankId, {}), // Using an empty filters object for now or whatever is default
      });
      queryClient.invalidateQueries({
        queryKey: questionKeys.all,
      });
    },
  });
}
