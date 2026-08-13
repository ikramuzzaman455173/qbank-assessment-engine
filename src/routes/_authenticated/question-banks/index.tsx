import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/question-banks/")({
  head: () => ({
    meta: [
      { title: "Question Banks — QBank" },
      { name: "description", content: "Manage and organize your question collections." },
    ],
  }),
  component: QuestionBanksPage,
});

function QuestionBanksPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Question Banks"
        description="Manage and organize your question collections."
        actions={<Button>Create Question Bank</Button>}
      />

      <div className="rounded-lg border bg-card p-1">
        <EmptyState
          icon={BookOpen}
          title="No question banks found"
          description="You haven't created any question banks yet. Create your first bank to start organizing questions."
          action={<Button variant="outline">Create your first bank</Button>}
        />
      </div>
    </div>
  );
}
