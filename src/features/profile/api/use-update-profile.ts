import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { profileKeys } from "./use-profile";
import type { Profile } from "@/types/domain";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!updates.id) throw new Error("Profile ID is required");

      const dbUpdates = {
        full_name: updates.fullName,
        display_name: updates.displayName,
        avatar_url: updates.avatarUrl,
        bio: updates.bio,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(dbUpdates)
        .eq("id", updates.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(variables.id as string) });
    },
  });
}
