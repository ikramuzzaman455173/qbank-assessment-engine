import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, AlertCircle, HelpCircle, Star, Brain, TrendingDown } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { usePracticeSummary } from "../api/use-practice-summary";
import { LoadingState, ErrorState } from "@/components/common";

export function PracticeIndex() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = usePracticeSummary();

  if (isLoading) {
    return <LoadingState label="Loading practice insights..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load practice insights" 
        description={(error as Error).message}
        onRetry={() => refetch()}
      />
    );
  }

  const modes = [
    {
      id: "all",
      title: "Practice All",
      description: "Practice questions from your question banks.",
      icon: BookOpen,
      count: data?.totalEligible || 0,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "incorrect",
      title: "Practice Mistakes",
      description: "Review questions you've previously answered incorrectly.",
      icon: AlertCircle,
      count: data?.mistakesCount || 0,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      id: "unanswered",
      title: "Practice Unanswered",
      description: "Tackle questions you skipped or haven't answered yet.",
      icon: HelpCircle,
      count: data?.unansweredCount || 0,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      id: "difficult",
      title: "Practice Difficult",
      description: "Challenge yourself with hard questions.",
      icon: Brain,
      count: data?.difficultCount || 0,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "weak_topic",
      title: "Weak Topics",
      description: "Focus on topics where your accuracy is below 70%.",
      icon: TrendingDown,
      count: data?.weakTopicsCount || 0,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      id: "recent_mistakes",
      title: "Recent Mistakes",
      description: "Review your most recent mistakes.",
      icon: Star,
      count: data?.mistakesCount || 0,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    }
  ];

  const handleModeSelect = (modeId: string) => {
    navigate({
      to: ROUTES.practiceConfig,
      search: { mode: modeId },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modes.map((mode) => (
        <Card 
          key={mode.id} 
          className="hover:border-primary/50 transition-colors cursor-pointer flex flex-col h-full"
          onClick={() => handleModeSelect(mode.id)}
        >
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${mode.bgColor}`}>
                <mode.icon className={`h-6 w-6 ${mode.color}`} />
              </div>
              {mode.count > 0 && (
                <span className="text-sm font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                  {mode.id === 'weak_topic' ? `${mode.count} topics` : `${mode.count} Qs`}
                </span>
              )}
            </div>
            <CardTitle className="text-lg mt-4">{mode.title}</CardTitle>
            <CardDescription>{mode.description}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-0">
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={mode.count === 0 && mode.id !== 'all'}
            >
              {mode.count === 0 && mode.id !== 'all' ? "No data yet" : "Start Practice"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
