import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/practice")({
  component: PracticePage,
});

function PracticePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Practice</h1>
        <p className="text-muted-foreground">Hone your skills with practice sessions.</p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/50">
        <p className="text-muted-foreground">Practice placeholder</p>
      </div>
    </div>
  );
}
