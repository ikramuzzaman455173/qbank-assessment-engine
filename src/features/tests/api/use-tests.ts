import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { testKeys } from "./keys";
import type { Test } from "@/types/domain";

export function useTests(bankId?: string) {
  return useQuery({
    queryKey: testKeys.list({ bankId }),
    queryFn: async () => {
      let query = supabase
        .from("tests")
        .select(`
          *,
          question_banks ( name )
        `)
        .order("created_at", { ascending: false });

      if (bankId) {
        query = query.eq("question_bank_id", bankId);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      // map snake_case to camelCase
      return (data || []).map((test: any) => ({
        id: test.id,
        ownerId: test.user_id,
        questionBankId: test.question_bank_id,
        title: test.title,
        mode: test.mode,
        totalQuestions: test.total_questions,
        difficulty: test.difficulty,
        topic: test.topic,
        source: test.source,
        timerEnabled: test.timer_enabled,
        durationSeconds: test.duration_seconds,
        randomizeQuestions: test.randomize_questions,
        randomizeOptions: test.randomize_options,
        createdAt: test.created_at,
        updatedAt: test.updated_at,
        bankName: test.question_banks?.name,
      })) as (Test & { bankName?: string })[];
    },
  });
}
