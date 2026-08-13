import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/common";
import { PracticeIndex } from "@/features/practice/components/practice-index";

export const Route = createFileRoute("/_authenticated/practice/")({
  head: () => ({
    meta: [
      { title: "Practice — QBank" },
      { name: "description", content: "Focused practice on your weak areas." },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Practice Mode"
        description="Focused practice based on your performance."
      />
      <PracticeIndex />
    </div>
  );
}
