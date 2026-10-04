import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  loading?: boolean;
  trend?: string;
  accentColor?: "primary" | "emerald" | "blue" | "amber" | "purple";
}

export function DashboardMetricCard({
  title,
  value,
  description,
  icon,
  loading,
  trend,
  accentColor = "primary",
}: DashboardMetricCardProps) {
  const accentStyles = {
    primary: "from-primary/10 to-transparent text-primary",
    emerald: "from-emerald-500/10 to-transparent text-emerald-600 dark:text-emerald-400",
    blue: "from-blue-500/10 to-transparent text-blue-600 dark:text-blue-400",
    amber: "from-amber-500/10 to-transparent text-amber-600 dark:text-amber-400",
    purple: "from-purple-500/10 to-transparent text-purple-600 dark:text-purple-400",
  };

  const iconBgStyles = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/40 group">
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${accentStyles[accentColor]} rounded-bl-full pointer-events-none transition-transform group-hover:scale-110`}
      />

      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={`p-2 rounded-lg border ${iconBgStyles[accentColor]} transition-colors`}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="relative">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {value}
            </div>
            <div className="flex items-center justify-between gap-2">
              {description && (
                <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
              )}
              {trend && (
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                  {trend}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
