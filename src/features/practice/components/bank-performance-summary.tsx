import { useBankPerformance } from "../api/use-bank-performance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoadingState, ErrorState } from "@/components/common";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function BankPerformanceSummary({ bankId }: { bankId: string }) {
  const { data, isLoading, error, refetch } = useBankPerformance(bankId);

  if (isLoading) return <LoadingState label="Loading performance data..." />;
  if (error) return <ErrorState title="Failed to load performance" description={(error as Error).message} onRetry={() => refetch()} />;
  if (!data || data.totalAttempts === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p>No performance data yet. Complete your first test or practice session to see insights.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Level Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{data.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">Tests & Practices Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {data.avgAccuracy !== null ? `${Math.round(data.avgAccuracy)}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">Average Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{data.masteredQuestions}</div>
            <p className="text-xs text-muted-foreground">Strong Questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{data.weakQuestions}</div>
            <p className="text-xs text-muted-foreground">Weak Questions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Topic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Topic Performance</CardTitle>
            <CardDescription>Accuracy by topic area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topics.length === 0 ? (
              <p className="text-sm text-muted-foreground">No topic data available.</p>
            ) : (
              data.topics.map((topic) => {
                const acc = Math.round(topic.accuracy || 0);
                const status = acc >= 80 ? 'Strong' : acc >= 70 ? 'Good' : 'Needs Practice';
                const statusColor = acc >= 80 ? 'bg-green-500/10 text-green-700 border-green-200' : 
                                    acc >= 70 ? 'bg-blue-500/10 text-blue-700 border-blue-200' : 
                                    'bg-orange-500/10 text-orange-700 border-orange-200';
                
                return (
                  <div key={topic.topic || 'Unknown'} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{topic.topic || 'Uncategorized'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{acc}%</span>
                        <Badge variant="outline" className={`text-[10px] uppercase ${statusColor}`}>{status}</Badge>
                      </div>
                    </div>
                    <Progress value={acc} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{topic.distinct_questions_attempted} questions</span>
                      <span>{topic.total_attempts} attempts</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Difficulty Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance by Difficulty</CardTitle>
            <CardDescription>Accuracy across difficulty levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.difficulties.length === 0 ? (
              <p className="text-sm text-muted-foreground">No difficulty data available.</p>
            ) : (
              data.difficulties.map((diff) => {
                const acc = Math.round(diff.accuracy || 0);
                return (
                  <div key={diff.difficulty || 'Unknown'} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{diff.difficulty || 'Uncategorized'}</span>
                      <span className="text-sm font-semibold">{acc}%</span>
                    </div>
                    <Progress value={acc} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">
                      {diff.total_attempts} attempts
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
