import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/common";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  pendingComponent: () => (
    <AppShell>
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingState label="Loading application..." />
      </div>
    </AppShell>
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
