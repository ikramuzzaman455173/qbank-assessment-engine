import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ClipboardList, Target, TrendingUp } from "lucide-react";

import { EmptyState, PageHeader, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — QBank" },
      { name: "description", content: "Your study overview: banks, tests, practice and mastery." },
      { property: "og:title", content: "Dashboard — QBank" },
      {
        property: "og:description",
        content: "Your study overview: banks, tests, practice and mastery.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A quick overview of your question banks, tests and progress."
        actions={
          <Button asChild>
            <Link to={ROUTES.questionBanks}>Manage question banks</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Question banks"
          value="—"
          icon={BookOpen}
          hint="Connected in a later step"
        />
        <StatCard
          label="Questions"
          value="—"
          icon={ClipboardList}
          hint="Connected in a later step"
        />
        <StatCard label="Tests taken" value="—" icon={Target} hint="Connected in a later step" />
        <StatCard label="Mastery" value="—" icon={TrendingUp} hint="Connected in a later step" />
      </div>

      <EmptyState
        icon={BookOpen}
        title="No activity yet"
        description="Once you create a question bank and add questions, your recent activity will appear here."
        action={
          <Button asChild variant="outline">
            <Link to={ROUTES.questionBanks}>Create your first bank</Link>
          </Button>
        }
      />
    </>
  );
}
