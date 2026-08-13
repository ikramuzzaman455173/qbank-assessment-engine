import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");
      const userId = user.user.id;

      // Get total banks
      const { count: banksCount, error: banksErr } = await supabase
        .from('question_banks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (banksErr) throw banksErr;

      // Get total questions
      const { count: questionsCount, error: questionsErr } = await supabase
        .from('questions')
        .select('*, question_banks!inner(*)', { count: 'exact', head: true })
        .eq('question_banks.user_id', userId);
      if (questionsErr) throw questionsErr;

      // Get total tests taken (attempts)
      const { count: attemptsCount, error: attemptsErr } = await supabase
        .from('attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['completed', 'auto_submitted']);
      if (attemptsErr) throw attemptsErr;

      // Calculate mastery (average accuracy across all questions attempted by user)
      const { data: qStats, error: qStatsErr } = await supabase
        .from('user_question_performance')
        .select('accuracy')
        .eq('user_id', userId)
        .not('accuracy', 'is', null);
      if (qStatsErr) throw qStatsErr;

      let mastery = 0;
      if (qStats && qStats.length > 0) {
        const sum = qStats.reduce((acc, curr) => acc + (curr.accuracy || 0), 0);
        mastery = sum / qStats.length;
      }

      return {
        banksCount: banksCount || 0,
        questionsCount: questionsCount || 0,
        attemptsCount: attemptsCount || 0,
        mastery: qStats?.length ? Math.round(mastery) : null,
      };
    }
  });
}
