import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { attemptKeys } from "./keys";
import type { CorrectAnswer } from "@/types/domain";

interface SaveAnswerArgs {
  attemptId: string;
  testQuestionId: string;
  selectedAnswer?: CorrectAnswer | null;
  isMarkedForReview?: boolean;
}

export function useSaveAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: SaveAnswerArgs) => {
      // Upsert using the unique constraint on (attempt_id, test_question_id)
      const { data, error } = await supabase
        .from("attempt_answers")
        .upsert(
          {
            attempt_id: args.attemptId,
            test_question_id: args.testQuestionId,
            selected_answer: args.selectedAnswer,
            is_marked_for_review: args.isMarkedForReview ?? false,
            answered_at: new Date().toISOString(),
          },
          {
            onConflict: "attempt_id, test_question_id",
          }
        )
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate specific attempt to refetch answers
      queryClient.invalidateQueries({ queryKey: attemptKeys.detail(variables.attemptId) });
    },
  });
}
