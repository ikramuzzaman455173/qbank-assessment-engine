import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  Clock,
  Calendar,
  ArrowRight,
  Search,
  Sparkles,
  ClipboardList,
  Layers,
  Check,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

import { PageHeader, EmptyState, LoadingState, ErrorState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useResults, type TestResultItem } from "@/features/results/api/use-results";

export const Route = createFileRoute("/_authenticated/results")({
  head: () => ({
    meta: [
      { title: "Test Results & History — QBank" },
      {
        name: "description",
        content: "Review all your completed test scores, attempt histories, and detailed answers.",
      },
    ],
  }),
  component: ResultsPage,
});

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

function formatDate(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function ResultsPage() {
  const navigate = useNavigate();
  const { data: results, isLoading, error, refetch } = useResults();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "passed" | "needs-practice">("all");

  const filteredResults = useMemo(() => {
    if (!results) return [];

    return results.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.topic && item.topic.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === "passed") return item.percentage >= 70;
      if (filterType === "needs-practice") return item.percentage < 70;
      return true;
    });
  }, [results, searchQuery, filterType]);

  const metrics = useMemo(() => {
    if (!results || results.length === 0) {
      return { total: 0, avgScore: 0, bestScore: 0, totalTime: 0 };
    }

    const total = results.length;
    const avgScore = Math.round(
      results.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / total,
    );
    const bestScore = Math.max(...results.map((r) => r.percentage || 0));
    const totalTime = results.reduce((acc, curr) => acc + (curr.timeSpentSeconds || 0), 0);

    return { total, avgScore, bestScore, totalTime };
  }, [results]);

  if (isLoading) {
    return <LoadingState label="Loading your test results..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load results"
        description={(error as Error).message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Test Results & History"
          description="Review your past test scores, time spent, and question-by-question analysis."
        />
        <Button onClick={() => navigate({ to: ROUTES.tests })}>
          <ClipboardList className="mr-2 size-4" />
          Take a Test
        </Button>
      </div>

      {/* Top Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/70 shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <ClipboardList className="size-5.5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Tests Completed
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {metrics.total}
                </span>
                <span className="text-xs text-muted-foreground">recorded attempts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="size-5.5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Average Score
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {metrics.avgScore}%
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Overall Accuracy
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Award className="size-5.5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Best Performance
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {metrics.bestScore}%
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  High Score
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by test title, bank, or topic..."
            className="pl-9 h-10 rounded-xl bg-background/80"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({results?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("passed")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === "passed"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Passed (≥70%)
          </button>
          <button
            type="button"
            onClick={() => setFilterType("needs-practice")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === "needs-practice"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Needs Review (&lt;70%)
          </button>
        </div>
      </div>

      {/* Results List */}
      {!filteredResults || filteredResults.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No matching results found" : "No test results recorded yet"}
          description={
            searchQuery
              ? "Try adjusting your search query or reset the filter."
              : "Complete a generated test to see your performance summary and question review here."
          }
          action={
            searchQuery ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => navigate({ to: ROUTES.tests })}>Go to Tests</Button>
            )
          }
        />
      ) : (
        <div className="space-y-3.5">
          {filteredResults.map((result: TestResultItem) => {
            const isHigh = result.percentage >= 85;
            const isMedium = result.percentage >= 70 && result.percentage < 85;

            return (
              <Card
                key={result.id}
                className="group border border-border/70 hover:border-primary/40 bg-card hover:bg-card/95 transition-all duration-200 shadow-xs hover:shadow-md rounded-2xl overflow-hidden"
              >
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  {/* Left Column: Title & Bank Metadata */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                        {result.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[11px] font-normal px-2 py-0.5 rounded-full border-border bg-muted/40"
                      >
                        <Layers className="mr-1 size-3 text-muted-foreground" />
                        {result.bankName}
                      </Badge>
                      {result.topic && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-medium px-2 py-0 rounded-full"
                        >
                          {result.topic}
                        </Badge>
                      )}
                    </div>

                    {/* Stats details row */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Check className="size-3.5 text-emerald-500" />
                        <strong>{result.correctAnswers}</strong> of {result.totalQuestions} correct
                      </span>

                      {result.timeSpentSeconds ? (
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-muted-foreground/80" />
                          {formatDuration(result.timeSpentSeconds)} spent
                        </span>
                      ) : null}

                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-muted-foreground/80" />
                        {formatDate(result.submittedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Score Badge & View Details CTA */}
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border/50">
                    {/* Score Pillar */}
                    <div className="flex flex-col items-end text-right">
                      <div className="flex items-center gap-1.5">
                        {isHigh ? (
                          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-sm font-bold px-2.5 py-1 rounded-xl">
                            <Sparkles className="mr-1 size-3.5 text-emerald-500" />
                            {result.percentage}% Passed
                          </Badge>
                        ) : isMedium ? (
                          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-sm font-bold px-2.5 py-1 rounded-xl">
                            {result.percentage}% Good
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-sm font-bold px-2.5 py-1 rounded-xl">
                            {result.percentage}% Needs Review
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-0.5">
                        Score: {result.score}/{result.totalQuestions}
                      </span>
                    </div>

                    {/* View Details Action Button */}
                    <Button
                      asChild
                      variant="outline"
                      className="group/btn h-10 px-4 rounded-xl border-border/80 hover:border-primary/50 hover:bg-primary hover:text-primary-foreground font-medium text-xs transition-all duration-200"
                    >
                      <Link to={ROUTES.attemptResult(result.id)}>
                        <span>View Details</span>
                        <ArrowRight className="ml-1.5 size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
