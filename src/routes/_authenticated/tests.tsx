import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/tests")({
  head: () => ({
    meta: [
      { title: "Tests — QBank" },
      { name: "description", content: "Create and review your practice tests." },
    ],
  }),
  component: TestsPage,
});

function TestsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Tests"
        description="Create and review your practice tests."
        actions={<Button>Generate Test</Button>}
      />

      <div className="rounded-lg border bg-card p-1">
        <EmptyState
          icon={ClipboardList}
          title="No tests available"
          description="You haven't generated or taken any tests yet."
          action={<Button variant="outline">Generate your first test</Button>}
        />
      </div>
    </div>
  );
}
