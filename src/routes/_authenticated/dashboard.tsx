import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useSession } from '@/features/auth/hooks/use-session'
import { useDashboardMetrics } from '@/features/dashboard/api/use-dashboard-metrics'
import { PageHeader } from '@/components/common/page-header'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardMetricCard } from '@/features/dashboard/components/dashboard-metric-card'
import { PerformanceTrendChart } from '@/features/dashboard/components/performance-trend-chart'
import { TopicPerformanceTable } from '@/features/dashboard/components/topic-performance-table'
import { WeakAreasRecommendations } from '@/features/dashboard/components/weak-areas-recommendations'
import { RecentActivityList } from '@/features/dashboard/components/recent-activity-list'
import { QuestionBankSummaryList } from '@/features/dashboard/components/question-bank-summary-list'
import { Target, FileQuestion, GraduationCap, Percent } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { session } = useSession()
  const [days, setDays] = useState<number>(30)
  
  const { data: metrics, isLoading, isError } = useDashboardMetrics(days)
  const profileName = session?.user?.user_metadata?.['full_name'] || 'Student'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader 
          title={`Good morning, ${profileName}`}
          description="Keep building your knowledge one question at a time."
        />
        
        <Select 
          value={days.toString()} 
          onValueChange={(val) => setDays(parseInt(val))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
            <SelectItem value="0">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          Unable to load your performance data. Please try again.
        </div>
      )}

      {/* 1. Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard 
          title="Total Questions"
          value={metrics?.total_questions ?? 0}
          icon={<FileQuestion className="w-4 h-4" />}
          loading={isLoading}
        />
        <DashboardMetricCard 
          title="Questions Practiced"
          value={metrics?.questions_practiced ?? 0}
          icon={<Target className="w-4 h-4" />}
          loading={isLoading}
        />
        <DashboardMetricCard 
          title="Tests Completed"
          value={metrics?.tests_completed ?? 0}
          icon={<GraduationCap className="w-4 h-4" />}
          loading={isLoading}
        />
        <DashboardMetricCard 
          title="Overall Accuracy"
          value={metrics?.overall_accuracy != null ? `${Math.round(metrics.overall_accuracy)}%` : 'N/A'}
          icon={<Percent className="w-4 h-4" />}
          loading={isLoading}
        />
      </div>

      {/* 2. Performance Trend & Activity */}
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

      {/* 3. Needs Attention */}
      <WeakAreasRecommendations 
        weakTopics={metrics?.weak_topics || []} 
        loading={isLoading} 
      />

      {/* 4. Topic Performance & Question Banks */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TopicPerformanceTable 
            title="Strongest Topics"
            description="Topics where you excel."
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
