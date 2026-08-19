import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserPreferences } from "../types";
import { useSession } from "@/features/auth/hooks/use-session";

export function usePreferences() {
  const { user } = useSession();

  return useQuery({
    queryKey: ["user_preferences", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
        
      if (error) {
        console.warn("Preferences fetch warning:", error.message);
      }

      if (!data) {
        // Return default preferences gracefully if no record exists yet
        return {
          id: user.id,
          theme: "system",
          default_test_question_count: 20,
          default_test_timer: null,
          randomize_questions: true,
          randomize_options: false,
          default_practice_question_count: 10,
          immediate_feedback: true,
          show_explanations: true,
          notification_preferences: {},
        } as UserPreferences;
      }
      return data as UserPreferences;
    },
    enabled: !!user,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  const { user } = useSession();

  return useMutation({
    mutationFn: async (updates: Partial<UserPreferences>) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("user_preferences")
        .upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_preferences", user?.id] });
    },
  });
}
