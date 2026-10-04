import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { questionKeys } from "./keys";
import type { Question, Paginated } from "@/types/domain";

import { isGuestSession, GUEST_QUESTIONS } from "@/features/auth/demo-guest-data";

export interface QuestionFilters {
  searchQuery?: string | undefined;
  difficulty?: string | undefined;
  topic?: string | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}

export function useQuestions(bankId?: string, filters: QuestionFilters = {}) {
  const { page = 1, pageSize = 20, searchQuery, difficulty, topic } = filters;

  return useQuery({
    queryKey: [...questionKeys.list(bankId ?? "", filters), isGuestSession()],
    queryFn: async (): Promise<Paginated<Question>> => {
      if (!bankId) return { items: [], total: 0, page: 1, pageSize: 20 };

      if (bankId.startsWith("demo-bank-") || isGuestSession()) {
        let filtered = [...GUEST_QUESTIONS];
        if (searchQuery) {
          filtered = filtered.filter((q) =>
            q.questionText.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }
        if (difficulty && difficulty !== "all") {
          filtered = filtered.filter((q) => q.difficulty === difficulty);
        }
        if (topic && topic !== "all") {
          filtered = filtered.filter((q) => q.topic === topic);
        }
        const from = (page - 1) * pageSize;
        const items = filtered.slice(from, from + pageSize);
        return {
          items,
          page,
          pageSize,
          total: filtered.length,
        };
      }

      try {
        let query = (supabase as any)
          .from("questions")
          .select("*", { count: "exact" })
          .eq("question_bank_id", bankId)
          .order("created_at", { ascending: false });

        if (searchQuery) {
          query = query.ilike("question_text", `%${searchQuery}%`);
        }
        if (difficulty && difficulty !== "all") {
          query = query.eq("difficulty", difficulty);
        }
        if (topic && topic !== "all") {
          query = query.eq("topic", topic);
        }

        // Pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        if (error) throw error;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = (data as any[]).map((row) => ({
          id: row.id,
          ownerId: "", // Implicitly owned by bank owner
          bankId: row.question_bank_id,
          questionText: row.question_text,
          optionA: row.option_a,
          optionB: row.option_b,
          optionC: row.option_c,
          optionD: row.option_d,
          correctAnswer: row.correct_answer,
          explanation: row.explanation,
          difficulty: row.difficulty,
          topic: row.topic,
          sourceReference: row.source_reference,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));

        return {
          items,
          page,
          pageSize,
          total: count || 0,
        };
      } catch (err) {
        if (isGuestSession() || bankId.startsWith("demo-bank-")) {
          return { items: GUEST_QUESTIONS, page: 1, pageSize: 20, total: GUEST_QUESTIONS.length };
        }
        throw err;
      }
    },
    enabled: !!bankId,
  });
}
