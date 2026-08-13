import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">View your learning progress and statistics.</p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/50">
        <p className="text-muted-foreground">Analytics placeholder</p>
      </div>
    </div>
  );
}
