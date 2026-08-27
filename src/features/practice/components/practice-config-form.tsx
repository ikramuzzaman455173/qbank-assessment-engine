import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useQuestionBanks } from "@/features/question-banks/api/use-question-banks";
import { useEligibleQuestionsCount } from "@/features/tests/api/use-eligible-questions-count";
import { DurationPicker } from "@/components/common/duration-picker";

const configSchema = z.object({
  bankId: z.string().min(1, "Please select a Question Bank"),
  practiceMode: z.string(),
  totalQuestions: z.number().min(1, "Must have at least 1 question"),
  difficulty: z.string().optional().nullable(),
  topic: z.string().optional().nullable(),
  timerEnabled: z.boolean(),
  durationSeconds: z.number().min(10, "Duration must be at least 10 seconds").optional().nullable(),
  randomizeQuestions: z.boolean(),
  randomizeOptions: z.boolean(),
});

type ConfigValues = z.infer<typeof configSchema>;

export function PracticeConfigForm({ initialMode, initialTopic }: { initialMode: string, initialTopic?: string | undefined }) {
  const { data: banks, isLoading: isBanksLoading } = useQuestionBanks();
  const navigate = useNavigate();
  const [generateError, setGenerateError] = useState<string | null>(null);

  const form = useForm<ConfigValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      bankId: "",
      practiceMode: initialMode || "exam",
      totalQuestions: 10,
      difficulty: "",
      topic: initialTopic || "",
      timerEnabled: false,
      durationSeconds: 600, // 10 minutes default
      randomizeQuestions: true,
      randomizeOptions: true,
    },
  });

  const watchBankId = form.watch("bankId");
  const watchDifficulty = form.watch("difficulty");
  const watchTopic = form.watch("topic");
  const watchTimerEnabled = form.watch("timerEnabled");

  const { data: eligibleCount = 0, isLoading: isCountLoading } = useEligibleQuestionsCount({
    bankId: watchBankId,
    difficulty: (watchDifficulty && watchDifficulty !== "mixed" ? watchDifficulty : null) as any,
    topic: watchTopic || null,
  });

  const onSubmit = (values: ConfigValues) => {
    setGenerateError(null);
    void navigate({
      to: "/practice",
      search: {
        bankId: values.bankId,
        practiceMode: values.practiceMode,
        totalQuestions: Math.min(values.totalQuestions, eligibleCount || values.totalQuestions),
        difficulty: values.difficulty === "mixed" ? undefined : (values.difficulty || undefined),
        topic: values.topic || undefined,
        timerEnabled: values.timerEnabled,
        durationSeconds: values.timerEnabled ? (values.durationSeconds || 600) : undefined,
        randomizeQuestions: values.randomizeQuestions,
        randomizeOptions: values.randomizeOptions,
      } as any
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Session Settings</CardTitle>
        <CardDescription>
          Configure how you want to practice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Bank Selection */}
            <FormField
              control={form.control}
              name="bankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Bank *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isBanksLoading ? "Loading..." : "Select a Question Bank"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {banks?.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name} ({b.questionCount} questions)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="practiceMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practice Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "exam"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="exam">Exam Mode (Result & Review at End)</SelectItem>
                        <SelectItem value="instant">Learn Mode (Instant Feedback)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalQuestions"
                render={({ field }) => {
                  const requestedMoreThanAvailable = watchBankId && !isCountLoading && eligibleCount > 0 && field.value > eligibleCount;
                  return (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={eligibleCount || 100}
                          placeholder="e.g., 10"
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      {requestedMoreThanAvailable && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          Only {eligibleCount} questions available.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Filter (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Mixed" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mixed">Mixed (All)</SelectItem>
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
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Filter (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Physiology (leave blank for all)" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchBankId && (
              <Alert className="bg-muted/50">
                <AlertDescription className="font-medium text-sm flex items-center justify-between">
                  <span>Available Eligible Questions:</span>
                  {isCountLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="text-lg">{eligibleCount}</span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm text-muted-foreground">Timer & Question Settings</h4>
              
              <FormField
                control={form.control}
                name="timerEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Timer</FormLabel>
                      <FormDescription>
                        Set a countdown timer for this practice session.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchTimerEnabled && (
                <FormField
                  control={form.control}
                  name="durationSeconds"
                  render={({ field }) => (
                    <FormItem className="rounded-xl border p-4 bg-muted/20 space-y-3">
                      <div>
                        <FormLabel className="text-base font-semibold">Practice Time Limit</FormLabel>
                        <FormDescription>
                          Set hours, minutes, or seconds. The practice session will auto-submit when the countdown ends.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <DurationPicker
                          value={field.value ?? 600}
                          onChange={field.onChange}
                          minSeconds={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="randomizeQuestions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Randomize Question Order</FormLabel>
                      <FormDescription>
                        Questions will be shown in a random order.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="randomizeOptions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Randomize Options</FormLabel>
                      <FormDescription>
                        Shuffle the A, B, C, D choices for each question.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {generateError && (
              <Alert variant="destructive">
                <AlertDescription>{generateError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isCountLoading || !watchBankId || eligibleCount === 0}
              >
                Start Practice Session
              </Button>
              {!watchBankId ? (
                <p className="text-xs text-center text-muted-foreground">Select a question bank to start practicing.</p>
              ) : eligibleCount === 0 && !isCountLoading ? (
                <p className="text-xs text-center text-amber-600 dark:text-amber-400">No questions match the current filters. Please adjust difficulty or topic.</p>
              ) : null}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
