import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { LoadingState, ErrorState } from "@/components/common";
import { useTest } from "@/features/tests/api/use-test";
import { useCurrentAttempt, useAttempt } from "@/features/tests/api/use-attempt";
import { TestTakingEngine } from "@/features/tests/components/test-taking-engine";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RotateCcw } from "lucide-react";

interface AttemptSearchParams {
  attemptId?: string | undefined;
}

export const Route = createFileRoute("/_authenticated/tests/$testId/attempt")({
  validateSearch: (search: Record<string, unknown>): AttemptSearchParams => ({
    attemptId: (search['attemptId'] as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Taking Test — QBank" },
    ],
  }),
  component: TestAttemptPage,
});

function TestAttemptPage() {
  const { testId } = Route.useParams();
  const search = Route.useSearch() as AttemptSearchParams;
  const navigate = useNavigate();

  const { data: test, isLoading: isTestLoading, error: testError } = useTest(testId);
  
  // If specific attemptId provided, query by id; otherwise query latest in_progress attempt
  const { 
    data: specificAttempt, 
    isLoading: isSpecificAttemptLoading, 
    error: specificAttemptError 
  } = useAttempt(search.attemptId || "");

  const { 
    data: currentAttempt, 
    isLoading: isCurrentAttemptLoading, 
    error: currentAttemptError 
  } = useCurrentAttempt(search.attemptId ? "" : testId);

  const activeAttempt = search.attemptId ? specificAttempt : currentAttempt;
  const isAttemptLoading = search.attemptId ? isSpecificAttemptLoading : isCurrentAttemptLoading;
  const attemptError = search.attemptId ? specificAttemptError : currentAttemptError;

  if (isTestLoading || isAttemptLoading) {
    return <LoadingState label="Preparing test environment..." />;
  }

  if (testError || attemptError) {
    return (
      <ErrorState 
        title="Failed to load test attempt" 
        description={(testError || attemptError)?.message || "Something went wrong loading this session."} 
      />
    );
  }

  if (!test || !activeAttempt) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <Card className="text-center p-6 border shadow-sm">
          <CardContent className="space-y-4 pt-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">No Active Attempt Found</h3>
            <p className="text-sm text-muted-foreground">
              We couldn't find an in-progress attempt for this test. It may have already been submitted or completed.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild>
                <Link to="/tests/$testId" params={{ testId }}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Back to Test Overview
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 -mt-8 -mx-4 md:-mx-8 lg:-mx-12 px-0">
      <TestTakingEngine test={test} attempt={activeAttempt as any} />
    </div>
  );
}
