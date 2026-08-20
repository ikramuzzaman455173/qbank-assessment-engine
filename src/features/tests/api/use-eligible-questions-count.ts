import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { QuestionDifficulty } from "@/types/domain";

interface EligibleCountArgs {
  bankId: string;
  difficulty?: QuestionDifficulty | "mixed" | null;
  topic?: string | null;
}

export function useEligibleQuestionsCount(args: EligibleCountArgs) {
  return useQuery({
    queryKey: ["eligible_questions_count", args],
    queryFn: async () => {
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
    },
    enabled: !!args.bankId,
  });
}
