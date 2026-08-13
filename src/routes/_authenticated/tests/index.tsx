import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader, EmptyState, LoadingState, ErrorState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Play, RotateCcw } from "lucide-react";
import { useTests } from "@/features/tests/api/use-tests";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_authenticated/tests/")({
  head: () => ({
    meta: [
      { title: "Tests — QBank" },
      { name: "description", content: "View and manage your generated tests." },
    ],
  }),
  component: TestsPage,
});

function TestsPage() {
  const navigate = useNavigate();
  const { data: tests, isLoading, error, refetch } = useTests();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="My Tests"
          description="Manage and take your generated tests."
        />
        <Button onClick={() => navigate({ to: ROUTES.createTest })}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Test
        </Button>
      </div>

      {isLoading ? (
        <LoadingState label="Loading tests..." />
      ) : error ? (
        <ErrorState 
          title="Failed to load tests"
          description={(error as Error).message}
          onRetry={() => refetch()}
        />
      ) : !tests || tests.length === 0 ? (
        <EmptyState
          title="No tests generated yet"
          description="You haven't generated any tests from your question banks."
          action={<Button onClick={() => navigate({ to: ROUTES.createTest })}>Generate Your First Test</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <Card key={test.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1" title={test.title}>{test.title}</CardTitle>
                <CardDescription className="line-clamp-1">{test.bankName || "Unknown Bank"}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{test.totalQuestions} Questions • {test.mode} mode</p>
                  <p>Difficulty: {test.difficulty || "Mixed"}</p>
                  {test.timerEnabled && <p>Timer: {test.durationSeconds! / 60} minutes</p>}
                </div>
                <div className="pt-4 flex gap-2">
                  <Button className="w-full" onClick={() => navigate({ to: ROUTES.test(test.id) })}>
                    <Play className="w-4 h-4 mr-2" />
                    Open Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
