import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardMetrics } from "@/types/dashboard";

export function useDashboardMetrics(days: number = 30) {
  return useQuery({
    queryKey: ["dashboard-metrics", days],
    queryFn: async (): Promise<DashboardMetrics> => {
      try {
        const { data, error } = await supabase.rpc("get_dashboard_metrics", {
          p_days: days,
        });

        if (error) {
          console.warn("Dashboard metrics RPC failed, returning fallback data:", error);
          throw error;
        }

        return data as DashboardMetrics;
      } catch (err) {
        // Fallback to empty data if the RPC is missing or fails
        // This is a graceful degradation so the UI doesn't break
        return {
          total_questions: 0,
          questions_practiced: 0,
          tests_completed: 0,
          overall_accuracy: 0,
          trend: [],
          strong_topics: [],
          weak_topics: [],
          recent_activity: [],
          bank_summaries: [],
        };
      }
    },
  });
}
