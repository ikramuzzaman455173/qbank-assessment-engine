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
      <CardHeader>
        <CardTitle>Needs Your Attention</CardTitle>
        <CardDescription>Recommended areas to focus your practice.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areasToFocus.map((topic, index) => (
            <div 
              key={index}
              className="group relative flex flex-col justify-between overflow-hidden rounded-lg border p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-destructive/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
              
              <div>
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Weak Topic</span>
                </div>
                <h4 className="font-semibold text-base line-clamp-1" title={topic.topic}>
                  {topic.topic}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  Your accuracy is {Math.round(topic.accuracy)}% across {topic.attempts} attempts.
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/50">
                <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium hover:bg-transparent hover:text-primary" asChild>
                  <Link to="/practice/config" search={{ topic: topic.topic }}>
                    Practice Now
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
