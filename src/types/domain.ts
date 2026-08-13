/**
 * Centralized domain entities for the platform.
 * Feature modules must reuse these types instead of redeclaring shapes.
 */

export type UUID = string;
export type ISODateString = string;

export interface Timestamps {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface OwnedEntity {
  id: UUID;
  ownerId: UUID;
}

export interface Profile extends Timestamps {
  id: UUID;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

export interface QuestionBank extends OwnedEntity, Timestamps {
  name: string;
  description: string | null;
  subject: string | null;
  topic: string | null;
  questionCount: number;
}

export type QuestionDifficulty = "easy" | "medium" | "hard";
export type CorrectAnswer = "A" | "B" | "C" | "D";

export interface Question extends OwnedEntity, Timestamps {
  bankId: UUID;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswer;
  explanation: string | null;
  topic: string | null;
  difficulty: QuestionDifficulty | null;
  sourceReference: string | null;
}

export type SourceKind = "pdf" | "json" | "manual";
export type SourceStatus = "uploaded" | "processing" | "review" | "completed" | "failed";

export interface UploadedSource extends OwnedEntity, Timestamps {
  kind: SourceKind;
  status: SourceStatus;
  fileName: string;
  storagePath: string | null;
  fileSize: number | null;
  bankId: UUID | null;
  totalQuestions: number;
  importedQuestions: number;
}

export type TestMode = "full" | "random" | "custom" | "practice";
export type TestStatus = "draft" | "in_progress" | "completed";

export interface Test extends OwnedEntity, Timestamps {
  questionBankId: UUID;
  title: string;
  mode: TestMode;
  totalQuestions: number;
  difficulty: QuestionDifficulty | "mixed" | null;
  topic: string | null;
  source: string | null;
  timerEnabled: boolean;
  durationSeconds: number | null;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

export interface TestQuestion extends Timestamps {
  id: UUID;
  testId: UUID;
  originalQuestionId: UUID | null;
  questionOrder: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswer;
  explanation: string | null;
  topic: string | null;
  difficulty: QuestionDifficulty | null;
  sourceReference: string | null;
}

export type AttemptStatus = "in_progress" | "completed" | "auto_submitted" | "abandoned";

export interface Attempt extends OwnedEntity, Timestamps {
  testId: UUID;
  status: AttemptStatus;
  startedAt: ISODateString;
  submittedAt: ISODateString | null;
  timeSpentSeconds: number | null;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number | null;
  incorrectAnswers: number | null;
  unansweredQuestions: number | null;
  score: number | null;
  percentage: number | null;
}

export interface AttemptAnswer {
  id: UUID;
  attemptId: UUID;
  testQuestionId: UUID;
  selectedAnswer: CorrectAnswer | null;
  isCorrect: boolean | null;
  isMarkedForReview: boolean;
  answeredAt: ISODateString | null;
}

export type MasteryLevel = "unattempted" | "weak" | "learning" | "mastered";

export interface QuestionProgress extends OwnedEntity, Timestamps {
  questionId: UUID;
  attempts: number;
  correctAttempts: number;
  mastery: MasteryLevel;
  lastAttemptedAt: ISODateString | null;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
