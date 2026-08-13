import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { questionBankKeys } from "./keys";
import type { QuestionBank } from "@/types/domain";

interface CreateQuestionBankData {
  name: string;
  description?: string | null | undefined;
  subject?: string | null | undefined;
  topic?: string | null | undefined;
}

export function useCreateQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuestionBankData): Promise<QuestionBank> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data: created, error } = await (supabase as any)
        .from("question_banks")
        .insert({
          user_id: user.user.id,
          name: data.name,
          description: data.description || null,
          subject: data.subject || null,
          topic: data.topic || null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message || "Failed to create question bank");
      }

      return {
        id: created.id,
        ownerId: created.user_id,
        name: created.name,
        description: created.description,
        subject: created.subject,
        topic: created.topic,
        questionCount: created.question_count,
        createdAt: created.created_at,
        updatedAt: created.updated_at,
      };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: questionBankKeys.lists() });
      toast.success("Question bank created successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to create question bank");
    },
  });
}
