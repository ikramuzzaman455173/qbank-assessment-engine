import { BankSummary } from "@/types/dashboard";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderHeart, Users, CheckCircle2, ChevronRight, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface QuestionBankSummaryListProps {
  banks: BankSummary[];
  loading?: boolean;
}

export function QuestionBankSummaryList({ banks, loading }: QuestionBankSummaryListProps) {
  if (loading) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Your Question Banks</CardTitle>
          <CardDescription>Overview of your study materials and progress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!banks || banks.length === 0) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Your Question Banks</CardTitle>
          <CardDescription>Overview of your study materials and progress.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <FolderHeart className="w-12 h-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No Question Banks Yet</h3>
          <p className="text-sm mt-1 max-w-sm">
            Start by creating a question bank and importing your study materials to begin tracking
            your progress.
          </p>
          <div className="mt-6 flex gap-4">
            <Button asChild>
              <Link to="/question-banks">Create Question Bank</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Your Question Banks</CardTitle>
          <CardDescription>Overview of your question repositories and readiness.</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="text-xs h-8" asChild>
          <Link to="/question-banks">View All ({banks.length})</Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {banks.map((bank) => {
          const acc = Math.round(bank.avg_accuracy || 0);
          return (
            <div
              key={bank.id}
              className="group flex flex-col justify-between rounded-xl border bg-card/60 p-4 hover:border-primary/50 hover:bg-muted/30 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className="font-semibold text-sm line-clamp-1 flex-1 text-foreground group-hover:text-primary transition-colors"
                    title={bank.name}
                  >
                    {bank.name}
                  </h4>
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary shrink-0">
                    <FolderHeart className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <FileQuestion className="w-3.5 h-3.5 text-primary" />
                    <span>{bank.question_count} Questions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{acc}% Accuracy</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground">
                  {bank.last_activity
                    ? `Active ${format(parseISO(bank.last_activity), "MMM d")}`
                    : "Ready to practice"}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 hover:text-primary"
                    asChild
                  >
                    <Link to="/question-banks/$bankId" params={{ bankId: bank.id }}>
                      View
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
