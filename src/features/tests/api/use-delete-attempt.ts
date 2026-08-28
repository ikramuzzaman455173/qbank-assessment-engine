import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { attemptKeys } from "./keys";

export function useDeleteAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ attemptId, testId }: { attemptId: string; testId?: string }) => {
      const { error } = await supabase
        .from("attempts")
        .delete()
        .eq("id", attemptId);

      if (error) {
        throw new Error(error.message);
      }
      return { attemptId, testId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: attemptKeys.all });
      if (variables.testId) {
        queryClient.invalidateQueries({ queryKey: attemptKeys.lists(variables.testId) });
      }
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
    },
  });
}
