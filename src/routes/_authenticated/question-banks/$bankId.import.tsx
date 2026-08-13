import { createFileRoute } from "@tanstack/react-router";
import { ImportWizard } from "@/features/questions/components/import-wizard";

export const Route = createFileRoute("/_authenticated/question-banks/$bankId/import")({
  head: () => ({
    meta: [
      { title: "Import Questions — QBank" },
      { name: "description", content: "Import MCQs from PDF or JSON." },
    ],
  }),
  component: ImportQuestionsPage,
});

function ImportQuestionsPage() {
  const { bankId } = Route.useParams();

  return (
    <div className="container mx-auto">
      <ImportWizard bankId={bankId} />
    </div>
  );
}
