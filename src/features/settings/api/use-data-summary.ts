import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/features/auth/hooks/use-session";
import type { DataSummary } from "../types";

export function useDataSummary() {
  const { user } = useSession();

  return useQuery<DataSummary | null, Error>({
    queryKey: ["data_summary", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Execute counts in parallel
      const [
        { count: banksCount },
        { count: questionsCount },
        { count: testsCount },
        { count: attemptsCount },
      ] = await Promise.all([
        supabase.from("question_banks").select("*", { count: "exact", head: true }),
        supabase.from("questions").select("*", { count: "exact", head: true }),
        supabase.from("tests").select("*", { count: "exact", head: true }),
        supabase.from("attempts").select("*", { count: "exact", head: true }),
      ]);

      return {
        questionBanks: banksCount || 0,
        questions: questionsCount || 0,
        tests: testsCount || 0,
        attempts: attemptsCount || 0,
        practiceSessions: 0, // Placeholder if practice sessions table is not separate
      };
    },
    enabled: !!user,
  });
}
