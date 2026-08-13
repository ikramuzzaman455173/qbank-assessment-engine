import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { attemptKeys } from "./keys";
import { useNavigate } from "@tanstack/react-router";

export interface SubmitAttemptArgs {
  attemptId: string;
  status: "completed" | "auto_submitted";
}

export function useSubmitAttempt() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ attemptId, status }: SubmitAttemptArgs) => {
      const { data, error } = await supabase.rpc("submit_attempt", {
        p_attempt_id: attemptId,
        p_status: status,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: attemptKeys.detail(variables.attemptId) });
      navigate({ to: `/attempts/${variables.attemptId}/result` as any });
    },
  });
}
