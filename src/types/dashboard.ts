import type { ISODateString, UUID, TestMode } from "./domain";

export interface TrendPoint {
  date: ISODateString;
  accuracy: number;
  answered: number;
}

export interface TopicPerformance {
  topic: string;
  attempts: number;
  correct: number;
  incorrect: number;
  distinct_questions: number;
  accuracy: number;
}

export interface RecentActivity {
  id: UUID;
  title: string;
  mode: TestMode;
  practice_mode?: string | null;
  score: number | null;
  percentage: number | null;
  answered_questions: number;
  total_questions: number;
  submitted_at: ISODateString;
}

export interface BankSummary {
  id: UUID;
  name: string;
  question_count: number;
  tests_completed: number;
  avg_accuracy: number;
  last_activity: ISODateString | null;
}

export interface DashboardMetrics {
  total_questions: number;
  questions_practiced: number;
  tests_completed: number;
  overall_accuracy: number | null;
  trend: TrendPoint[];
  strong_topics: TopicPerformance[];
  weak_topics: TopicPerformance[];
  recent_activity: RecentActivity[];
  bank_summaries: BankSummary[];
}
