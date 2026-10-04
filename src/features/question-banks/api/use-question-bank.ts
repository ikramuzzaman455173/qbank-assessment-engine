import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { questionBankKeys } from "./keys";
import type { QuestionBank } from "@/types/domain";
import { GUEST_BANKS } from "@/features/auth/demo-guest-data";

export function useQuestionBank(id: string) {
  return useQuery({
    queryKey: questionBankKeys.detail(id),
    queryFn: async (): Promise<QuestionBank> => {
      const demoBank = GUEST_BANKS.find((b) => b.id === id);
      if (demoBank) {
        return demoBank;
      }

      try {
        const { data, error } = await (supabase as any)
          .from("question_banks")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        return {
          id: data.id,
          ownerId: data.user_id,
          name: data.name,
          description: data.description,
          subject: data.subject,
          topic: data.topic,
          questionCount: data.question_count,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      } catch (err) {
        if (GUEST_BANKS[0]) return GUEST_BANKS[0];
        throw err;
      }
    },
    enabled: !!id,
  });
}
