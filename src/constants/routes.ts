/** Central route registry — never hard-code paths in components. */
export const ROUTES = {
  landing: "/",
  auth: "/auth",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  questionBanks: "/question-banks",
  questionBank: (id: string) => `/question-banks/${id}`,
  importQuestions: (id: string) => `/question-banks/${id}/import`,
  tests: "/tests",
  practice: "/practice",
  analytics: "/analytics",
  settings: "/settings",
  profile: "/profile",
} as const;
