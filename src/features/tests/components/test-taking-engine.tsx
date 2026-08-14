import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Bookmark, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Test, Attempt, TestQuestion, AttemptAnswer } from "@/types/domain";
import { useSaveAnswer } from "../api/use-save-answer";
import { useSubmitAttempt } from "../api/use-submit-attempt";
import { QuestionPalette } from "./question-palette";
import { SubmitTestDialog } from "./submit-test-dialog";
import { TestTimer } from "./test-timer";
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

  const saveAnswerMutation = useSaveAnswer();
  const submitMutation = useSubmitAttempt();

  const currentQuestion = questions[currentIndex];
  const orderedQuestionIds = useMemo(() => questions.map(q => q.id), [questions]);
  
  const currentAnswer = answers.find(a => a.testQuestionId === currentQuestion?.id);

  if (!currentQuestion) return null;

  const handleSelectOption = (optionId: any) => {
    // Optimistic update
    const existing = answers.find(a => a.testQuestionId === currentQuestion.id);
    const newAnswer: AttemptAnswer = existing 
      ? { ...existing, selectedAnswer: optionId, answeredAt: new Date().toISOString() }
      : { 
          id: `temp-${Date.now()}`, 
          attemptId: attempt.id, 
          testQuestionId: currentQuestion.id, 
          selectedAnswer: optionId, 
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
      selectedAnswer: optionId,
      isMarkedForReview: newAnswer.isMarkedForReview
    });
  };

  const handleToggleMark = () => {
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
  };

  const handleTimeUp = () => {
    submitMutation.mutate({ attemptId: attempt.id, status: "auto_submitted" });
  };

  const handleSubmit = () => {
    submitMutation.mutate({ attemptId: attempt.id, status: "completed" });
  };

  const unansweredCount = test.totalQuestions - answers.filter(a => !!a.selectedAnswer).length;

  const options = useMemo(() => {
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
          {test.timerEnabled && test.durationSeconds && (
            <TestTimer 
              durationSeconds={test.durationSeconds} 
              startedAt={attempt.startedAt} 
              onExpire={handleTimeUp} 
            />
          )}
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
              
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                    isSelected 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
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
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            
            <Button 
              variant={currentAnswer?.isMarkedForReview ? "secondary" : "outline"}
              className={currentAnswer?.isMarkedForReview ? "text-yellow-600 border-yellow-200 bg-yellow-50 hover:bg-yellow-100" : ""}
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
              <Button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
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
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200"></div> Answered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-background border"></div> Unanswered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-yellow-50 border border-yellow-500 relative"><Bookmark className="h-2 w-2 absolute -top-1 -right-1 text-yellow-600 fill-current" /></div> Marked</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary text-primary-foreground"></div> Current</div>
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
