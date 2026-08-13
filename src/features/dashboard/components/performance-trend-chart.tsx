import { TrendPoint } from "@/types/dashboard";
import { format, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceTrendChartProps {
  data: TrendPoint[];
  loading?: boolean;
}

export function PerformanceTrendChart({ data, loading }: PerformanceTrendChartProps) {
  if (loading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>Your accuracy across recent practice sessions.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>Your accuracy across recent practice sessions.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Complete more tests to see your progress trend.
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
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
        <CardDescription>Your accuracy across recent practice sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg shadow-sm p-2 text-sm">
                        <div className="font-semibold mb-1">{label}</div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="font-medium text-primary">
                            {payload[0].value}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Questions:</span>
                          <span className="font-medium">
                            {payload[0].payload.answered}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
