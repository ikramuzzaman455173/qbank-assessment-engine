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
      <CardContent className="space-y-6">
        {activities.map((activity) => {
          const isPractice = activity.mode === "practice";
          const Icon = isPractice ? Target : CheckCircle2;
          const iconColor = isPractice ? "text-blue-500 bg-blue-500/10" : "text-green-500 bg-green-500/10";
          
          return (
            <div key={activity.id} className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold line-clamp-1">{activity.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(parseISO(activity.submitted_at), "MMM d, h:mm a")}
                    </span>
                    <span>•</span>
                    <span>
                      {activity.answered_questions} / {activity.total_questions} Qs
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {isPractice ? activity.practice_mode || "Practice" : "Test"}
                    </Badge>
                    <Badge 
                      variant={activity.percentage && activity.percentage >= 70 ? "secondary" : "destructive"} 
                      className="text-[10px]"
                    >
                      {Math.round(activity.percentage || 0)}%
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                {/* Depending on routing, we might link to a review page later. 
                    For now, we just show a subtle button indicating action */}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" asChild>
                  <Link to="/">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
