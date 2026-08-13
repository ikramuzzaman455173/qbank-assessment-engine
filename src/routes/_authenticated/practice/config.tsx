import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common";
import { PracticeConfigForm } from "@/features/practice/components/practice-config-form";

export const Route = createFileRoute("/_authenticated/practice/config")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      mode: (search['mode'] as string) || "all",
    };
  },
  component: PracticeConfigPage,
});

function PracticeConfigPage() {
  const { mode } = Route.useSearch();
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PageHeader
        title="Configure Practice"
        description="Select your question bank and settings for this session."
      />
      <PracticeConfigForm initialMode={mode || "all"} />
    </div>
  );
}
