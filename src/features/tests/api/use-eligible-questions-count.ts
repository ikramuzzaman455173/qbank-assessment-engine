import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { QuestionDifficulty } from "@/types/domain";

import { isGuestSession, GUEST_QUESTIONS } from "@/features/auth/demo-guest-data";

interface EligibleCountArgs {
  bankId: string;
  difficulty?: QuestionDifficulty | "mixed" | null;
  topic?: string | null;
}

export function useEligibleQuestionsCount(args: EligibleCountArgs) {
  return useQuery({
    queryKey: ["eligible_questions_count", args, isGuestSession()],
    queryFn: async () => {
      if (args.bankId.startsWith("demo-bank-") || isGuestSession()) {
        let count = GUEST_QUESTIONS.length;
        if (args.difficulty && args.difficulty !== "mixed") {
          count = GUEST_QUESTIONS.filter((q) => q.difficulty === args.difficulty).length;
        }
        return count;
      }

      try {
        let query = supabase
          .from("questions")
          .select("id", { count: "exact", head: true })
          .eq("question_bank_id", args.bankId);

        if (args.difficulty && args.difficulty !== "mixed") {
          query = query.eq("difficulty", args.difficulty);
        }

        if (args.topic && args.topic.trim() !== "") {
          query = query.eq("topic", args.topic.trim());
        }

        const { count, error } = await query;

        if (error) throw new Error(error.message);

        return count || 0;
      } catch (err) {
        if (isGuestSession() || args.bankId.startsWith("demo-bank-")) {
          return GUEST_QUESTIONS.length;
        }
        throw err;
      }
    },
    enabled: !!args.bankId,
  });
}
