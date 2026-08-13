import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { attemptKeys } from "./keys";
import { useNavigate } from "@tanstack/react-router";

export function useCreateAttempt() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ testId, totalQuestions }: { testId: string; totalQuestions: number }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("attempts")
        .insert({
          test_id: testId,
          user_id: userData.user.id,
          status: "in_progress",
          total_questions: totalQuestions,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data.id;
    },
    onSuccess: (attemptId, variables) => {
      queryClient.invalidateQueries({ queryKey: attemptKeys.lists(variables.testId) });
      navigate({ to: `/tests/${variables.testId}/attempt` as any });
    },
  });
}
