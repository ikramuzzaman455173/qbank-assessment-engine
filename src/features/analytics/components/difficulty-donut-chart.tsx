import { useMemo } from "react";
import { DifficultyStat } from "@/types/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

interface DifficultyDonutChartProps {
  data?: DifficultyStat[];
  loading?: boolean;
}

interface DifficultyPieItem {
  name: string;
  level: string;
  count: number;
  accuracy: number;
  color: string;
  bgLight: string;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bgLight: string }> = {
  easy: {
    label: "Easy",
    color: "var(--chart-2)", // Emerald
    bgLight: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  medium: {
    label: "Medium",
    color: "var(--chart-3)", // Amber
    bgLight: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  hard: {
    label: "Hard",
    color: "var(--chart-1)", // Indigo
    bgLight: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
};

export function DifficultyDonutChart({ data, loading }: DifficultyDonutChartProps) {
  const { chartData, totalCount, overallAccuracy } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: [] as DifficultyPieItem[],
        totalCount: 0,
        overallAccuracy: 0,
      };
    }

    const items: DifficultyPieItem[] = data.map((d) => {
      const key = d.level.toLowerCase();
      const config = DIFFICULTY_CONFIG[key] || {
        label: d.label || key.charAt(0).toUpperCase() + key.slice(1),
        color: "#64748b",
        bgLight: "bg-slate-500/10 text-slate-600 border-slate-500/20",
      };

      return {
        name: config.label,
        level: key,
        count: d.count,
        accuracy: Math.round(d.accuracy),
        color: config.color,
        bgLight: config.bgLight,
      };
    });

    const total = items.reduce((acc, cur) => acc + cur.count, 0);
    const weightedAcc =
      total > 0
        ? Math.round(items.reduce((acc, cur) => acc + cur.accuracy * cur.count, 0) / total)
        : 0;

    return {
      chartData: items,
      totalCount: total,
      overallAccuracy: weightedAcc,
    };
  }, [data]);

  if (loading) {
    return (
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-6 w-44 rounded-lg" />
              <Skeleton className="h-4 w-56 rounded-md" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Skeleton className="size-48 rounded-full" />
          <div className="grid grid-cols-3 gap-3 w-full mt-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0 || totalCount === 0) {
    return (
      <Card className="border-border/70 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Target className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Difficulty Breakdown</CardTitle>
              <CardDescription className="text-xs">
                Question volume and accuracy distribution by challenge tier
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
            <HelpCircle className="size-6 opacity-40" />
          </div>
          <p className="text-sm font-medium">No difficulty distribution data available</p>
          <p className="text-xs text-muted-foreground/80 mt-1 max-w-xs">
            Start a test or practice session across different difficulty levels to visualize your
            breakdown.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/70 shadow-xs overflow-hidden flex flex-col justify-between">
      {/* 1. Header */}
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Target className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                Difficulty Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                Volume and accuracy across Easy, Medium, and Hard tiers
              </CardDescription>
            </div>
          </div>

          <Badge variant="outline" className="font-mono text-xs px-2.5 py-0.5 shadow-xs">
            {totalCount} Total Qs
          </Badge>
        </div>
      </CardHeader>

      {/* 2. Donut Chart with Center Metric */}
      <CardContent className="pt-4 pb-4">
        <div className="relative w-full h-[210px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const first = payload[0];
                  if (!first) return null;
                  const item = first.payload as DifficultyPieItem;
                  const sharePct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                  return (
                    <div className="rounded-xl border border-border/80 bg-background/95 p-3 shadow-xl backdrop-blur-md text-xs min-w-[170px] space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center gap-2 border-b border-border/50 pb-1.5 font-semibold text-foreground text-sm">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.name} Tier
                      </div>
                      <div className="flex justify-between text-muted-foreground pt-0.5">
                        <span>Practiced:</span>
                        <span className="font-bold text-foreground">
                          {item.count} ({sharePct}%)
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Accuracy:</span>
                        <span className="font-bold font-display text-emerald-600 dark:text-emerald-400">
                          {item.accuracy}%
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={86}
                paddingAngle={4}
                dataKey="count"
                strokeWidth={2}
                stroke="var(--card)"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-bold font-display tracking-tight text-foreground">
              {overallAccuracy}%
            </span>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Avg Accuracy
            </span>
          </div>
        </div>

        {/* 3. Detailed Difficulty Ribbon Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          {chartData.map((item) => {
            const share = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
            return (
              <div
                key={item.level}
                className="p-2.5 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between shadow-xs transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-foreground">{item.name}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${item.bgLight}`}>
                    {item.accuracy}%
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>{item.count} Qs</span>
                  <span className="opacity-75">{share}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
