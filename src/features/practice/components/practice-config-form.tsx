import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Loader2, 
  Sparkles, 
  Clock, 
  SlidersHorizontal, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight 
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useQuestionBanks } from "@/features/question-banks/api/use-question-banks";
import { useEligibleQuestionsCount } from "@/features/tests/api/use-eligible-questions-count";
import { DurationPicker } from "@/components/common/duration-picker";
import { cn } from "@/lib/utils";

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

const QUICK_QUESTION_PRESETS = [5, 10, 20, 30];

export function PracticeConfigForm({ initialMode, initialTopic }: { initialMode: string, initialTopic?: string | undefined }) {
  const { data: banks, isLoading: isBanksLoading } = useQuestionBanks();
  const navigate = useNavigate();
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Normalize initial mode: 'exam' vs 'instant' (default to learn/instant)
  const defaultMode = initialMode === "exam" ? "exam" : "instant";

  const form = useForm<ConfigValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      bankId: "",
      practiceMode: defaultMode,
      totalQuestions: 10,
      difficulty: "",
      topic: initialTopic || "",
      timerEnabled: defaultMode === "exam",
      durationSeconds: 600, // 10 minutes default
      randomizeQuestions: true,
      randomizeOptions: true,
    },
  });

  const watchBankId = form.watch("bankId");
  const watchPracticeMode = form.watch("practiceMode");
  const watchDifficulty = form.watch("difficulty");
  const watchTopic = form.watch("topic");
  const watchTimerEnabled = form.watch("timerEnabled");
  const watchTotalQuestions = form.watch("totalQuestions");

  // Auto-select first bank when loaded if none selected
  useEffect(() => {
    if (banks && banks.length > 0 && !form.getValues("bankId")) {
      form.setValue("bankId", banks[0]?.id as string);
    }
  }, [banks, form]);

  const { data: eligibleCount = 0, isLoading: isCountLoading } = useEligibleQuestionsCount({
    bankId: watchBankId,
    difficulty: (watchDifficulty && watchDifficulty !== "mixed" ? watchDifficulty : null) as any,
    topic: watchTopic || null,
  });

  // Mode Card Switch Handler
  const handleModeSelect = (mode: "instant" | "exam") => {
    form.setValue("practiceMode", mode);
    if (mode === "instant") {
      form.setValue("timerEnabled", false);
    } else {
      form.setValue("timerEnabled", true);
      const suggestedTime = Math.max(60, watchTotalQuestions * 60);
      form.setValue("durationSeconds", suggestedTime);
    }
  };

  const handleQuickCountSelect = (count: number) => {
    const safeCount = eligibleCount > 0 ? Math.min(count, eligibleCount) : count;
    form.setValue("totalQuestions", safeCount);
    if (watchTimerEnabled) {
      form.setValue("durationSeconds", Math.max(60, safeCount * 60));
    }
  };

  const onSubmit = (values: ConfigValues) => {
    setGenerateError(null);
    const finalCount = eligibleCount > 0 ? Math.min(values.totalQuestions, eligibleCount) : values.totalQuestions;
    
    void navigate({
      to: "/practice",
      search: {
        bankId: values.bankId,
        practiceMode: values.practiceMode,
        totalQuestions: finalCount,
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
    <Card className="max-w-2xl mx-auto shadow-md border-border/80">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Start Practice Session
        </CardTitle>
        <CardDescription>
          Choose your question bank and start practicing in seconds.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* 1. Visual Mode Selector Cards */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-foreground">Session Style</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Learn Mode Card */}
                <button
                  type="button"
                  onClick={() => handleModeSelect("instant")}
                  className={cn(
                    "relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer",
                    watchPracticeMode === "instant"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "p-2.5 rounded-lg shrink-0",
                    watchPracticeMode === "instant" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-foreground">Learn Mode</p>
                      {watchPracticeMode === "instant" && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Instant rationales & answers right after each selection.
                    </p>
                  </div>
                </button>

                {/* Exam Mode Card */}
                <button
                  type="button"
                  onClick={() => handleModeSelect("exam")}
                  className={cn(
                    "relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer",
                    watchPracticeMode === "exam"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "p-2.5 rounded-lg shrink-0",
                    watchPracticeMode === "exam" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-foreground">Exam Mode</p>
                      {watchPracticeMode === "exam" && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Timed simulation. Review score & full explanations at the end.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Bank Selection */}
            <FormField
              control={form.control}
              name="bankId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Question Bank *</FormLabel>
                    {watchBankId && eligibleCount > 0 && !isCountLoading && (
                      <Badge variant="secondary" className="font-normal text-xs">
                        {eligibleCount} questions available
                      </Badge>
                    )}
                  </div>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={isBanksLoading ? "Loading question banks..." : "Select a Question Bank"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {banks?.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          <span className="font-medium">{b.name}</span>
                          <span className="text-muted-foreground text-xs ml-2">({b.questionCount} Qs)</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 3. Number of Questions with Quick Chips */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Number of Questions</Label>
                <span className="text-xs text-muted-foreground">
                  Target: <strong className="text-foreground">{watchTotalQuestions}</strong> Qs
                </span>
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap items-center gap-2">
                {QUICK_QUESTION_PRESETS.map((preset) => {
                  const isSelected = watchTotalQuestions === preset;
                  const isExceeding = eligibleCount > 0 && preset > eligibleCount;
                  return (
                    <Button
                      key={preset}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      disabled={isExceeding && !isCountLoading}
                      onClick={() => handleQuickCountSelect(preset)}
                      className={cn(
                        "h-9 px-3.5 rounded-lg text-xs font-medium transition-all",
                        isSelected && "shadow-sm font-semibold"
                      )}
                    >
                      {preset} Questions
                    </Button>
                  );
                })}
                
                {/* Max questions chip if bank selected */}
                {eligibleCount > 0 && (
                  <Button
                    type="button"
                    variant={watchTotalQuestions === eligibleCount ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickCountSelect(eligibleCount)}
                    className={cn(
                      "h-9 px-3.5 rounded-lg text-xs font-medium",
                      watchTotalQuestions === eligibleCount && "shadow-sm font-semibold"
                    )}
                  >
                    All ({eligibleCount})
                  </Button>
                )}

                {/* Custom Input */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-xs text-muted-foreground">Custom:</span>
                  <FormField
                    control={form.control}
                    name="totalQuestions"
                    render={({ field }) => (
                      <Input
                        type="number"
                        min={1}
                        max={eligibleCount || 1000}
                        className="h-9 w-20 text-center text-xs"
                        {...field}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          field.onChange(isNaN(val) ? 1 : val);
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* 4. Advanced Filters & Settings Accordion */}
            <Accordion type="single" collapsible className="w-full border rounded-xl px-4 py-1 bg-muted/20">
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="hover:no-underline py-2.5 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                    <span>Advanced Options (Difficulty, Topic & Timer)</span>
                    {(watchDifficulty || watchTopic || watchTimerEnabled) && (
                      <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 ml-1 bg-background text-primary border-primary/40">
                        Customized
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 space-y-4">
                  
                  {/* Difficulty & Topic Filter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Difficulty Filter</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || "mixed"}>
                            <FormControl>
                              <SelectTrigger className="h-9 text-xs">
                                <SelectValue placeholder="Mixed (All)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mixed">Mixed (All)</SelectItem>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Topic Filter</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Cardiology" 
                              className="h-9 text-xs" 
                              {...field} 
                              value={field.value || ""} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Timer Toggle */}
                  <div className="pt-2 border-t space-y-3">
                    <FormField
                      control={form.control}
                      name="timerEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-background">
                          <div className="space-y-0.5">
                            <FormLabel className="text-xs font-medium">Session Countdown Timer</FormLabel>
                            <FormDescription className="text-[11px]">
                              Auto-submits session when countdown expires.
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
                          <FormItem className="rounded-lg border p-3 bg-background space-y-2">
                            <FormLabel className="text-xs font-semibold">Time Limit</FormLabel>
                            <FormControl>
                              <DurationPicker
                                value={field.value ?? 600}
                                onChange={field.onChange}
                                minSeconds={10}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Randomization Switches */}
                  <div className="pt-2 border-t grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="randomizeQuestions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-background">
                          <div className="space-y-0.5">
                            <FormLabel className="text-xs">Shuffle Questions</FormLabel>
                            <FormDescription className="text-[11px]">Randomize question sequence</FormDescription>
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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-background">
                          <div className="space-y-0.5">
                            <FormLabel className="text-xs">Shuffle Choices</FormLabel>
                            <FormDescription className="text-[11px]">Randomize A, B, C, D choices</FormDescription>
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

                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {generateError && (
              <Alert variant="destructive">
                <AlertDescription>{generateError}</AlertDescription>
              </Alert>
            )}

            {/* 5. Start Practice Session Action */}
            <div className="space-y-2 pt-2">
              <Button 
                type="submit" 
                size="lg"
                className="w-full text-sm font-semibold h-11 shadow-sm gap-2" 
                disabled={isCountLoading || !watchBankId || eligibleCount === 0}
              >
                {isCountLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking Available Questions...
                  </>
                ) : (
                  <>
                    Start {watchPracticeMode === "exam" ? "Exam Simulation" : "Practice"} ({Math.min(watchTotalQuestions, eligibleCount || watchTotalQuestions)} Questions)
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
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
