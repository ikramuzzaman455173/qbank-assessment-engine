import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePracticeSummary() {
  return useQuery({
    queryKey: ["practice-summary"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");
      const userId = user.user.id;

      // In a real app we'd do a complex aggregation in an RPC. 
      // For this, we'll query the views we created.
      
      const { count: totalEligible, error: err1 } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });
        
      if (err1) throw err1;

      const { data: mistakesData, error: err2 } = await supabase
        .from('user_question_performance')
        .select('original_question_id')
        .eq('user_id', userId)
        .gt('incorrect_attempts', 0);
        
      if (err2) throw err2;

      const { data: unansweredData, error: err3 } = await supabase
        .from('user_question_performance')
        .select('original_question_id')
        .eq('user_id', userId)
        .gt('unanswered_attempts', 0);
        
      if (err3) throw err3;

      const { count: difficultCount, error: err4 } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('difficulty', 'hard');
        
      if (err4) throw err4;

      const { data: weakTopicsData, error: err5 } = await supabase
        .from('user_topic_performance')
        .select('topic')
        .eq('user_id', userId)
        .lt('accuracy', 70)
        .not('accuracy', 'is', null);
        
      if (err5) throw err5;

      return {
        totalEligible: totalEligible || 0,
        mistakesCount: mistakesData?.length || 0,
        unansweredCount: unansweredData?.length || 0,
        difficultCount: difficultCount || 0,
        weakTopicsCount: weakTopicsData?.length || 0,
      };
    }
  });
}
