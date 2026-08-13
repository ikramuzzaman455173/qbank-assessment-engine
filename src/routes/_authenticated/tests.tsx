import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tests")({
  component: TestsPage,
});

function TestsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
        <p className="text-muted-foreground">Manage your assessments and exams.</p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/50">
        <p className="text-muted-foreground">Tests placeholder</p>
      </div>
    </div>
  );
}
