import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { questionBankKeys } from "./keys";
import type { QuestionBank } from "@/types/domain";
import { useSession } from "@/features/auth/hooks/use-session";
import { isGuestSession, GUEST_BANKS } from "@/features/auth/demo-guest-data";

export function useQuestionBanks(searchQuery: string = "") {
  const { user } = useSession();

  return useQuery({
    queryKey: [...questionBankKeys.list(searchQuery), isGuestSession()],
    queryFn: async (): Promise<QuestionBank[]> => {
      if (isGuestSession()) {
        if (!searchQuery) return GUEST_BANKS;
        return GUEST_BANKS.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      try {
        let query = (supabase as any)
          .from("question_banks")
          .select("*")
          .order("created_at", { ascending: false });

        if (searchQuery) {
          query = query.ilike("name", `%${searchQuery}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (data as any[]).map((row) => ({
          id: row.id,
          ownerId: row.user_id,
          name: row.name,
          description: row.description,
          subject: row.subject,
          topic: row.topic,
          questionCount: row.question_count,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      } catch (err) {
        if (isGuestSession()) {
          return GUEST_BANKS;
        }
        throw err;
      }
    },
    enabled: !!user?.id || isGuestSession(),
  });
}
