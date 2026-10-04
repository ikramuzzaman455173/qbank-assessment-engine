import { useState, useMemo } from "react";
import { TrendPoint } from "@/types/dashboard";
import { format, parseISO } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
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
  Target,
  Award,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";

interface PerformanceTrendChartProps {
  data: TrendPoint[];
  loading?: boolean;
}

type ChartViewMode = "accuracy" | "volume";

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
      <Card className="col-span-1 lg:col-span-3 border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-4 w-72 rounded-md" />
            </div>
            <Skeleton className="h-9 w-44 rounded-xl" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-[290px] w-full rounded-2xl" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 lg:col-span-3 overflow-hidden border-border/80 shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              Performance Trajectory
            </CardTitle>
            <Badge variant="outline" className="text-muted-foreground text-xs font-normal">
              No Recorded Activity
            </Badge>
          </div>
          <CardDescription>
            Historical trajectory of your score accuracy and practice sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[280px] flex flex-col items-center justify-center text-center p-6 bg-muted/10 rounded-2xl m-4 border border-dashed border-border/70">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary mb-3 shadow-inner">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-foreground text-sm">No Performance Trend Data</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
            Practice questions or take formal tests to visualize your daily score curve and
            progress.
          </p>
          <Button size="sm" className="mt-4 gap-1.5 rounded-xl shadow-xs" asChild>
            <Link to={ROUTES.practiceConfig}>
              <PlayCircle className="w-4 h-4" />
              Start First Practice
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-3 overflow-hidden border border-border/70 bg-card shadow-xs rounded-2xl transition-all">
      {/* 1. Header with Title & View Mode Selector */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <CardTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              Performance Trajectory
            </CardTitle>

            {/* Momentum Pill */}
            {chartData.length > 1 ? (
              <Badge
                variant="outline"
                className={`text-[11px] py-0.5 px-2 rounded-full font-semibold flex items-center gap-1 ${
                  stats.isImproving
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                }`}
              >
                {stats.isImproving ? (
                  <>
                    <TrendingUp className="size-3 text-emerald-500" />
                    {stats.delta > 0 ? `+${stats.delta}% Gain` : "Consistent Pace"}
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
                className="bg-primary/10 text-primary border-primary/20 text-[11px] py-0.5 px-2 rounded-full font-semibold"
              >
                Active Trend
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            Dynamic accuracy curve and questions completed across all evaluations.
          </CardDescription>
        </div>

        {/* View Mode Segmented Switcher */}
        <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/60 self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setViewMode("accuracy")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === "accuracy"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="size-3.5" />
            Accuracy (%)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("volume")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === "volume"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="size-3.5" />
            Questions (Vol)
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* 2. Compact Inline Key Stats Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Latest Score:</span>
            <span className="font-bold text-foreground text-sm">{stats.currentAccuracy}%</span>
          </div>

          <div className="hidden sm:block h-3.5 w-px bg-border/60" />

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Period Average:</span>
            <span className="font-bold text-foreground text-sm">{stats.avgAccuracy}%</span>
          </div>

          <div className="hidden sm:block h-3.5 w-px bg-border/60" />

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Peak Score:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1">
              <Award className="size-3.5" />
              {stats.peakAccuracy}%
            </span>
          </div>

          <div className="hidden sm:block h-3.5 w-px bg-border/60" />

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Questions:</span>
            <span className="font-bold text-foreground text-sm">
              {stats.totalAnswered} answered
            </span>
          </div>

          <div className="hidden sm:block h-3.5 w-px bg-border/60" />

          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <Target className="size-3.5" />
            <span>Target Benchmark: 75%</span>
          </div>
        </div>

        {/* 3. Spacious, Ultra-Smooth Chart Canvas */}
        <div className="h-[290px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "accuracy" ? (
              <AreaChart data={chartData} margin={{ top: 14, right: 14, left: -14, bottom: 0 }}>
                <defs>
                  {/* Subtle, eye-warming gradient for accuracy curve */}
                  <linearGradient id="performanceAccuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="50%" stopColor="#6366f1" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  className="stroke-border/30"
                />

                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-muted-foreground"
                  tickMargin={10}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-muted-foreground"
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(val) => `${val}%`}
                />

                {/* Target Benchmark Line at 75% */}
                <ReferenceLine
                  y={75}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeOpacity={0.7}
                  strokeWidth={1.5}
                  label={{
                    value: "Target 75%",
                    position: "insideTopRight",
                    fill: "#10b981",
                    fontSize: 10.5,
                    fontWeight: 600,
                  }}
                />

                {/* Glassmorphic Interactive Tooltip */}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0]?.payload;
                    const acc = item?.accuracy ?? 0;
                    const isAboveTarget = acc >= 75;

                    return (
                      <div className="bg-popover/95 backdrop-blur-md border border-border/80 rounded-xl shadow-xl p-3 text-xs space-y-2 min-w-[170px] z-50">
                        <div className="font-semibold text-foreground flex items-center justify-between border-b border-border/50 pb-1.5">
                          <span>{label}</span>
                          <span
                            className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
                              isAboveTarget
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25"
                                : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25"
                            }`}
                          >
                            {isAboveTarget ? "Above Target" : "Review Needed"}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Accuracy:</span>
                            <span className="font-bold text-foreground text-sm">{acc}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Questions Answered:</span>
                            <span className="font-medium text-foreground">
                              {item?.answered ?? 0} Qs
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#performanceAccuracyGradient)"
                  activeDot={{
                    r: 5,
                    stroke: "#6366f1",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                />
              </AreaChart>
            ) : (
              /* Bar Chart for Question Volume */
              <BarChart data={chartData} margin={{ top: 14, right: 14, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id="performanceVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  className="stroke-border/30"
                />

                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-muted-foreground"
                  tickMargin={10}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-muted-foreground"
                  allowDecimals={false}
                  tickFormatter={(val) => `${val} Qs`}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0]?.payload;

                    return (
                      <div className="bg-popover/95 backdrop-blur-md border border-border/80 rounded-xl shadow-xl p-3 text-xs space-y-1.5 min-w-[150px] z-50">
                        <div className="font-semibold text-foreground border-b border-border/50 pb-1">
                          {label}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Questions Answered:</span>
                          <span className="font-bold text-foreground text-sm">
                            {item?.answered ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="font-medium text-foreground">
                            {item?.accuracy ?? 0}%
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />

                <Bar
                  dataKey="answered"
                  fill="url(#performanceVolumeGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
