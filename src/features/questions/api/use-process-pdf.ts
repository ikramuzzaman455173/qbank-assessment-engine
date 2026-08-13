import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProcessPdfArgs {
  storagePath: string;
}

export function useProcessPdf() {
  return useMutation({
    mutationFn: async ({ storagePath }: ProcessPdfArgs) => {
      const { data, error } = await supabase.functions.invoke("extract-mcqs", {
        body: { storagePath },
      });

      if (error) {
        throw new Error(error.message || "Failed to process PDF");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data.questions;
    },
  });
}
