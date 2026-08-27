import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useSession } from '@/features/auth/hooks/use-session'
import { useDashboardMetrics } from '@/features/dashboard/api/use-dashboard-metrics'
import { useGeminiKey } from '@/features/settings/api/use-gemini-key'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardMetricCard } from '@/features/dashboard/components/dashboard-metric-card'
import { PerformanceTrendChart } from '@/features/dashboard/components/performance-trend-chart'
import { TopicPerformanceTable } from '@/features/dashboard/components/topic-performance-table'
import { WeakAreasRecommendations } from '@/features/dashboard/components/weak-areas-recommendations'
import { RecentActivityList } from '@/features/dashboard/components/recent-activity-list'
import { QuestionBankSummaryList } from '@/features/dashboard/components/question-bank-summary-list'
import { 
  Target, 
  FileQuestion, 
  GraduationCap, 
  Percent, 
  PlayCircle, 
  PlusCircle, 
  FolderPlus, 
  Sparkles, 
  Zap,
  CheckCircle2,
  Calendar
} from 'lucide-react'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { session } = useSession()
  const [days, setDays] = useState<number>(30)
  const { status: geminiStatus } = useGeminiKey()
  
  const { data: metrics, isLoading, isError } = useDashboardMetrics(days)
  const profileName = session?.user?.user_metadata?.['full_name'] || 'Learner'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* 1. Hero & Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
                {greeting}, {profileName}! 👋
              </h1>
              
              {/* AI Key Status Badge */}
              {geminiStatus.source === "custom" ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-xs py-0.5 px-2 flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  Personal AI Active
                </Badge>
              ) : (
                <Link to="/settings" className="inline-flex">
                  <Badge variant="outline" className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/20 text-xs py-0.5 px-2 flex items-center gap-1 cursor-pointer transition-colors">
                    <Zap className="size-3 text-amber-500" />
                    Shared AI Quota (Configure)
                  </Badge>
                </Link>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Track your exam readiness, master your weak areas, and generate smart practice questions with Google Gemini.
            </p>

            {/* Quick Learning Action Shortcuts */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3">
              <Button size="sm" className="gap-1.5 shadow-sm" asChild>
                <Link to="/practice/config">
                  <PlayCircle className="size-4" />
                  Quick Practice
                </Link>
              </Button>
              <Button variant="secondary" size="sm" className="gap-1.5" asChild>
                <Link to="/tests/create">
                  <PlusCircle className="size-4" />
                  Create Test
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 bg-background/80" asChild>
                <Link to="/question-banks">
                  <FolderPlus className="size-4" />
                  Question Banks
                </Link>
              </Button>
            </div>
          </div>

          {/* Time Period Filter */}
          <div className="flex items-center gap-2 self-start lg:self-center bg-background/80 backdrop-blur p-1.5 rounded-xl border">
            <Calendar className="size-4 text-muted-foreground ml-2" />
            <Select 
              value={days.toString()} 
              onValueChange={(val) => setDays(parseInt(val))}
            >
              <SelectTrigger className="w-[135px] border-0 bg-transparent focus:ring-0 shadow-none text-xs font-medium">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="0">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">
          Unable to load your performance data. Please check your connection and refresh the page.
        </div>
      )}

      {/* 2. Key Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard 
          title="Total Repository"
          value={metrics?.total_questions ?? 0}
          description="Available in your question banks"
          icon={<FileQuestion className="w-4 h-4" />}
          loading={isLoading}
          accentColor="purple"
        />
        <DashboardMetricCard 
          title="Questions Practiced"
          value={metrics?.questions_practiced ?? 0}
          description="Attempted during this period"
          icon={<Target className="w-4 h-4" />}
          loading={isLoading}
          accentColor="blue"
        />
        <DashboardMetricCard 
          title="Tests Completed"
          value={metrics?.tests_completed ?? 0}
          description="Formal test sessions finished"
          icon={<GraduationCap className="w-4 h-4" />}
          loading={isLoading}
          accentColor="emerald"
        />
        <DashboardMetricCard 
          title="Overall Accuracy"
          value={metrics?.overall_accuracy != null ? `${Math.round(metrics.overall_accuracy)}%` : 'N/A'}
          description={metrics?.overall_accuracy != null && metrics.overall_accuracy >= 75 ? "Target met (≥ 75%)" : "Keep practicing"}
          icon={<Percent className="w-4 h-4" />}
          loading={isLoading}
          accentColor={metrics?.overall_accuracy != null && metrics.overall_accuracy >= 75 ? "emerald" : "amber"}
        />
      </div>

      {/* 3. Performance Trend & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-4">
        <PerformanceTrendChart 
          data={metrics?.trend || []} 
          loading={isLoading} 
        />
        <div className="lg:col-span-1">
          <RecentActivityList 
            activities={metrics?.recent_activity || []} 
            loading={isLoading} 
          />
        </div>
      </div>

      {/* 4. Weak Areas / Targeted Recommendations */}
      <WeakAreasRecommendations 
        weakTopics={metrics?.weak_topics || []} 
        loading={isLoading} 
      />

      {/* 5. Strongest Topics & Question Banks */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TopicPerformanceTable 
            title="Strongest Topics"
            description="Topics where your performance is highest."
            topics={metrics?.strong_topics || []}
            loading={isLoading}
          />
        </div>
        <QuestionBankSummaryList 
          banks={metrics?.bank_summaries || []} 
          loading={isLoading} 
        />
      </div>
    </div>
  )
}
