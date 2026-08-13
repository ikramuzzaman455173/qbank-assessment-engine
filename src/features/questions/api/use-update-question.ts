import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { questionKeys } from "./keys";
import type { QuestionDifficulty, CorrectAnswer } from "@/types/domain";

export interface UpdateQuestionData {
  id: string;
  bankId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswer;
  explanation?: string | null | undefined;
  difficulty?: QuestionDifficulty | null | undefined;
  topic?: string | null | undefined;
  sourceReference?: string | null | undefined;
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateQuestionData) => {
      const { error } = await (supabase as any)
        .from("questions")
        .update({
          question_text: data.questionText,
          option_a: data.optionA,
          option_b: data.optionB,
          option_c: data.optionC,
          option_d: data.optionD,
          correct_answer: data.correctAnswer,
          explanation: data.explanation || null,
          difficulty: data.difficulty || null,
          topic: data.topic || null,
          source_reference: data.sourceReference || null,
        })
        .eq("id", data.id);

      if (error) {
        throw new Error(error.message || "Failed to update question");
      }
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: questionKeys.detail(variables.id) });
      toast.success("Question updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update question");
    },
  });
}
