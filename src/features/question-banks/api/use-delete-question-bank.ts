import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { questionBankKeys } from "./keys";

export function useDeleteQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("question_banks").delete().eq("id", id);

      if (error) {
        throw new Error(error.message || "Failed to delete question bank");
      }
    },
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: questionBankKeys.lists() });
      void queryClient.removeQueries({ queryKey: questionBankKeys.detail(id) });
      toast.success("Question bank deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete question bank");
    },
  });
}
