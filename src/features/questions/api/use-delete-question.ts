import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { questionKeys } from "./keys";
import { questionBankKeys } from "@/features/question-banks/api/keys";

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; bankId: string }) => {
      const { error } = await (supabase as any).from("questions").delete().eq("id", id);

      if (error) {
        throw new Error(error.message || "Failed to delete question");
      }
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      void queryClient.removeQueries({ queryKey: questionKeys.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: questionBankKeys.detail(variables.bankId) });
      void queryClient.invalidateQueries({ queryKey: questionBankKeys.lists() });
      toast.success("Question deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete question");
    },
  });
}
