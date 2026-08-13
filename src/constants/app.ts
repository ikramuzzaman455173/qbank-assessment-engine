/** Domain-wide limits and defaults. Keep magic numbers out of components. */
export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

export const QUESTION_LIMITS = {
  minOptions: 2,
  maxOptions: 6,
  maxStemLength: 2000,
  maxExplanationLength: 4000,
} as const;

export const TEST_LIMITS = {
  minQuestions: 1,
  maxQuestions: 200,
  defaultQuestions: 20,
  minDurationMinutes: 1,
  maxDurationMinutes: 300,
} as const;

export const UPLOAD_LIMITS = {
  maxFileSizeBytes: 20 * 1024 * 1024,
  acceptedMimeTypes: ["application/pdf", "application/json"],
} as const;
