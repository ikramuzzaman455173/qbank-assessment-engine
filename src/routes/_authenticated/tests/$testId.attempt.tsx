import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoadingState, ErrorState } from "@/components/common";
import { useTest } from "@/features/tests/api/use-test";
import { useCurrentAttempt } from "@/features/tests/api/use-attempt";
import { TestTakingEngine } from "@/features/tests/components/test-taking-engine";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_authenticated/tests/$testId/attempt")({
  head: () => ({
    meta: [
      { title: "Taking Test — QBank" },
    ],
  }),
  component: TestAttemptPage,
});

function TestAttemptPage() {
  const { testId } = Route.useParams();
  const navigate = useNavigate();

  const { data: test, isLoading: isTestLoading, error: testError } = useTest(testId);
  const { data: currentAttempt, isLoading: isAttemptLoading, error: attemptError } = useCurrentAttempt(testId);

  // If there's no active attempt, kick them back to the test details
  useEffect(() => {
    if (!isAttemptLoading && !currentAttempt) {
      navigate({ to: ROUTES.test(testId), replace: true });
    }
  }, [isAttemptLoading, currentAttempt, testId, navigate]);

  if (isTestLoading || isAttemptLoading) return <LoadingState label="Preparing test environment..." />;
  if (testError || attemptError) return <ErrorState title="Error" description={(testError || attemptError)?.message || "Something went wrong"} />;
  if (!test || !currentAttempt) return null;

  return (
    <div className="min-h-screen bg-muted/10 -mt-8 -mx-4 md:-mx-8 lg:-mx-12 px-0">
      <TestTakingEngine test={test} attempt={currentAttempt as any} />
    </div>
  );
}
