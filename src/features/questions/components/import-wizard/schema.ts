import { z } from "zod";

export const rawQuestionSchema = z.object({
  question_text: z.string().min(1, "Question text is required"),
  option_a: z.string().min(1, "Option A is required"),
  option_b: z.string().min(1, "Option B is required"),
  option_c: z.string().min(1, "Option C is required"),
  option_d: z.string().min(1, "Option D is required"),
  correct_answer: z.enum(["A", "B", "C", "D"], {
    errorMap: () => ({ message: "Correct answer must be A, B, C, or D" }),
  }),
  explanation: z.string().optional().nullable(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().nullable(),
  topic: z.string().optional().nullable(),
  source_reference: z.string().optional().nullable(),
});

export const rawImportSchema = z.object({
  questions: z.array(rawQuestionSchema),
});

export type RawQuestion = z.infer<typeof rawQuestionSchema>;

export type ParsedQuestionResult = {
  originalIndex: number;
  data: RawQuestion | null;
  error: string | null;
  status: "valid" | "invalid" | "needs_review";
};
