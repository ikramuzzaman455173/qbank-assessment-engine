import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sourceKeys } from "./keys";
import type { UploadedSource } from "@/types/domain";

export function useCreateSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      sourceData: Omit<UploadedSource, "id" | "ownerId" | "createdAt" | "updatedAt">,
    ) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("uploaded_sources")
        .insert({
          user_id: user.user.id,
          question_bank_id: sourceData.bankId,
          file_name: sourceData.fileName,
          source_type: sourceData.kind,
          storage_path: sourceData.storagePath,
          file_size: sourceData.fileSize,
          status: sourceData.status,
          total_questions: sourceData.totalQuestions,
          imported_questions: sourceData.importedQuestions,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.question_bank_id) {
        queryClient.invalidateQueries({
          queryKey: sourceKeys.list(data.question_bank_id),
        });
      }
    },
  });
}
