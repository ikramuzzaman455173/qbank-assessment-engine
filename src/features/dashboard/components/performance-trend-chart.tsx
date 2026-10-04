import { useState, useMemo } from "react";
import { TrendPoint } from "@/types/dashboard";
import { format, parseISO } from "date-fns";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  PlayCircle,
  Activity,
  BarChart3,
  Layers,
  Target,
  Award,
  HelpCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

interface PerformanceTrendChartProps {
  data: TrendPoint[];
  loading?: boolean;
}

type ChartViewMode = "accuracy" | "volume" | "combined";

export function PerformanceTrendChart({ data, loading }: PerformanceTrendChartProps) {
  const [viewMode, setViewMode] = useState<ChartViewMode>("accuracy");

  // Format data and calculate stats
  const { chartData, stats } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: [],
        stats: {
          avgAccuracy: 0,
          totalAnswered: 0,
          peakAccuracy: 0,
          currentAccuracy: 0,
          delta: 0,
          isImproving: true,
        },
      };
    }

    const formatted = data.map((d) => {
      let dateLabel = d.date;
      try {
        dateLabel = format(parseISO(d.date), "MMM d");
      } catch {
        dateLabel = d.date;
      }
      return {
        ...d,
        formattedDate: dateLabel,
        accuracy: Math.round(d.accuracy),
        answered: d.answered || 0,
      };
    });

    const accuracies = formatted.map((d) => d.accuracy);
    const totalAnswered = formatted.reduce((sum, d) => sum + d.answered, 0);
    const avgAccuracy = Math.round(accuracies.reduce((sum, a) => sum + a, 0) / accuracies.length);
    const peakAccuracy = Math.max(...accuracies);
    const currentAccuracy = formatted[formatted.length - 1]?.accuracy ?? 0;
    const initialAccuracy = formatted[0]?.accuracy ?? currentAccuracy;
    const delta = currentAccuracy - initialAccuracy;

    return {
      chartData: formatted,
      stats: {
        avgAccuracy,
        totalAnswered,
        peakAccuracy,
        currentAccuracy,
        delta,
        isImproving: delta >= 0,
      },
    };
  }, [data]);

  if (loading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3.5 w-72" />
            </div>
            <Skeleton className="h-8 w-48 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-[260px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 lg:col-span-3 overflow-hidden border-border/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Performance Trend</CardTitle>
            <Badge variant="outline" className="text-muted-foreground text-xs font-normal">
              No Activity
            </Badge>
          </div>
          <CardDescription>Accuracy and question volume trajectory over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-center p-6 bg-muted/10 rounded-xl m-4 border border-dashed">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary mb-3 shadow-inner">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-foreground text-sm">No Trend Data Yet</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
            Practice questions or complete formal tests to visualize your daily accuracy score
            trajectory.
          </p>
          <Button size="sm" className="mt-4 gap-1.5 shadow-sm" asChild>
            <Link to="/practice/config">
              <PlayCircle className="w-4 h-4" />
              Start First Practice
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-3 overflow-hidden border-border/80 shadow-sm transition-all hover:shadow-md">
      {/* 1. Header with Title & View Mode Selector */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              Performance Trend
            </CardTitle>

            {/* Momentum Badge */}
            {chartData.length > 1 ? (
              <Badge
                variant="outline"
                className={`text-[11px] py-0.5 px-2 font-medium flex items-center gap-1 ${
                  stats.isImproving
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                }`}
              >
                {stats.isImproving ? (
                  <>
                    <TrendingUp className="size-3 text-emerald-500" />
                    {stats.delta > 0 ? `+${stats.delta}% Gain` : "Consistent"}
                  </>
                ) : (
                  <>
                    <TrendingDown className="size-3 text-amber-500" />
                    {stats.delta}% Shift
                  </>
                )}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[11px] py-0.5 px-2"
              >
                Live Data
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            Score trajectory and question volume across practice sessions & tests.
          </CardDescription>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60 self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setViewMode("accuracy")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              viewMode === "accuracy"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="size-3" />
            Accuracy
          </button>
          <button
            type="button"
            onClick={() => setViewMode("volume")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              viewMode === "volume"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="size-3" />
            Questions
          </button>
          <button
            type="button"
            onClick={() => setViewMode("combined")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              viewMode === "combined"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-3" />
            Combined
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* 2. Micro KPI Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40 rounded-xl p-2.5 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Latest Score
              <Activity className="size-3 text-primary/70" />
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {stats.currentAccuracy}%
              </span>
              <span className="text-[11px] text-muted-foreground">accuracy</span>
            </div>
          </div>

          <div className="bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40 rounded-xl p-2.5 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Period Average
              <Target className="size-3 text-blue-500/70" />
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {stats.avgAccuracy}%
              </span>
              <span className="text-[11px] text-muted-foreground">mean</span>
            </div>
          </div>

          <div className="bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40 rounded-xl p-2.5 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Peak Accuracy
              <Award className="size-3 text-amber-500/70" />
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {stats.peakAccuracy}%
              </span>
              <span className="text-[11px] text-muted-foreground">best day</span>
            </div>
          </div>

          <div className="bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40 rounded-xl p-2.5 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Practiced
              <HelpCircle className="size-3 text-purple-500/70" />
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {stats.totalAnswered}
              </span>
              <span className="text-[11px] text-muted-foreground">questions</span>
            </div>
          </div>
        </div>

        {/* 3. Interactive Chart Canvas */}
        <div className="h-[250px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <defs>
                {/* Accuracy Area Gradient */}
                <linearGradient id="performanceAccuracyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="60%" stopColor="#6366f1" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
                {/* Bar Gradient */}
                <linearGradient id="performanceVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />

              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
                tickMargin={8}
              />

              {/* Left YAxis: Accuracy % */}
              {(viewMode === "accuracy" || viewMode === "combined") && (
                <YAxis
                  yAxisId="accuracyAxis"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-muted-foreground"
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(val) => `${val}%`}
                />
              )}

              {/* Right YAxis: Volume */}
              {(viewMode === "volume" || viewMode === "combined") && (
                <YAxis
                  yAxisId="volumeAxis"
                  orientation={viewMode === "combined" ? "right" : "left"}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-muted-foreground"
                  allowDecimals={false}
                  tickFormatter={(val) => `${val} Qs`}
                />
              )}

              {/* Target Benchmark Reference Line */}
              {(viewMode === "accuracy" || viewMode === "combined") && (
                <ReferenceLine
                  yAxisId="accuracyAxis"
                  y={75}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  strokeWidth={1.5}
                  label={{
                    value: "Target 75%",
                    position: "insideTopRight",
                    fill: "#10b981",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}

              {/* Custom Interactive Tooltip */}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0]?.payload;
                  const acc = item?.accuracy ?? 0;
                  const isAboveTarget = acc >= 75;

                  return (
                    <div className="bg-popover/95 backdrop-blur-md border border-border/80 rounded-xl shadow-xl p-3 text-xs space-y-2 min-w-[170px] z-50">
                      <div className="font-semibold text-foreground flex items-center justify-between border-b border-border/60 pb-1.5">
                        <span>{label}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isAboveTarget
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {isAboveTarget ? "Above Target" : "Review Area"}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-0.5">
                        <div className="flex justify-between items-center gap-3">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-blue-500" />
                            Accuracy:
                          </span>
                          <span className="font-bold text-foreground text-sm">{acc}%</span>
                        </div>

                        <div className="flex justify-between items-center gap-3">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-purple-500" />
                            Questions:
                          </span>
                          <span className="font-semibold text-foreground">
                            {item?.answered || 0} Qs
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              {/* Bar Layer for Questions Volume */}
              {(viewMode === "volume" || viewMode === "combined") && (
                <Bar
                  yAxisId="volumeAxis"
                  dataKey="answered"
                  fill="url(#performanceVolumeGrad)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={viewMode === "combined" ? 24 : 36}
                  opacity={viewMode === "combined" ? 0.75 : 0.95}
                />
              )}

              {/* Area Layer for Accuracy */}
              {(viewMode === "accuracy" || viewMode === "combined") && (
                <Area
                  yAxisId="accuracyAxis"
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#performanceAccuracyGrad)"
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "hsl(var(--background))",
                    stroke: "#3b82f6",
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    fill: "#3b82f6",
                    stroke: "#ffffff",
                  }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
