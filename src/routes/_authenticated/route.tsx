import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/common";
import { supabase } from "@/integrations/supabase/client";
import { isGuestSession, GUEST_USER } from "@/features/auth/demo-guest-data";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // 0. Guest / Recruiter Demo session bypass
    if (isGuestSession()) {
      return { user: GUEST_USER };
    }

    // 1. Fast-path local session check (Instant, 0ms)
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.pathname + (location.searchStr ? location.searchStr : ""),
        },
      });
    }

    // 2. Validate with Supabase auth
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.pathname + (location.searchStr ? location.searchStr : ""),
        },
      });
    }

    return { user: data.user };
  },
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <LoadingState label="Verifying session..." />
    </div>
  ),
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
