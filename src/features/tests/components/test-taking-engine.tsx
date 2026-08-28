import { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Bookmark, Send, Maximize, Minimize2, Keyboard, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Test, Attempt, TestQuestion, AttemptAnswer, CorrectAnswer } from "@/types/domain";
import { useSaveAnswer } from "../api/use-save-answer";
import { useSubmitAttempt } from "../api/use-submit-attempt";
import { QuestionPalette } from "./question-palette";
import { SubmitTestDialog } from "./submit-test-dialog";
import { TestTimer } from "./test-timer";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { cn } from "@/lib/utils";

interface TestTakingEngineProps {
  test: Test & { questions?: TestQuestion[] };
  attempt: Attempt & { answers?: AttemptAnswer[] };
}

export function TestTakingEngine({ test, attempt }: TestTakingEngineProps) {
  const questions = test.questions || [];
  const initialAnswers = attempt.answers || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AttemptAnswer[]>(initialAnswers);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [showKeyHints, setShowKeyHints] = useState(true);

  // Strike-through (option elimination) state: { [questionId]: Set of eliminated option IDs }
  const [strikeThrough, setStrikeThrough] = useState<Record<string, Set<string>>>({});

  // Fullscreen / Focus mode
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const saveAnswerMutation = useSaveAnswer();
  const submitMutation = useSubmitAttempt();

  const currentQuestion = questions[currentIndex];
  const orderedQuestionIds = useMemo(() => questions.map(q => q.id), [questions]);
  
  const currentAnswer = answers.find(a => a.testQuestionId === currentQuestion?.id);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    const baseOptions = [
      { id: "A", text: currentQuestion.optionA },
      { id: "B", text: currentQuestion.optionB },
      { id: "C", text: currentQuestion.optionC },
      { id: "D", text: currentQuestion.optionD },
    ];
    if (test.randomizeOptions) {
      return [...baseOptions].sort(() => Math.random() - 0.5);
    }
    return baseOptions;
  }, [currentQuestion, test.randomizeOptions]);

  const handleSelectOption = useCallback((optionId: string) => {
    if (!currentQuestion) return;
    const val = optionId as CorrectAnswer;
    // Optimistic update
    const existing = answers.find(a => a.testQuestionId === currentQuestion.id);
    const newAnswer: AttemptAnswer = existing 
      ? { ...existing, selectedAnswer: val, answeredAt: new Date().toISOString() }
      : { 
          id: `temp-${Date.now()}`, 
          attemptId: attempt.id, 
          testQuestionId: currentQuestion.id, 
          selectedAnswer: val, 
          isCorrect: null, 
          isMarkedForReview: false, 
          answeredAt: new Date().toISOString() 
        };
        
    setAnswers(prev => {
      const idx = prev.findIndex(a => a.testQuestionId === currentQuestion.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newAnswer;
        return next;
      }
      return [...prev, newAnswer];
    });

    saveAnswerMutation.mutate({
      attemptId: attempt.id,
      testQuestionId: currentQuestion.id,
      selectedAnswer: val,
      isMarkedForReview: newAnswer.isMarkedForReview
    });
  }, [currentQuestion, answers, attempt.id, saveAnswerMutation]);

  const handleToggleMark = useCallback(() => {
    if (!currentQuestion) return;
    const existing = answers.find(a => a.testQuestionId === currentQuestion.id);
    const isMarked = !existing?.isMarkedForReview;
    
    const newAnswer: AttemptAnswer = existing 
      ? { ...existing, isMarkedForReview: isMarked }
      : { 
          id: `temp-${Date.now()}`, 
          attemptId: attempt.id, 
          testQuestionId: currentQuestion.id, 
          selectedAnswer: null, 
          isCorrect: null, 
          isMarkedForReview: isMarked, 
          answeredAt: null 
        };

    setAnswers(prev => {
      const idx = prev.findIndex(a => a.testQuestionId === currentQuestion.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newAnswer;
        return next;
      }
      return [...prev, newAnswer];
    });

    saveAnswerMutation.mutate({
      attemptId: attempt.id,
      testQuestionId: currentQuestion.id,
      selectedAnswer: newAnswer.selectedAnswer,
      isMarkedForReview: isMarked
    });
  }, [currentQuestion, answers, attempt.id, saveAnswerMutation]);

  const handleToggleStrike = useCallback((optionId: string) => {
    if (!currentQuestion) return;
    setStrikeThrough(prev => {
      const existing = prev[currentQuestion.id] ? new Set(prev[currentQuestion.id]) : new Set<string>();
      if (existing.has(optionId)) {
        existing.delete(optionId);
      } else {
        existing.add(optionId);
      }
      return { ...prev, [currentQuestion.id]: existing };
    });
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
  }, [questions.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleTimeUp = () => {
    submitMutation.mutate({ attemptId: attempt.id, status: "auto_submitted" });
  };

  const handleSubmit = () => {
    submitMutation.mutate({ attemptId: attempt.id, status: "completed" });
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const key = e.key.toUpperCase();
      const optionKeys = ["A", "B", "C", "D"];
      const numberKeys: Record<string, string> = { "1": "A", "2": "B", "3": "C", "4": "D" };

      // Shift + A/B/C/D = strike-through toggle
      if (e.shiftKey && optionKeys.includes(key)) {
        e.preventDefault();
        handleToggleStrike(key);
        return;
      }

      // A/B/C/D or 1/2/3/4 = select option
      if (optionKeys.includes(key)) {
        e.preventDefault();
        handleSelectOption(key);
        return;
      }
      const mappedNumber = numberKeys[e.key];
      if (mappedNumber) {
        e.preventDefault();
        handleSelectOption(mappedNumber);
        return;
      }

      // Arrow navigation
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevious();
        return;
      }

      // M = toggle mark for review
      if (key === "M" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToggleMark();
        return;
      }

      // F = toggle fullscreen
      if (key === "F" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        void toggleFullscreen();
        return;
      }

      // Enter on last question = open submit dialog
      if (e.key === "Enter" && currentIndex === questions.length - 1) {
        e.preventDefault();
        setIsSubmitDialogOpen(true);
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, questions.length, handleNext, handlePrevious, handleSelectOption, handleToggleMark, handleToggleStrike, toggleFullscreen]);

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto p-6 bg-card rounded-xl border shadow-sm my-12">
        <h2 className="text-xl font-bold mb-2">No Questions Found</h2>
        <p className="text-sm text-muted-foreground mb-6">This test does not contain any questions yet.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const unansweredCount = test.totalQuestions - answers.filter(a => !!a.selectedAnswer).length;

  return (
    <div className="flex flex-col lg:flex-row h-full w-full min-h-[calc(100vh-6rem)] gap-6 p-4 md:p-6">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col space-y-4 max-w-4xl">
        <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
          <div>
            <h1 className="font-bold text-lg">{test.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentIndex + 1} of {test.totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {test.timerEnabled && test.durationSeconds && (
              <TestTimer 
                durationSeconds={test.durationSeconds} 
                startedAt={attempt.startedAt} 
                onExpire={handleTimeUp} 
              />
            )}

            {/* Fullscreen / Focus Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => void toggleFullscreen()}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              title={isFullscreen ? "Exit Focus Mode (F)" : "Focus Mode (F)"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1 text-xs h-8"
              title="Pause test and return to test details"
            >
              <Link to="/tests/$testId" params={{ testId: test.id }}>
                <LogOut className="h-3.5 w-3.5" /> Pause & Exit
              </Link>
            </Button>
          </div>
        </div>

        <Card className="flex-1 flex flex-col shadow-sm border-t-4 border-t-primary">
          <CardHeader>
            <div className="text-lg font-medium leading-relaxed whitespace-pre-wrap">
              <span className="text-muted-foreground font-bold mr-2">{currentIndex + 1}.</span>
              {currentQuestion.questionText}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            {options.map((opt) => {
              const isSelected = currentAnswer?.selectedAnswer === opt.id;
              const isStruck = strikeThrough[currentQuestion.id]?.has(opt.id) ?? false;
              
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleToggleStrike(opt.id);
                  }}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer select-none",
                    isSelected 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50",
                    isStruck && "opacity-40 line-through decoration-2"
                  )}
                >
                  <span className={cn(
                    "font-bold min-w-[1.5rem]",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}>
                    {opt.id}.
                  </span>
                  <span className="flex-1 whitespace-pre-wrap leading-relaxed">{opt.text}</span>
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t p-4 bg-muted/20">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            
            <Button 
              variant={currentAnswer?.isMarkedForReview ? "secondary" : "outline"}
              className={currentAnswer?.isMarkedForReview ? "text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700 hover:bg-amber-100" : ""}
              onClick={handleToggleMark}
            >
              <Bookmark className={cn("mr-2 h-4 w-4", currentAnswer?.isMarkedForReview ? "fill-current" : "")} />
              {currentAnswer?.isMarkedForReview ? "Marked" : "Mark for Review"}
            </Button>

            {currentIndex === questions.length - 1 ? (
              <Button onClick={() => setIsSubmitDialogOpen(true)}>
                Submit Test <Send className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Keyboard Shortcuts Hint Bar */}
        {showKeyHints && (
          <div className="hidden sm:flex items-center justify-between bg-muted/50 border rounded-lg px-4 py-2 text-xs text-muted-foreground animate-in fade-in duration-300">
            <div className="flex items-center gap-1.5">
              <Keyboard className="h-3.5 w-3.5" />
              <span className="font-medium">Shortcuts:</span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">A-D</kbd> answer
                <span className="mx-1.5">·</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">←→</kbd> navigate
                <span className="mx-1.5">·</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">M</kbd> mark
                <span className="mx-1.5">·</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">Shift+A-D</kbd> eliminate
                <span className="mx-1.5">·</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">F</kbd> focus mode
              </span>
            </div>
            <button onClick={() => setShowKeyHints(false)} className="text-muted-foreground/60 hover:text-foreground ml-4">✕</button>
          </div>
        )}
      </div>

      {/* Sidebar Area */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Question Navigator</h3>
          </CardHeader>
          <CardContent>
            <QuestionPalette 
              totalQuestions={test.totalQuestions}
              currentIndex={currentIndex}
              answers={answers}
              orderedQuestionIds={orderedQuestionIds}
              onSelectQuestion={setCurrentIndex}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t pt-4 bg-muted/20">
            <div className="grid grid-cols-2 gap-2 text-xs w-full">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700"></div> 
                Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-muted/30 border border-border"></div> 
                Unanswered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-amber-100 dark:bg-amber-950/40 border border-amber-400 dark:border-amber-600 relative">
                  <Bookmark className="h-2 w-2 absolute -top-1 -right-1 text-amber-600 fill-current" />
                </div> 
                Marked
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary text-primary-foreground"></div> 
                Current
              </div>
            </div>
            <Button variant="default" className="w-full mt-2" onClick={() => setIsSubmitDialogOpen(true)}>
              Submit Test
            </Button>
          </CardFooter>
        </Card>
      </div>

      <SubmitTestDialog 
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        unansweredCount={unansweredCount}
        totalQuestions={test.totalQuestions}
        onConfirm={handleSubmit}
        isSubmitting={submitMutation.isPending}
      />
    </div>
  );
}
