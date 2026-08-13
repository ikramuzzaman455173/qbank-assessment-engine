import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useBankPerformance(bankId: string) {
  return useQuery({
    queryKey: ["bank-performance", bankId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");
      const userId = user.user.id;

      // 1. Overall stats from attempts
      const { data: attempts, error: err1 } = await supabase
        .from('attempts')
        .select(`
          id, score, percentage, total_questions, answered_questions, correct_answers, incorrect_answers, unanswered_questions,
          tests!inner ( question_bank_id )
        `)
        .eq('tests.question_bank_id', bankId)
        .in('status', ['completed', 'auto_submitted']);

      if (err1) throw err1;

      const totalAttempts = attempts?.length || 0;
      const avgAccuracy = attempts?.length 
        ? attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / attempts.length 
        : null;

      // 2. Topic performance
      const { data: topics, error: err2 } = await supabase
        .from('user_topic_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('question_bank_id', bankId);
        
      if (err2) throw err2;

      // 3. Difficulty performance
      const { data: difficulties, error: err3 } = await supabase
        .from('user_difficulty_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('question_bank_id', bankId);
        
      if (err3) throw err3;

      // 4. Overall Question counts
      const { data: qStats, error: err4 } = await supabase
        .from('user_question_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('question_bank_id', bankId);

      if (err4) throw err4;

      const attemptedQuestions = qStats?.length || 0;
      const masteredQuestions = qStats?.filter(q => (q.accuracy || 0) >= 80 && (q.total_attempts || 0) >= 2).length || 0;
      const weakQuestions = qStats?.filter(q => (q.accuracy || 0) < 70 && (q.total_attempts || 0) >= 1).length || 0;

      return {
        totalAttempts,
        avgAccuracy,
        topics: topics || [],
        difficulties: difficulties || [],
        attemptedQuestions,
        masteredQuestions,
        weakQuestions,
      };
    }
  });
}
