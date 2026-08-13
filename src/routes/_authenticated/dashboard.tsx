import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ClipboardList, Target, TrendingUp } from "lucide-react";

import { EmptyState, PageHeader, StatCard, LoadingState } from "@/components/common";
import { useProfile } from "@/features/profile/api/use-profile";
import { useDashboardStats } from "@/features/practice/api/use-dashboard-stats";

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
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
  
  const greeting = profile?.displayName ? `Welcome back, ${profile.displayName}!` : "Welcome back!";

  return (
    <div className="space-y-8">
      <PageHeader
        title={greeting}
        description="Here is an overview of your recent study activity and progress."
      />

      {isStatsLoading ? (
        <LoadingState label="Loading dashboard stats..." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Question Banks"
            value={stats?.banksCount?.toString() || "0"}
            icon={BookOpen}
            hint="Total banks created"
          />
          <StatCard
            label="Total Questions"
            value={stats?.questionsCount?.toString() || "0"}
            icon={ClipboardList}
            hint="Total questions available"
          />
          <StatCard 
            label="Tests Taken" 
            value={stats?.attemptsCount?.toString() || "0"} 
            icon={Target} 
            hint="Completed attempts" 
          />
          <StatCard 
            label="Mastery Level" 
            value={stats?.mastery !== null ? `${stats?.mastery}%` : "—"} 
            icon={TrendingUp} 
            hint={stats?.mastery !== null ? "Average accuracy" : "Insufficient data"} 
          />
        </div>
      )}

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
