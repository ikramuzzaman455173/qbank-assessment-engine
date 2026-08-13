import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/practice")({
  head: () => ({
    meta: [
      { title: "Practice — QBank" },
      { name: "description", content: "Practice questions based on your progress." },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Practice Mode"
        description="Focused practice on your weak questions and spaced repetition."
      />

      <div className="rounded-lg border bg-card p-1">
        <EmptyState
          icon={Target}
          title="Not enough data"
          description="You need to complete some tests or review questions before practice mode can generate sessions for you."
          action={<Button variant="outline">Go to Question Banks</Button>}
        />
      </div>
    </div>
  );
}
