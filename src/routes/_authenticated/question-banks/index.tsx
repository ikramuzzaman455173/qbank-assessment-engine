import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { useState } from "react";

import { EmptyState, PageHeader, SearchBar } from "@/components/common";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/question-banks/")({
  head: () => ({
    meta: [
      { title: "Question Banks — QBank" },
      { name: "description", content: "Create and manage your own MCQ question banks." },
      { property: "og:title", content: "Question Banks — QBank" },
      { property: "og:description", content: "Create and manage your own MCQ question banks." },
    ],
  }),
  component: QuestionBanksPage,
});

function QuestionBanksPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <PageHeader
        title="Question Banks"
        description="Your banks are private. Tests are always generated from questions you own."
        actions={<Button disabled>New question bank</Button>}
      />

      <SearchBar value={query} onChange={setQuery} placeholder="Search banks…" label="Search question banks" />

      <EmptyState
        icon={BookOpen}
        title="No question banks yet"
        description="Question bank creation, manual MCQ entry and imports arrive in the next step."
      />
    </>
  );
}
