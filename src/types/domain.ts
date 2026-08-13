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
  displayName: string | null;
  avatarUrl: string | null;
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

export type TestMode = "practice" | "exam";
export type TestStatus = "draft" | "ready" | "in_progress" | "completed";

export interface Test extends OwnedEntity, Timestamps {
  bankId: UUID;
  title: string;
  mode: TestMode;
  status: TestStatus;
  questionCount: number;
  durationMinutes: number | null;
}

export interface AttemptAnswer {
  questionId: UUID;
  selectedOptionIds: string[];
  isCorrect: boolean | null;
  answeredAt: ISODateString | null;
}

export interface Attempt extends OwnedEntity, Timestamps {
  testId: UUID;
  startedAt: ISODateString;
  submittedAt: ISODateString | null;
  score: number | null;
  answers: AttemptAnswer[];
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
