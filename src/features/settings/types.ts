export interface UserProfile {
  id: string;
  full_name: string | null;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  theme: "system" | "light" | "dark";
  default_test_question_count: number;
  default_test_timer: number | null;
  randomize_questions: boolean;
  randomize_options: boolean;
  default_practice_question_count: number;
  immediate_feedback: boolean;
  show_explanations: boolean;
  notification_preferences: Record<string, any>;
  gemini_api_key?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DataSummary {
  questionBanks: number;
  questions: number;
  tests: number;
  attempts: number;
  practiceSessions: number;
}
