import { useState, useMemo } from "react";
import { TopicPerformance } from "@/types/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, CheckCircle2, AlertTriangle, ArrowUpDown, BookOpen } from "lucide-react";

interface TopicMasteryBarChartProps {
  topics: TopicPerformance[];
  loading?: boolean;
}

type SortMode = "accuracy" | "attempts";

interface ChartItem {
  topic: string;
  accuracy: number;
  attempts: number;
  correct: number;
  incorrect: number;
  distinctQuestions: number;
  status: "Mastered" | "Proficient" | "Needs Practice";
  fillColor: string;
}

export function TopicMasteryBarChart({ topics, loading }: TopicMasteryBarChartProps) {
  const [sortMode, setSortMode] = useState<SortMode>("accuracy");

  const { chartData, topTopic, avgMastery, masteredCount } = useMemo(() => {
    if (!topics || topics.length === 0) {
      return {
        chartData: [] as ChartItem[],
        topTopic: null,
        avgMastery: 0,
        masteredCount: 0,
      };
    }

    // Deduplicate topics if any duplicates exist
    const topicMap = new Map<string, TopicPerformance>();
    topics.forEach((t) => {
      const existing = topicMap.get(t.topic);
      if (!existing || t.attempts > existing.attempts) {
        topicMap.set(t.topic, t);
      }
    });

    const uniqueTopics = Array.from(topicMap.values());

    const items: ChartItem[] = uniqueTopics.map((t) => {
      const acc = Math.round(t.accuracy);
      let status: "Mastered" | "Proficient" | "Needs Practice" = "Needs Practice";
      let fillColor = "var(--chart-4)"; // Needs Practice (Rose)

      if (acc >= 80) {
        status = "Mastered";
        fillColor = "var(--chart-2)"; // Mastered (Emerald)
      } else if (acc >= 60) {
        status = "Proficient";
        fillColor = "var(--chart-3)"; // Proficient (Amber)
      }

      return {
        topic: t.topic,
        accuracy: acc,
        attempts: t.attempts,
        correct: t.correct,
        incorrect: t.incorrect,
        distinctQuestions: t.distinct_questions,
        status,
        fillColor,
      };
    });

    // Sorting
    if (sortMode === "accuracy") {
      items.sort((a, b) => b.accuracy - a.accuracy);
    } else {
      items.sort((a, b) => b.attempts - a.attempts);
    }

    const totalAcc = items.reduce((sum, item) => sum + item.accuracy, 0);
    const avg = items.length > 0 ? Math.round(totalAcc / items.length) : 0;
    const mastered = items.filter((item) => item.accuracy >= 80).length;
    const top = items[0] || null;

    return {
      chartData: items,
      topTopic: top,
      avgMastery: avg,
      masteredCount: mastered,
    };
  }, [topics, sortMode]);

  if (loading) {
    return (
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Topic Mastery Breakdown</CardTitle>
              <CardDescription className="text-xs">
                Accuracy score per subject topic across all attempts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
            <BookOpen className="size-6 opacity-40" />
          </div>
          <p className="text-sm font-medium">No topic mastery data available yet</p>
          <p className="text-xs text-muted-foreground/80 mt-1 max-w-xs">
            Complete test assessments or targeted practice sessions to view your topic mastery
            breakdown.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate dynamic chart height based on item count
  const calculatedHeight = Math.max(260, chartData.length * 52 + 50);

  return (
    <Card className="border-border/70 shadow-xs overflow-hidden">
      {/* 1. Header with Stats & Sort Toggle */}
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Layers className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                Topic Mastery Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                Comparative accuracy score across all tested curriculum domains
              </CardDescription>
            </div>
          </div>

          {/* Sort Pill Toggle */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-muted/60 p-1 rounded-lg border border-border/50 text-xs">
            <Button
              type="button"
              variant={sortMode === "accuracy" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortMode("accuracy")}
              className={`h-7 px-2.5 text-xs font-medium rounded-md transition-all ${
                sortMode === "accuracy"
                  ? "bg-background shadow-xs text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <ArrowUpDown className="size-3 mr-1" />
              By Accuracy
            </Button>
            <Button
              type="button"
              variant={sortMode === "attempts" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortMode("attempts")}
              className={`h-7 px-2.5 text-xs font-medium rounded-md transition-all ${
                sortMode === "attempts"
                  ? "bg-background shadow-xs text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              By Questions
            </Button>
          </div>
        </div>

        {/* 2. Compact Key Insights Ribbon */}
        <div className="grid grid-cols-3 gap-2 pt-3">
          <div className="px-3 py-2 rounded-lg bg-card border border-border/50 shadow-xs">
            <span className="text-[11px] font-medium text-muted-foreground block">Avg Mastery</span>
            <span className="text-base font-bold tracking-tight text-foreground font-display">
              {avgMastery}%
            </span>
          </div>

          <div className="px-3 py-2 rounded-lg bg-card border border-border/50 shadow-xs">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Mastered (≥80%)
            </span>
            <span className="text-base font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-display">
              {masteredCount} of {chartData.length}
            </span>
          </div>

          <div className="px-3 py-2 rounded-lg bg-card border border-border/50 shadow-xs overflow-hidden">
            <span className="text-[11px] font-medium text-muted-foreground block">Top Domain</span>
            <span className="text-xs font-semibold tracking-tight text-foreground truncate block">
              {topTopic ? topTopic.topic : "N/A"}
            </span>
          </div>
        </div>
      </CardHeader>

      {/* 3. Recharts Horizontal Bar Chart */}
      <CardContent className="pt-5 pb-4">
        {/* Benchmark Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2 pb-3 mb-2 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full inline-block"
                style={{ backgroundColor: "var(--chart-2)" }}
              />
              <span>Mastered (≥80%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full inline-block"
                style={{ backgroundColor: "var(--chart-3)" }}
              />
              <span>Proficient (60-79%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full inline-block"
                style={{ backgroundColor: "var(--chart-4)" }}
              />
              <span>Needs Practice (&lt;60%)</span>
            </div>
          </div>
          <div
            className="text-[11px] font-medium flex items-center gap-1"
            style={{ color: "var(--chart-2)" }}
          >
            <CheckCircle2 className="size-3" /> Target Benchmark: 75%
          </div>
        </div>

        <div style={{ height: calculatedHeight }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 30, left: 10, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="var(--border)"
                strokeOpacity={0.5}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                unit="%"
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="topic"
                width={150}
                tickLine={false}
                axisLine={false}
                tick={({ x, y, payload }) => {
                  const label = payload.value || "";
                  const truncated = label.length > 20 ? label.slice(0, 18) + "…" : label;
                  return (
                    <text
                      x={x}
                      y={y}
                      dy={4}
                      textAnchor="end"
                      fill="var(--foreground)"
                      fontSize={12}
                      fontWeight={500}
                    >
                      {truncated}
                    </text>
                  );
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const first = payload[0];
                  if (!first) return null;
                  const item = first.payload as ChartItem;
                  return (
                    <div className="rounded-xl border border-border/80 bg-background/95 p-3.5 shadow-xl backdrop-blur-md text-xs min-w-[210px] space-y-2 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                        <span className="font-semibold text-foreground text-sm leading-tight">
                          {item.topic}
                        </span>
                        <Badge
                          variant={
                            item.accuracy >= 80
                              ? "default"
                              : item.accuracy >= 60
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0"
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <div className="space-y-1.5 pt-0.5">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Accuracy Rate:</span>
                          <span className="font-bold text-foreground font-display text-sm">
                            {item.accuracy}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Correct Answers:</span>
                          <span className="font-medium" style={{ color: "var(--chart-2)" }}>
                            {item.correct} of {item.attempts}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Distinct Questions:</span>
                          <span className="font-medium text-foreground">
                            {item.distinctQuestions}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <ReferenceLine
                x={75}
                stroke="var(--chart-2)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: "Target 75%",
                  fill: "var(--chart-2)",
                  fontSize: 10,
                  position: "top",
                  fontWeight: 600,
                }}
              />
              <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fillColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
