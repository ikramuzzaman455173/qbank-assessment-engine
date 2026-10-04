import { RecentActivity } from "@/types/dashboard";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, CheckCircle2, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface RecentActivityListProps {
  activities: RecentActivity[];
  loading?: boolean;
}

export function RecentActivityList({ activities, loading }: RecentActivityListProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest practice sessions and tests.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest practice sessions and tests.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          No recent activity found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest practice sessions and tests.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const isPractice = activity.mode === "practice";
          const Icon = isPractice ? Target : CheckCircle2;
          const score = Math.round(activity.percentage || 0);
          const isGoodScore = score >= 75;
          const isPassScore = score >= 50;

          const badgeStyle = isGoodScore
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            : isPassScore
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20";

          return (
            <Link
              key={activity.id}
              to="/attempts/$attemptId/result"
              params={{ attemptId: activity.id }}
              className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all group"
            >
              <div className="flex items-start gap-3 min-w-0 pr-2">
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${isPractice ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4
                    className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors"
                    title={activity.title}
                  >
                    {activity.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(parseISO(activity.submitted_at), "MMM d, h:mm a")}
                    </span>
                    <span>•</span>
                    <span>
                      {activity.answered_questions}/{activity.total_questions} Qs
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={`text-xs font-semibold ${badgeStyle}`}>
                  {score}%
                </Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
