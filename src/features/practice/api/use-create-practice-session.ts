import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";

interface CreatePracticeArgs {
  bankId: string;
  practiceMode: string;
  totalQuestions: number;
  topic?: string | null;
  difficulty?: string | null;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

export function useCreatePracticeSession() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (args: CreatePracticeArgs) => {
      const { data, error } = await supabase.rpc("generate_practice_test", {
        p_question_bank_id: args.bankId,
        p_practice_mode: args.practiceMode,
        p_num_questions: args.totalQuestions,
        p_topic: args.topic || null,
        p_difficulty: args.difficulty || null,
        p_randomize_questions: args.randomizeQuestions,
        p_randomize_options: args.randomizeOptions,
      });

      if (error) throw error;
      
      const result = data as { success: boolean; test_id?: string; message?: string; questions_added?: number };
      
      if (!result.success) {
        throw new Error(result.message || "Failed to generate practice session");
      }
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Automatically create an attempt for the practice session
      const { data: attemptData, error: attemptError } = await supabase
        .from("attempts")
        .insert({
          test_id: result.test_id,
          user_id: userData.user.id,
          status: "in_progress",
          total_questions: result.questions_added,
        })
        .select("id")
        .single();

      if (attemptError) throw attemptError;

      return { testId: result.test_id!, attemptId: attemptData.id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
      // Redirect to test attempt directly for practice
      navigate({ to: ROUTES.attemptTest(result.testId) });
    },
  });
}
