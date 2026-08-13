import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/features/auth/hooks/use-session";
import { getProfile } from "./get-profile";
import type { Profile } from "@/types/domain";

export const profileKeys = {
  all: ["profile"] as const,
  detail: (id: string) => [...profileKeys.all, id] as const,
};

export function useProfile() {
  const { user } = useSession();

  return useQuery<Profile | null, Error>({
    queryKey: profileKeys.detail(user?.id || "unauthenticated"),
    queryFn: () => getProfile(user?.id as string),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
