import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuestionDifficulty, CorrectAnswer } from "@/types/domain";

export const questionSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  optionA: z.string().min(1, "Option A is required"),
  optionB: z.string().min(1, "Option B is required"),
  optionC: z.string().min(1, "Option C is required"),
  optionD: z.string().min(1, "Option D is required"),
  correctAnswer: z.enum(["A", "B", "C", "D"], {
    required_error: "Please select the correct answer",
  }),
  explanation: z.string().optional().nullable(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().nullable(),
  topic: z.string().optional().nullable(),
  sourceReference: z.string().optional().nullable(),
});

export type QuestionValues = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  initialValues?: Partial<QuestionValues>;
  onSubmit: (values: QuestionValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export function QuestionForm({
  initialValues,
  onSubmit,
  isLoading,
  submitLabel = "Save Question",
  onCancel,
}: QuestionFormProps) {
  const form = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(questionSchema) as any,
    defaultValues: {
      questionText: initialValues?.questionText || "",
      optionA: initialValues?.optionA || "",
      optionB: initialValues?.optionB || "",
      optionC: initialValues?.optionC || "",
      optionD: initialValues?.optionD || "",
      correctAnswer: initialValues?.correctAnswer || "",
      explanation: initialValues?.explanation || "",
      difficulty: (initialValues?.difficulty as any) || undefined,
      topic: initialValues?.topic || "",
      sourceReference: initialValues?.sourceReference || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        {/* Question Text */}
        <FormField
          control={form.control as any}
          name="questionText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your question here..."
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Options and Correct Answer Selection */}
        <div className="space-y-4">
          <div className="text-sm font-medium">Answer Options * (Select the correct one)</div>
          <FormField
            control={form.control as any}
            name="correctAnswer"
            render={({ field: radioField }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <RadioGroup
                    onValueChange={radioField.onChange}
                    defaultValue={radioField.value}
                    className="flex flex-col gap-3"
                  >
                    {(["A", "B", "C", "D"] as const).map((opt) => (
                      <div key={opt} className="flex items-center space-x-3">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={opt} />
                          </FormControl>
                        </FormItem>
                        <div className="flex-1">
                          <FormField
                            control={form.control as any}
                            name={`option${opt}`}
                            render={({ field: inputField }) => (
                              <FormItem className="w-full space-y-0">
                                <FormControl>
                                  <Input
                                    placeholder={`Option ${opt} answer text...`}
                                    {...inputField}
                                    className={
                                      radioField.value === opt
                                        ? "border-primary ring-1 ring-primary"
                                        : ""
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="pt-2" />
              </FormItem>
            )}
          />
        </div>

        {/* Explanation */}
        <FormField
          control={form.control as any}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain why the answer is correct and provide context or tips..."
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Classification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control as any}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. TCP/IP" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="sourceReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Reference</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Textbook p.42" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
