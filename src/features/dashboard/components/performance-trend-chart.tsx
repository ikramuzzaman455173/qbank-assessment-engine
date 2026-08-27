import { TrendPoint } from "@/types/dashboard";
import { format, parseISO } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrendingUp, PlayCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface PerformanceTrendChartProps {
  data: TrendPoint[];
  loading?: boolean;
}

export function PerformanceTrendChart({ data, loading }: PerformanceTrendChartProps) {
  if (loading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Performance Trend</CardTitle>
          <CardDescription>Accuracy and learning progress over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Performance Trend</CardTitle>
          <CardDescription>Accuracy and learning progress over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-center p-6 bg-muted/20 rounded-lg m-4 border border-dashed">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-foreground">No Trend Data Yet</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Complete tests or practice questions to start visualizing your daily accuracy trajectory.
          </p>
          <Button size="sm" className="mt-4 gap-1.5" asChild>
            <Link to="/practice/config">
              <PlayCircle className="w-4 h-4" />
              Start Practice Session
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = data.map((d) => ({
    ...d,
    formattedDate: format(parseISO(d.date), "MMM d"),
    accuracy: Math.round(d.accuracy),
  }));

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">Performance Trend</CardTitle>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Live Accuracy
            </span>
          </div>
          <CardDescription>Your score trajectory across recent practice sessions and tests.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "currentColor" }}
                className="text-muted-foreground"
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "currentColor" }}
                className="text-muted-foreground"
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover/95 backdrop-blur-md border rounded-lg shadow-lg p-3 text-xs space-y-1.5 min-w-[130px]">
                        <div className="font-semibold text-foreground border-b pb-1">{label}</div>
                        <div className="flex justify-between gap-3 items-center">
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="font-bold text-primary text-sm">
                            {payload[0]?.value}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-3 items-center">
                          <span className="text-muted-foreground">Answered:</span>
                          <span className="font-medium text-foreground">
                            {payload[0]?.payload?.answered} Qs
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#accuracyGradient)"
                dot={{ r: 3.5, strokeWidth: 2, fill: "hsl(var(--background))", stroke: "hsl(var(--primary))" }}
                activeDot={{ r: 5.5, strokeWidth: 0, fill: "hsl(var(--primary))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
