import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import { PageHeader, LoadingState, ErrorState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useAttempt } from "@/features/tests/api/use-attempt";
import { useTest } from "@/features/tests/api/use-test";
import { ResultSummary } from "@/features/tests/components/result-summary";
import { ResultQuestionReview } from "@/features/tests/components/result-question-review";
import { ROUTES } from "@/constants/routes";
import { useCreateAttempt } from "@/features/tests/api/use-create-attempt";

export const Route = createFileRoute("/_authenticated/attempts/$attemptId/result")({
  head: () => ({
    meta: [
      { title: "Test Result — QBank" },
    ],
  }),
  component: AttemptResultPage,
});

function AttemptResultPage() {
  const { attemptId } = Route.useParams();
  const navigate = useNavigate();

  const { data: attempt, isLoading: isAttemptLoading, error: attemptError } = useAttempt(attemptId);
  const { data: test, isLoading: isTestLoading, error: testError } = useTest(attempt?.testId || "");
  
  const createAttemptMutation = useCreateAttempt();

  const handleRetake = () => {
    if (!test) return;
    createAttemptMutation.mutate({ testId: test.id, totalQuestions: test.totalQuestions });
  };

  if (isAttemptLoading || (attempt && isTestLoading)) return <LoadingState label="Loading results..." />;
  if (attemptError || testError) return <ErrorState title="Error" description={(attemptError || testError)?.message || "Something went wrong"} />;
  if (!attempt || !test) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="mb-4">
        <AppBreadcrumbs />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground mb-2"
            asChild
          >
            <Link to={ROUTES.test(test.id)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Test Details
            </Link>
          </Button>
          <PageHeader
            title={`${test.title} - Result`}
            description="Review your performance below."
          />
        </div>
        <Button onClick={handleRetake} disabled={createAttemptMutation.isPending}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retake Test
        </Button>
      </div>

      <ResultSummary attempt={attempt} />

      <ResultQuestionReview questions={test.questions} answers={attempt.answers} />
    </div>
  );
}
