import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ClipboardList, Target, TrendingUp } from "lucide-react";

import { EmptyState, PageHeader, StatCard } from "@/components/common";
import { useProfile } from "@/features/profile/api/use-profile";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — QBank" },
      { name: "description", content: "Your study overview: banks, tests, practice and mastery." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data: profile } = useProfile();
  const greeting = profile?.displayName ? `Welcome back, ${profile.displayName}!` : "Welcome back!";

  return (
    <div className="space-y-8">
      <PageHeader
        title={greeting}
        description="Here is an overview of your recent study activity and progress."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Question Banks"
          value="—"
          icon={BookOpen}
          hint="Create a bank to get started"
        />
        <StatCard
          label="Total Questions"
          value="—"
          icon={ClipboardList}
          hint="Waiting for content"
        />
        <StatCard label="Tests Taken" value="—" icon={Target} hint="No tests completed" />
        <StatCard label="Mastery Level" value="—" icon={TrendingUp} hint="Insufficient data" />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
        <div className="rounded-lg border bg-card p-1">
          <EmptyState
            icon={Target}
            title="No recent activity"
            description="You haven't taken any tests or practiced recently. Once you do, your activity will appear here."
          />
        </div>
      </div>
    </div>
  );
}
