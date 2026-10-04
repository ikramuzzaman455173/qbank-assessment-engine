import type { Session, User } from "@supabase/supabase-js";
import type { DashboardMetrics } from "@/types/dashboard";
import type { QuestionBank, Question } from "@/types/domain";

export const DEMO_CREDENTIALS = {
  email: "demo@knowledgecanvas.dev",
  password: "Demo@Recruiter2026!",
};

export const GUEST_USER: User = {
  id: "guest-demo-user-id",
  app_metadata: {},
  user_metadata: { full_name: "Guest Reviewer (Demo)" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "demo@knowledgecanvas.dev",
} as unknown as User;

export const GUEST_SESSION: Session = {
  access_token: "guest-demo-access-token",
  token_type: "bearer",
  expires_in: 3600 * 24 * 7,
  refresh_token: "guest-demo-refresh-token",
  user: GUEST_USER,
};

export function isGuestSession(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("kc_guest_session") === "true";
}

export function setGuestSession(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("kc_guest_session", "true");
  window.dispatchEvent(new Event("kc-auth-change"));
}

export function clearGuestSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("kc_guest_session");
  window.dispatchEvent(new Event("kc-auth-change"));
}

export const GUEST_BANKS: QuestionBank[] = [
  {
    id: "demo-bank-1",
    ownerId: "guest-demo-user-id",
    name: "Full-Stack Web & React Engineering",
    description:
      "Core concepts covering React 19 architecture, hooks, state management, HTTP/3, and web performance.",
    subject: "Software Engineering",
    topic: "React & Modern Web",
    questionCount: 6,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-bank-2",
    ownerId: "guest-demo-user-id",
    name: "Computer Science & System Architecture",
    description:
      "Data structures, algorithms, concurrency, caching, and database design questions.",
    subject: "Computer Science",
    topic: "Algorithms & Databases",
    questionCount: 6,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const GUEST_QUESTIONS: Question[] = [
  {
    id: "guest-q-1",
    ownerId: "guest-demo-user-id",
    bankId: "demo-bank-1",
    questionText:
      "Which hook in React 19 is specifically designed to handle asynchronous transitions without manual loading states?",
    optionA: "useActionState",
    optionB: "useMemo",
    optionC: "useEffect",
    optionD: "useCallback",
    correctAnswer: "A",
    explanation:
      "React 19 introduced useActionState to manage pending states, error handling, and form action responses natively.",
    difficulty: "medium",
    topic: "React 19 & Architecture",
    sourceReference: "React 19 Official Documentation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "guest-q-2",
    ownerId: "guest-demo-user-id",
    bankId: "demo-bank-1",
    questionText: "What is the primary architectural advantage of HTTP/3 compared to HTTP/2?",
    optionA:
      "It eliminates Head-of-Line (HoL) blocking at the transport layer using QUIC over UDP.",
    optionB: "It replaces TLS encryption with unencrypted plaintext compression.",
    optionC: "It removes DNS resolution overhead entirely.",
    optionD: "It forces synchronous blocking across all TCP sockets.",
    correctAnswer: "A",
    explanation:
      "HTTP/3 runs over QUIC (UDP), meaning a dropped packet only halts the affected stream rather than stalling all concurrent streams as in TCP.",
    difficulty: "hard",
    topic: "Web Protocols & Networking",
    sourceReference: "IETF RFC 9114",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "guest-q-3",
    ownerId: "guest-demo-user-id",
    bankId: "demo-bank-1",
    questionText:
      "In TypeScript, what is the fundamental difference between the 'unknown' and 'any' types?",
    optionA:
      "'unknown' is type-safe and requires narrowing or type-checking before performing operations, whereas 'any' disables all type checking.",
    optionB: "'unknown' can only represent primitive types, whereas 'any' represents objects.",
    optionC: "'unknown' is deprecated in modern TypeScript.",
    optionD: "'any' enforces runtime validation while 'unknown' is compile-time only.",
    correctAnswer: "A",
    explanation:
      "'unknown' represents any value safely: TypeScript prevents accessing properties or methods on an unknown value until you narrow the type with typeof or instanceof.",
    difficulty: "easy",
    topic: "TypeScript Fundamentals",
    sourceReference: "TypeScript Handbook",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "guest-q-4",
    ownerId: "guest-demo-user-id",
    bankId: "demo-bank-1",
    questionText:
      "Which index type in PostgreSQL is best suited for accelerating full-text search queries using tsvector?",
    optionA: "GIN (Generalized Inverted Index)",
    optionB: "B-Tree Index",
    optionC: "Hash Index",
    optionD: "BRIN Index",
    correctAnswer: "A",
    explanation:
      "GIN indexes are designed to handle composite items like arrays and document lexemes, mapping each word to all rows containing it.",
    difficulty: "medium",
    topic: "Database Design & SQL",
    sourceReference: "PostgreSQL Documentation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "guest-q-5",
    ownerId: "guest-demo-user-id",
    bankId: "demo-bank-1",
    questionText: "What is the worst-case time complexity of QuickSort?",
    optionA: "O(n²)",
    optionB: "O(n log n)",
    optionC: "O(n)",
    optionD: "O(log n)",
    correctAnswer: "A",
    explanation:
      "When the selected pivot is repeatedly the smallest or greatest element (e.g., sorted array with first element as pivot), QuickSort degrades to O(n²).",
    difficulty: "easy",
    topic: "Algorithms & Complexity",
    sourceReference: "CLRS Algorithms",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "guest-q-6",
    ownerId: "guest-demo-user-id",
    bankId: "demo-bank-1",
    questionText:
      "In modern Core Web Vitals, what does the INP (Interaction to Next Paint) metric evaluate?",
    optionA:
      "Overall page responsiveness to user interactions throughout the full lifespan of the page.",
    optionB: "The time taken to download the initial HTML bundle.",
    optionC: "The duration of the largest layout shift on initial load.",
    optionD: "The time until the browser first paints text or images.",
    correctAnswer: "A",
    explanation:
      "INP is a Core Web Vital that replaced FID in 2024, assessing the latency of all click, tap, and keyboard interactions during the session.",
    difficulty: "hard",
    topic: "Web Performance & Core Web Vitals",
    sourceReference: "web.dev/inp",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const GUEST_METRICS: DashboardMetrics = {
  total_questions: 48,
  questions_practiced: 36,
  tests_completed: 5,
  overall_accuracy: 82.5,
  trend: [
    { date: "2026-09-28", accuracy: 72, answered: 10 },
    { date: "2026-09-30", accuracy: 80, answered: 10 },
    { date: "2026-10-01", accuracy: 85, answered: 12 },
    { date: "2026-10-02", accuracy: 78, answered: 10 },
    { date: "2026-10-03", accuracy: 88, answered: 10 },
  ],
  strong_topics: [
    {
      topic: "React 19 & Architecture",
      attempts: 18,
      correct: 16,
      incorrect: 2,
      distinct_questions: 18,
      accuracy: 88.9,
    },
    {
      topic: "Algorithms & Complexity",
      attempts: 14,
      correct: 12,
      incorrect: 2,
      distinct_questions: 14,
      accuracy: 85.7,
    },
  ],
  weak_topics: [
    {
      topic: "System Design & Caching",
      attempts: 12,
      correct: 7,
      incorrect: 5,
      distinct_questions: 12,
      accuracy: 58.3,
    },
  ],
  recent_activity: [
    {
      id: "demo-attempt-1",
      title: "Full-Stack Web Engineering Assessment",
      mode: "custom",
      score: 9,
      total_questions: 10,
      answered_questions: 10,
      percentage: 90,
      submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: "demo-attempt-2",
      title: "CS Algorithms & Complexity Practice",
      mode: "random",
      score: 8,
      total_questions: 10,
      answered_questions: 10,
      percentage: 80,
      submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    },
  ],
  bank_summaries: [
    {
      id: "demo-bank-1",
      name: "Full-Stack Web & React Engineering",
      question_count: 6,
      tests_completed: 3,
      avg_accuracy: 88.5,
      last_activity: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: "demo-bank-2",
      name: "Computer Science & System Architecture",
      question_count: 6,
      tests_completed: 2,
      avg_accuracy: 76.0,
      last_activity: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    },
  ],
};
