import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/common";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — QBank" },
      { name: "description", content: "Understand your learning progress." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics & Progress"
        description="Understand your learning progress and mastery."
      />

      <div className="rounded-lg border bg-card p-1">
        <EmptyState
          icon={BarChart3}
          title="No analytics yet"
          description="Complete your first test to see detailed analytics and progress tracking."
        />
      </div>
    </div>
  );
}
