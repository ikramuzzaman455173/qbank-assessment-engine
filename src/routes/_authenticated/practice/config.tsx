import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common";
import { PracticeConfigForm } from "@/features/practice/components";

interface PracticeConfigSearch {
  mode?: string | undefined;
  topic?: string | undefined;
}

export const Route = createFileRoute("/_authenticated/practice/config")({
  validateSearch: (search: Record<string, unknown>): PracticeConfigSearch => {
    return {
      mode: (search['mode'] as string) || "all",
      topic: (search['topic'] as string) || undefined,
    };
  },
  component: PracticeConfigPage,
});

function PracticeConfigPage() {
  const { mode, topic } = Route.useSearch();
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PageHeader
        title="Configure Practice"
        description="Select your question bank and settings for this session."
      />
      <PracticeConfigForm initialMode={mode || "all"} initialTopic={topic} />
    </div>
  );
}
