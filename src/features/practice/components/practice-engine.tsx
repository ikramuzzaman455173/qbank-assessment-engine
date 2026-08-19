import { useState, useMemo, useEffect, useRef } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  HelpCircle, 
  Award, 
  Info, 
  Send,
  Eye,
  Check,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Question } from "@/types/domain";
import { useSavePracticeAttempt } from "../api/use-save-practice-attempt";
import { TestTimer } from "@/features/tests/components/test-timer";
import { cn } from "@/lib/utils";

interface PracticeEngineProps {
  questions: Question[];
  bankId?: string | undefined;
  randomizeOptions?: boolean | undefined;
  onFinish?: (() => void) | undefined;
  defaultMode?: "exam" | "instant" | undefined;
  timerEnabled?: boolean | undefined;
  durationMinutes?: number | undefined;
}

export function PracticeEngine({ 
  questions, 
  bankId,
  randomizeOptions = false, 
  onFinish,
  defaultMode = "exam",
  timerEnabled = false,
  durationMinutes = 10,
}: PracticeEngineProps) {
  // Session Mode: "exam" (results at end) or "instant" (immediate feedback)
  const [mode, setMode] = useState<"exam" | "instant">(defaultMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Answers map: { [questionId or index]: selectedOptionId ('A' | 'B' | 'C' | 'D') }
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  
  // Instant mode specific state (reveals answer for current question)
  const [instantRevealed, setInstantRevealed] = useState<Record<string, boolean>>({});
  
  // Finished state & Attempt saving
  const [isFinished, setIsFinished] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "correct" | "unanswered">("all");
  const saveAttemptMutation = useSavePracticeAttempt();
  const hasSavedRef = useRef(false);
  const startedAtRef = useRef<string>(new Date().toISOString());

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
        <p className="text-muted-foreground mb-6">Could not find any questions matching your criteria.</p>
        <Button onClick={onFinish}>Go Back</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Options memoized per question
  const currentOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const baseOptions = [
      { id: "A", text: currentQuestion.optionA },
      { id: "B", text: currentQuestion.optionB },
      { id: "C", text: currentQuestion.optionC },
      { id: "D", text: currentQuestion.optionD },
    ];
    if (randomizeOptions) {
      return [...baseOptions].sort(() => Math.random() - 0.5);
    }
    return baseOptions;
  }, [currentQuestion, randomizeOptions]);

  // Handle Option Click
  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    const qKey = currentQuestion.id || String(currentIndex);

    if (mode === "instant") {
      if (instantRevealed[qKey]) return; // already locked in instant mode
      setUserAnswers(prev => ({ ...prev, [qKey]: optionId }));
      setInstantRevealed(prev => ({ ...prev, [qKey]: true }));
    } else {
      // Exam mode: allow selecting or toggling freely
      setUserAnswers(prev => ({
        ...prev,
        [qKey]: prev[qKey] === optionId ? "" : optionId
      }));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setInstantRevealed({});
    setCurrentIndex(0);
    setIsFinished(false);
    hasSavedRef.current = false;
    startedAtRef.current = new Date().toISOString();
  };

  // Metrics calculation
  const totalQuestions = questions.length;
  const answeredCount = Object.values(userAnswers).filter(Boolean).length;
  
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  questions.forEach((q, idx) => {
    const qKey = q.id || String(idx);
    const selected = userAnswers[qKey];
    if (!selected) {
      unansweredCount++;
    } else if (selected === q.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Auto-save completed attempt to Supabase
  useEffect(() => {
    if (isFinished && !hasSavedRef.current && answeredCount > 0) {
      hasSavedRef.current = true;
      saveAttemptMutation.mutate({
        bankId,
        questions,
        userAnswers,
        percentage,
        correctCount,
        incorrectCount,
        unansweredCount,
        timerEnabled,
        durationMinutes,
        startedAt: startedAtRef.current,
      });
    }
  }, [isFinished, answeredCount, bankId, questions, userAnswers, percentage, correctCount, incorrectCount, unansweredCount, timerEnabled, durationMinutes, saveAttemptMutation]);

  // -------------------------------------------------------------
  // RESULTS VIEW (When Test is Finished)
  // -------------------------------------------------------------
  if (isFinished) {
    const filteredQuestions = questions.map((q, idx) => {
      const qKey = q.id || String(idx);
      const selected = userAnswers[qKey];
      const isCorrect = selected === q.correctAnswer;
      const isSkipped = !selected;
      return { question: q, index: idx, selected, isCorrect, isSkipped };
    }).filter(item => {
      if (reviewFilter === "incorrect") return !item.isCorrect && !item.isSkipped;
      if (reviewFilter === "correct") return item.isCorrect;
      if (reviewFilter === "unanswered") return item.isSkipped;
      return true;
    });

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Score Summary Card */}
        <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
          <CardHeader className="text-center pb-2 bg-muted/20">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-3">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Test Completed!
            </CardTitle>
            <CardDescription className="text-base">
              Here is your complete performance breakdown and answer review.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {/* Score Ring & Badge */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-extrabold tracking-tight text-foreground">
                {percentage}%
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-1">
                Final Accuracy Score ({correctCount} / {totalQuestions})
              </div>
              
              <div className="mt-3">
                {percentage >= 80 ? (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-sm font-medium">
                    🎉 Excellent Performance!
                  </Badge>
                ) : percentage >= 50 ? (
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 text-sm font-medium">
                    👍 Good Effort, Keep Practicing!
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="px-3 py-1 text-sm font-medium">
                    📚 Needs Improvement
                  </Badge>
                )}
              </div>
            </div>

            {/* Stats Breakdown Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
              <div className="flex flex-col items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-1" />
                <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{correctCount}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 mt-1">Correct</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mb-1" />
                <span className="text-2xl font-bold text-red-700 dark:text-red-300">{incorrectCount}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-red-600 dark:text-red-400 mt-1">Incorrect</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-muted/60 border border-border rounded-xl text-center">
                <HelpCircle className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-2xl font-bold text-foreground">{unansweredCount}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mt-1">Skipped</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-primary/10 border border-primary/20 rounded-xl text-center">
                <Send className="w-6 h-6 text-primary mb-1" />
                <span className="text-2xl font-bold text-primary">{totalQuestions}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-primary mt-1">Total</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap justify-center gap-4 bg-muted/20 border-t py-4">
            <Button onClick={handleRestart} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" /> Retake Test
            </Button>
            <Button onClick={onFinish} size="lg">
              Done & Return
            </Button>
          </CardFooter>
        </Card>

        {/* Detailed Question Review Section */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Answer Review & Explanations</h3>
              <p className="text-sm text-muted-foreground">
                Review all questions, your submitted answers, correct solutions, and in-depth explanations.
              </p>
            </div>

            <Tabs 
              value={reviewFilter} 
              onValueChange={(val) => setReviewFilter(val as any)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all">All ({totalQuestions})</TabsTrigger>
                <TabsTrigger value="incorrect" className="text-red-600 dark:text-red-400">
                  Wrong ({incorrectCount})
                </TabsTrigger>
                <TabsTrigger value="correct" className="text-emerald-600 dark:text-emerald-400">
                  Correct ({correctCount})
                </TabsTrigger>
                <TabsTrigger value="unanswered">
                  Skipped ({unansweredCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-card">
              <p className="text-muted-foreground">No questions in this filter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredQuestions.map(({ question: q, index: qIdx, selected, isCorrect, isSkipped }) => {
                const options = [
                  { id: "A", text: q.optionA },
                  { id: "B", text: q.optionB },
                  { id: "C", text: q.optionC },
                  { id: "D", text: q.optionD },
                ];

                return (
                  <Card 
                    key={q.id || qIdx} 
                    className={cn(
                      "shadow-sm transition-all overflow-hidden border-l-4",
                      isCorrect 
                        ? "border-l-emerald-500" 
                        : isSkipped 
                        ? "border-l-amber-500" 
                        : "border-l-red-500"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Question {qIdx + 1}
                            </span>
                            {q.topic && <Badge variant="outline" className="text-xs">{q.topic}</Badge>}
                            {q.difficulty && (
                              <Badge variant="secondary" className="text-xs capitalize">{q.difficulty}</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg font-semibold leading-relaxed pt-1">
                            {q.questionText}
                          </CardTitle>
                        </div>

                        <div>
                          {isCorrect && (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1.5 py-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </Badge>
                          )}
                          {!isCorrect && !isSkipped && (
                            <Badge className="bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30 gap-1.5 py-1">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect
                            </Badge>
                          )}
                          {isSkipped && (
                            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1.5 py-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Skipped
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-1">
                      {/* Option choices */}
                      <div className="grid grid-cols-1 gap-2.5">
                        {options.map((opt) => {
                          const isOptionCorrect = q.correctAnswer === opt.id;
                          const isOptionSelected = selected === opt.id;

                          let optionBoxClass = "border-border bg-card text-muted-foreground opacity-80";
                          let badgeEl = null;

                          if (isOptionCorrect) {
                            optionBoxClass = "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500 font-medium opacity-100";
                            badgeEl = (
                              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 text-xs gap-1 shrink-0">
                                <Check className="w-3 h-3" /> Correct Answer
                              </Badge>
                            );
                          } else if (isOptionSelected && !isOptionCorrect) {
                            optionBoxClass = "border-red-500 bg-red-500/10 text-red-950 dark:text-red-100 ring-1 ring-red-500 font-medium opacity-100";
                            badgeEl = (
                              <Badge variant="destructive" className="text-xs gap-1 shrink-0">
                                <XCircle className="w-3 h-3" /> Your Answer
                              </Badge>
                            );
                          }

                          return (
                            <div
                              key={opt.id}
                              className={cn(
                                "flex items-start justify-between gap-3 p-3.5 rounded-lg border transition-all",
                                optionBoxClass
                              )}
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <span className={cn(
                                  "font-bold min-w-[1.5rem]",
                                  isOptionCorrect ? "text-emerald-600 dark:text-emerald-400" :
                                  isOptionSelected ? "text-red-600 dark:text-red-400" : ""
                                )}>
                                  {opt.id}.
                                </span>
                                <span className="text-sm leading-relaxed">{opt.text}</span>
                              </div>
                              {badgeEl}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="mt-4 p-4 rounded-lg bg-muted/60 border border-border/80 text-sm">
                          <div className="flex items-center gap-1.5 font-semibold text-primary mb-1.5">
                            <Info className="w-4 h-4" /> Explanation:
                          </div>
                          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {q.explanation}
                          </p>
                        </div>
                      )}

                      {q.sourceReference && (
                        <div className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
                          <span className="font-medium">Reference:</span> {q.sourceReference}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEST / PRACTICE ACTIVE RUN VIEW
  // -------------------------------------------------------------
  if (!currentQuestion) {
    return null;
  }

  const qKey = currentQuestion.id || String(currentIndex);
  const selectedOption = userAnswers[qKey] || null;
  const isCurrentRevealed = mode === "instant" ? Boolean(instantRevealed[qKey]) : false;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header: Mode, Timer & Progress Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <span className="text-sm font-semibold text-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs text-muted-foreground ml-3">
            ({answeredCount} of {totalQuestions} answered)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Timer if enabled */}
          {timerEnabled && durationMinutes && (
            <TestTimer 
              startedAt={startedAtRef.current}
              durationSeconds={durationMinutes * 60}
              onExpire={() => setIsFinished(true)}
            />
          )}

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border text-xs">
            <button
              onClick={() => setMode("exam")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors",
                mode === "exam" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Exam Mode: Submit all questions first, see full results and explanations at the end"
            >
              Exam Mode
            </button>
            <button
              onClick={() => setMode("instant")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors",
                mode === "instant" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Practice Mode: Instant feedback and explanation after each question"
            >
              Learn Mode
            </button>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsFinished(true)}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Finish Early
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={((currentIndex + 1) / totalQuestions) * 100} className="h-2" />

      {/* Question Palette / Quick Jump */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {questions.map((q, idx) => {
          const key = q.id || String(idx);
          const hasAnswer = Boolean(userAnswers[key]);
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={key}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-7 h-7 rounded-md text-xs font-semibold transition-all shrink-0 flex items-center justify-center border",
                isCurrent 
                  ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/30" 
                  : hasAnswer
                  ? "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25"
                  : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
              )}
              title={`Jump to Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-normal">
              Question {currentIndex + 1}
            </Badge>
            {currentQuestion.topic && (
              <Badge variant="secondary" className="text-xs">{currentQuestion.topic}</Badge>
            )}
            {currentQuestion.difficulty && (
              <Badge variant="secondary" className="text-xs capitalize">{currentQuestion.difficulty}</Badge>
            )}
          </div>
          <CardTitle className="text-xl leading-relaxed whitespace-pre-wrap pt-1 font-semibold">
            {currentQuestion.questionText}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {currentOptions.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = currentQuestion.correctAnswer === opt.id;

            let stateClass = "border-border hover:border-primary/50 hover:bg-accent/40 cursor-pointer";
            let Icon = null;

            // In Instant/Learn mode, reveal immediately if answered
            if (mode === "instant" && isCurrentRevealed) {
              stateClass = "border-border opacity-50 cursor-default";

              if (isCorrect) {
                stateClass = "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500 cursor-default opacity-100";
                Icon = <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
              } else if (isSelected && !isCorrect) {
                stateClass = "border-red-500 bg-red-500/10 text-red-950 dark:text-red-100 ring-1 ring-red-500 cursor-default opacity-100";
                Icon = <XCircle className="h-5 w-5 text-red-500 shrink-0" />;
              }
            } else {
              // In Exam Mode: Clean active selection state without spoiling answers
              if (isSelected) {
                stateClass = "border-primary bg-primary/10 text-foreground ring-2 ring-primary/40 font-medium shadow-xs";
              }
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border transition-all duration-150 select-none",
                  stateClass
                )}
              >
                {/* Radio selection circle */}
                <div className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors mt-0.5",
                  isSelected && mode === "exam"
                    ? "border-primary bg-primary text-primary-foreground"
                    : isSelected && mode === "instant" && isCorrect
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isSelected && mode === "instant" && !isCorrect
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-muted-foreground/40 text-muted-foreground"
                )}>
                  {opt.id}
                </div>

                <span className="flex-1 whitespace-pre-wrap leading-relaxed text-sm pt-0.5">
                  {opt.text}
                </span>

                {Icon && <div>{Icon}</div>}
              </div>
            );
          })}
        </CardContent>

        {/* In Instant mode only: show explanation if revealed */}
        {mode === "instant" && isCurrentRevealed && currentQuestion.explanation && (
          <div className="px-6 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
              <span className="font-semibold text-sm block mb-1 text-primary">Explanation:</span>
              <p className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <CardFooter className="flex items-center justify-between pt-4 border-t gap-3 bg-muted/10">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            size="lg"
            className="flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>

          <div className="flex items-center gap-2">
            {currentIndex < totalQuestions - 1 ? (
              <Button size="lg" onClick={handleNext} className="flex items-center gap-1.5">
                Next Question <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={() => setIsFinished(true)} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 font-semibold"
              >
                <Send className="h-4 w-4" /> Submit Test
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
