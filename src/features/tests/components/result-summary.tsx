import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, XCircle, HelpCircle, Clock, Award } from "lucide-react";
import type { Attempt } from "@/types/domain";

interface ResultSummaryProps {
  attempt: Attempt;
}

export function ResultSummary({ attempt }: ResultSummaryProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <Card className="border-t-4 border-t-primary shadow-md">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">
          {attempt.percentage !== null ? attempt.percentage.toFixed(1) : 0}%
        </CardTitle>
        <CardDescription className="text-lg">
          Final Score: {attempt.score} out of {attempt.totalQuestions}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-100">
            <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-2xl font-bold text-green-700">{attempt.correctAnswers || 0}</span>
            <span className="text-xs text-green-600 uppercase tracking-wider font-medium mt-1">Correct</span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg border border-red-100">
            <XCircle className="w-6 h-6 text-red-600 mb-2" />
            <span className="text-2xl font-bold text-red-700">{attempt.incorrectAnswers || 0}</span>
            <span className="text-xs text-red-600 uppercase tracking-wider font-medium mt-1">Incorrect</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg border">
            <HelpCircle className="w-6 h-6 text-muted-foreground mb-2" />
            <span className="text-2xl font-bold">{attempt.unansweredQuestions || 0}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Unanswered</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
            <Clock className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-2xl font-bold text-blue-700">{attempt.timeSpentSeconds ? formatTime(attempt.timeSpentSeconds) : "0m 0s"}</span>
            <span className="text-xs text-blue-600 uppercase tracking-wider font-medium mt-1">Time Spent</span>
          </div>
        </div>
        
        {attempt.status === "auto_submitted" && (
          <div className="mt-6 text-center text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            This test was automatically submitted because the time expired.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
