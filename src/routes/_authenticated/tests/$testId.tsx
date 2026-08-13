import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import { PageHeader, LoadingState, ErrorState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { useTest } from "@/features/tests/api/use-test";
import { useCreateAttempt } from "@/features/tests/api/use-create-attempt";
import { useCurrentAttempt } from "@/features/tests/api/use-attempt";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_authenticated/tests/$testId")({
  head: () => ({
    meta: [
      { title: "Test Details — QBank" },
    ],
  }),
  component: TestDetailsPage,
});

function TestDetailsPage() {
  const { testId } = Route.useParams();
  const navigate = useNavigate();

  const { data: test, isLoading, error } = useTest(testId);
  const { data: currentAttempt, isLoading: isAttemptLoading } = useCurrentAttempt(testId);
  
  const createAttemptMutation = useCreateAttempt();

  const handleStartTest = () => {
    if (currentAttempt) {
      // Resume existing
      navigate({ to: ROUTES.attemptTest(testId) });
    } else if (test) {
      // Start new
      createAttemptMutation.mutate({ testId, totalQuestions: test.totalQuestions });
    }
  };

  if (isLoading || isAttemptLoading) return <LoadingState label="Loading test details..." />;
  if (error || !test) return <ErrorState title="Failed to load test" description={error?.message || "Not found"} />;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <AppBreadcrumbs />
      </div>

      <PageHeader
        title={test.title}
        description={`Generated from ${test.bankName}`}
      />

      <Card className="max-w-3xl">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Questions</p>
              <p className="font-medium text-lg">{test.totalQuestions}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Mode</p>
              <p className="font-medium text-lg capitalize">{test.mode}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Timer</p>
              <p className="font-medium text-lg">{test.timerEnabled ? `${test.durationSeconds! / 60} min` : "Disabled"}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Created</p>
              <p className="font-medium text-lg">{new Date(test.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="pt-6 border-t flex gap-4">
            <Button 
              size="lg" 
              onClick={handleStartTest}
              disabled={createAttemptMutation.isPending}
            >
              <Play className="w-5 h-5 mr-2" />
              {currentAttempt ? "Resume Test" : "Start Test"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
