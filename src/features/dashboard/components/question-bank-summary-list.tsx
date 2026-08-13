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
            Start by creating a question bank and importing your study materials to begin tracking your progress.
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
      <CardHeader>
        <CardTitle>Your Question Banks</CardTitle>
        <CardDescription>Overview of your study materials and progress.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {banks.map((bank) => (
          <div 
            key={bank.id} 
            className="group flex flex-col justify-between border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/30 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-lg line-clamp-1 flex-1 pr-4" title={bank.name}>
                  {bank.name}
                </h4>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
                  <FolderHeart className="w-4 h-4" />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-4 h-4" />
                  <span>{bank.question_count} Qs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{Math.round(bank.avg_accuracy)}% Acc.</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {bank.last_activity 
                  ? `Active ${format(parseISO(bank.last_activity), "MMM d")}`
                  : "No activity yet"}
              </span>
              <Button variant="ghost" size="sm" className="h-8 group-hover:text-primary px-2" asChild>
                <Link to="/question-banks/$bankId" params={{ bankId: bank.id }}>
                  View Bank
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
