import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import { PageHeader, LoadingState, ErrorState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Eye, 
  HelpCircle, 
  Award,
  Layers
} from "lucide-react";
import { useTest } from "@/features/tests/api/use-test";
import { useCreateAttempt } from "@/features/tests/api/use-create-attempt";
import { useCurrentAttempt, useTestAttempts } from "@/features/tests/api/use-attempt";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_authenticated/tests/$testId")({
  head: () => ({
    meta: [
      { title: "Test Details — QBank" },
    ],
  }),
  component: TestDetailsPage,
});

export function TestDetailsPage() {
  const { testId } = Route.useParams();
  const navigate = useNavigate();

  const { data: test, isLoading, error } = useTest(testId);
  const { data: currentAttempt, isLoading: isAttemptLoading } = useCurrentAttempt(testId);
  const { data: attempts, isLoading: isHistoryLoading } = useTestAttempts(testId);
  
  const createAttemptMutation = useCreateAttempt();

  const handleStartFresh = () => {
    if (!test) return;
    createAttemptMutation.mutate({ testId, totalQuestions: test.totalQuestions });
  };

  const handleResume = () => {
    void navigate({ 
      to: "/tests/$testId/attempt", 
      params: { testId },
      search: currentAttempt ? { attemptId: currentAttempt.id } : undefined,
    });
  };

  if (isLoading || isAttemptLoading) return <LoadingState label="Loading test details..." />;
  if (error || !test) return <ErrorState title="Failed to load test" description={error?.message || "Not found"} />;

  const completedAttempts = (attempts || []).filter(a => a.status === "completed" || a.status === "auto_submitted");
  const latestCompletedAttempt = completedAttempts[0];

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <AppBreadcrumbs />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title={test.title}
          description={`Question Bank: ${test.bankName || "General"}`}
        />
        
        <div className="flex items-center gap-2">
          {currentAttempt ? (
            <Button size="lg" asChild className="gap-2">
              <Link 
                to="/tests/$testId/attempt" 
                params={{ testId }}
                search={{ attemptId: currentAttempt.id }}
              >
                <Play className="w-5 h-5 fill-current" /> Resume Attempt
              </Link>
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={handleStartFresh}
              disabled={createAttemptMutation.isPending}
              className="gap-2"
            >
              {completedAttempts.length > 0 ? (
                <>
                  <RotateCcw className="w-5 h-5" /> Retake Test
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" /> Start Test
                </>
              )}
            </Button>
          )}

          {latestCompletedAttempt && (
            <Button variant="outline" size="lg" asChild>
              <Link to={`/attempts/${latestCompletedAttempt.id}/result` as any}>
                <Eye className="w-4 h-4 mr-2" /> Latest Result
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Test Overview Card */}
      <Card className="border-t-4 border-t-primary shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
            Test Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
            <div className="p-3 bg-muted/40 rounded-lg border">
              <p className="text-muted-foreground text-xs uppercase font-semibold">Total Questions</p>
              <p className="font-bold text-2xl text-foreground mt-1">{test.totalQuestions}</p>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg border">
              <p className="text-muted-foreground text-xs uppercase font-semibold">Mode</p>
              <p className="font-bold text-xl text-foreground capitalize mt-1">{test.mode}</p>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg border">
              <p className="text-muted-foreground text-xs uppercase font-semibold">Timer</p>
              <p className="font-bold text-xl text-foreground mt-1">
                {test.timerEnabled && test.durationSeconds ? `${Math.round(test.durationSeconds / 60)} min` : "Untimed"}
              </p>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg border">
              <p className="text-muted-foreground text-xs uppercase font-semibold">Created Date</p>
              <p className="font-bold text-base text-foreground mt-1">
                {new Date(test.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attempt History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Attempt History</h3>
            <p className="text-sm text-muted-foreground">
              Review your previous attempts, accuracy, and answers.
            </p>
          </div>

          <Badge variant="outline" className="text-xs">
            {attempts?.length || 0} Total Attempts
          </Badge>
        </div>

        {isHistoryLoading ? (
          <LoadingState label="Loading attempt history..." />
        ) : !attempts || attempts.length === 0 ? (
          <Card className="text-center py-10 border-dashed">
            <CardContent className="space-y-3">
              <div className="mx-auto bg-muted w-12 h-12 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-base">No Attempts Recorded Yet</h4>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You haven't completed this test yet. Click "Start Test" above to begin your first attempt.
              </p>
              <Button onClick={handleStartFresh} className="mt-2" disabled={createAttemptMutation.isPending}>
                <Play className="w-4 h-4 mr-2 fill-current" /> Start Test Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {attempts.map((att, idx) => {
              const isCompleted = att.status === "completed" || att.status === "auto_submitted";
              const pct = Math.round(att.percentage ?? 0);

              return (
                <Card 
                  key={att.id} 
                  className="hover:border-primary/50 transition-all shadow-xs overflow-hidden"
                >
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        #{attempts.length - idx}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base text-foreground">
                            {new Date(att.submittedAt || att.startedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>

                          {isCompleted ? (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs">
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-amber-700 dark:text-amber-300 bg-amber-500/15 border-amber-500/30 text-xs">
                              In Progress
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Time Spent: {formatDuration(att.timeSpentSeconds)}</span>
                          <span>•</span>
                          <span>Answered: {att.answeredQuestions}/{att.totalQuestions}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                      {isCompleted && (
                        <div className="text-right">
                          <div className="text-xl font-extrabold text-foreground">
                            {pct}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {att.correctAnswers ?? 0}/{att.totalQuestions} Correct
                          </div>
                        </div>
                      )}

                      {isCompleted ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/attempts/${att.id}/result` as any}>
                            <Eye className="w-4 h-4 mr-1.5" /> View Result
                          </Link>
                        </Button>
                      ) : (
                        <Button size="sm" asChild>
                          <Link 
                            to="/tests/$testId/attempt" 
                            params={{ testId }}
                            search={{ attemptId: att.id }}
                          >
                            <Play className="w-4 h-4 mr-1.5 fill-current" /> Resume
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
