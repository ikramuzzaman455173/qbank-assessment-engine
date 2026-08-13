import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/common";

export const Route = createFileRoute("/_authenticated/question-banks/$bankId")({
  head: () => ({
    meta: [
      { title: "Question Bank — QBank" },
      { name: "description", content: "Review and manage the questions inside a question bank." },
      { property: "og:title", content: "Question Bank — QBank" },
      {
        property: "og:description",
        content: "Review and manage the questions inside a question bank.",
      },
    ],
  }),
  component: QuestionBankDetailPage,
});

function QuestionBankDetailPage() {
  const { bankId } = Route.useParams();

  return (
    <>
      <PageHeader title="Question bank" description={`Bank reference: ${bankId}`} />
      <EmptyState
        icon={ClipboardList}
        title="Bank details coming next"
        description="Question listing, editing and import review will be built on this foundation."
      />
    </>
  );
}
