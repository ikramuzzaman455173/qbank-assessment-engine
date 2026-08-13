import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { questionBankKeys } from "./keys";
import type { QuestionBank } from "@/types/domain";

interface UpdateQuestionBankData {
  id: string;
  name: string;
  description?: string | null | undefined;
  subject?: string | null | undefined;
  topic?: string | null | undefined;
}

export function useUpdateQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateQuestionBankData): Promise<QuestionBank> => {
      const { data: updated, error } = await (supabase as any)
        .from("question_banks")
        .update({
          name: data.name,
          description: data.description,
          subject: data.subject,
          topic: data.topic,
        })
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || "Failed to update question bank");
      }

      return {
        id: updated.id,
        ownerId: updated.user_id,
        name: updated.name,
        description: updated.description,
        subject: updated.subject,
        topic: updated.topic,
        questionCount: updated.question_count,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      };
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: questionBankKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: questionBankKeys.detail(data.id) });
      toast.success("Question bank updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update question bank");
    },
  });
}
