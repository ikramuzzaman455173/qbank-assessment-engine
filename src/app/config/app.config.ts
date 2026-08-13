/** Static application configuration. No secrets here. */
export const appConfig = {
  name: "QBank",
  fullName: "QBank — MCQ Question Bank & Smart Test Platform",
  description:
    "Build your own MCQ question banks, generate smart tests, practice weak questions and track mastery over time.",
  supportEmail: "support@qbank.app",
} as const;

export type AppConfig = typeof appConfig;
