import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { testKeys } from "./keys";
import type { TestMode, QuestionDifficulty } from "@/types/domain";

export interface CreateTestArgs {
  bankId: string;
  title: string;
  mode: TestMode;
  totalQuestions: number;
  difficulty?: QuestionDifficulty | "mixed" | null;
  topic?: string | null;
  source?: string | null;
  timerEnabled: boolean;
  durationSeconds?: number | null;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

export function useCreateTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: CreateTestArgs) => {
      const { data, error } = await supabase.rpc("generate_test", {
        p_bank_id: args.bankId,
        p_title: args.title,
        p_mode: args.mode,
        p_total_questions: args.totalQuestions,
        p_difficulty: args.difficulty || null,
        p_topic: args.topic || null,
        p_source: args.source || null,
        p_timer_enabled: args.timerEnabled,
        p_duration_seconds: args.durationSeconds || null,
        p_randomize_questions: args.randomizeQuestions,
        p_randomize_options: args.randomizeOptions,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data as string; // returns UUID of the created test
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testKeys.all });
    },
  });
}
