import { TopicPerformance } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowRight, BrainCircuit } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface WeakAreasRecommendationsProps {
  weakTopics: TopicPerformance[];
  loading?: boolean;
}

export function WeakAreasRecommendations({ weakTopics, loading }: WeakAreasRecommendationsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Needs Your Attention</CardTitle>
          <CardDescription>Recommended areas to focus your practice.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // Filter topics that genuinely need practice (< 70% accuracy)
  const areasToFocus = weakTopics?.filter((t) => t.accuracy < 70) || [];

  if (areasToFocus.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Needs Your Attention</CardTitle>
          <CardDescription>Recommended areas to focus your practice.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/30 rounded-lg border border-dashed">
            <BrainCircuit className="w-10 h-10 text-muted-foreground mb-3 opacity-50" />
            <h3 className="font-medium">You're doing great!</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              You don't have any major weak areas right now. Keep practicing to maintain your high accuracy.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Needs Your Attention</CardTitle>
              <span className="text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                {areasToFocus.length} {areasToFocus.length === 1 ? "Topic" : "Topics"}
              </span>
            </div>
            <CardDescription>Targeted focus areas where your accuracy is below 70%.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areasToFocus.map((topic, index) => {
            const acc = Math.round(topic.accuracy);
            return (
              <div 
                key={index}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card/60 p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Review Priority</span>
                    </div>
                    <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                      {acc}% Acc
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm line-clamp-1 text-foreground" title={topic.topic}>
                      {topic.topic}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {topic.attempts} questions answered in this topic
                    </p>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(acc, 5)}%` }}
                    />
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t">
                  <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-8 font-medium text-xs text-primary hover:bg-transparent" asChild>
                    <Link to="/practice/config" search={{ mode: "topic", topic: topic.topic }}>
                      <span>Start Targeted Practice</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
