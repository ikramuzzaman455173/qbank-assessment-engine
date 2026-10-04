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

      // Mark any prior in_progress attempt for this test as abandoned
      await supabase
        .from("attempts")
        .update({ status: "abandoned" })
        .eq("test_id", testId)
        .eq("user_id", userData.user.id)
        .eq("status", "in_progress");

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
      void queryClient.invalidateQueries({ queryKey: attemptKeys.lists(variables.testId) });
      void queryClient.invalidateQueries({ queryKey: attemptKeys.all });
      void navigate({
        to: `/tests/${variables.testId}/attempt` as any,
        search: { attemptId } as any,
      });
    },
  });
}
