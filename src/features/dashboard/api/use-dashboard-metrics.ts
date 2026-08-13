import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardMetrics } from "@/types/dashboard";

export function useDashboardMetrics(days: number = 30) {
  return useQuery({
    queryKey: ["dashboard-metrics", days],
    queryFn: async (): Promise<DashboardMetrics> => {
      const { data, error } = await supabase.rpc("get_dashboard_metrics", {
        p_days: days,
      });

      if (error) {
        throw error;
      }

      return data as DashboardMetrics;
    },
  });
}
