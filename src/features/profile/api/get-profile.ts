import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/domain";

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!userId) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawData, error } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // No rows found
    throw error;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = rawData as any;
  if (!data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    displayName: data.display_name || data.full_name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    createdAt: data.created_at || new Date().toISOString(), // Fallback if missing
    updatedAt: data.updated_at || new Date().toISOString(), // Fallback if missing
  };
}
