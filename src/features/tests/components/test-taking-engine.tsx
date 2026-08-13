import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Bookmark, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useSaveAnswer } from "../api/use-save-answer";
import { useSubmitAttempt } from "../api/use-submit-attempt";
import { TestTimer } from "./test-timer";
import { QuestionPalette } from "./question-palette";
import { SubmitTestDialog } from "./submit-test-dialog";
import type { Test, Attempt, TestQuestion, CorrectAnswer } from "@/types/domain";

interface TestTakingEngineProps {
  test: Test & { questions: TestQuestion[] };
  attempt: Attempt & { answers: any[] };
}

export function TestTakingEngine({ test, attempt }: TestTakingEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const saveAnswerMutation = useSaveAnswer();
  const submitAttemptMutation = useSubmitAttempt();

  const questions = test.questions;
  const currentQuestion = questions[currentIndex];
  
  // Find current answer from the synced attempt state
  const currentAnswerRecord = currentQuestion ? attempt.answers.find(a => a.testQuestionId === currentQuestion.id) : undefined;

  // We maintain a tiny bit of local state for the radio group to feel instantly responsive
  const [localSelection, setLocalSelection] = useState<CorrectAnswer | null>(null);

  useEffect(() => {
    setLocalSelection((currentAnswerRecord?.selectedAnswer as CorrectAnswer) || null);
  }, [currentIndex, currentAnswerRecord?.selectedAnswer]);

  const handleOptionSelect = (val: CorrectAnswer) => {
    if (!currentQuestion) return;
    setLocalSelection(val);
    saveAnswerMutation.mutate({
      attemptId: attempt.id,
      testQuestionId: currentQuestion.id,
      selectedAnswer: val,
      isMarkedForReview: currentAnswerRecord?.isMarkedForReview,
    });
  };

  const toggleMarkForReview = () => {
    if (!currentQuestion) return;
    const isMarked = !currentAnswerRecord?.isMarkedForReview;
    saveAnswerMutation.mutate({
      attemptId: attempt.id,
      testQuestionId: currentQuestion.id,
      selectedAnswer: localSelection || currentAnswerRecord?.selectedAnswer,
      isMarkedForReview: isMarked,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleAutoSubmit = () => {
    if (attempt.status !== "in_progress") return;
    submitAttemptMutation.mutate({ attemptId: attempt.id, status: "auto_submitted" });
  };

  const handleManualSubmit = () => {
    submitAttemptMutation.mutate({ attemptId: attempt.id, status: "completed" });
  };

  const unansweredCount = questions.length - attempt.answers.filter(a => a.selectedAnswer).length;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-background border-b z-10 sticky top-0">
        <div>
          <h1 className="text-xl font-bold line-clamp-1">{test.title}</h1>
          <p className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-4">
          {test.timerEnabled && test.durationSeconds && (
            <TestTimer 
              startedAt={attempt.startedAt} 
              durationSeconds={test.durationSeconds} 
              onExpire={handleAutoSubmit} 
            />
          )}
          <Button 
            variant="default"
            className="hidden sm:flex"
            onClick={() => setIsSubmitDialogOpen(true)}
            disabled={submitAttemptMutation.isPending}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Finish Test
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {currentQuestion && (
            <Card className="border-0 shadow-none md:border md:shadow-sm">
              <CardContent className="p-0 md:p-6 space-y-8">
                {/* Question Text */}
                <div className="text-lg font-medium leading-relaxed">
                  <span className="text-muted-foreground mr-2">{currentIndex + 1}.</span>
                  {currentQuestion.questionText}
                </div>

                {/* Options */}
                <RadioGroup 
                  value={localSelection || ""} 
                  onValueChange={(val) => handleOptionSelect(val as CorrectAnswer)}
                  className="space-y-4"
                >
                  {(['A', 'B', 'C', 'D'] as CorrectAnswer[]).map((opt) => {
                    const optionText = currentQuestion[`option${opt}` as keyof TestQuestion] as string;
                    return (
                      <div key={opt} className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleOptionSelect(opt)}>
                        <RadioGroupItem value={opt} id={`option-${opt}`} />
                        <Label htmlFor={`option-${opt}`} className="flex-1 cursor-pointer text-base leading-relaxed font-normal">
                          <span className="font-semibold mr-2">{opt}.</span>
                          {optionText}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar / Palette Area */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l bg-muted/20 p-4 overflow-y-auto flex flex-col gap-6">
          <div className="flex justify-between items-center md:hidden">
            <Button variant="outline" size="sm" onClick={() => setIsSubmitDialogOpen(true)}>Submit Test</Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Question Navigator</h3>
            <QuestionPalette 
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answers={attempt.answers}
              onSelectQuestion={setCurrentIndex}
              orderedQuestionIds={questions.map(q => q.id)}
            />
          </div>

          <div className="space-y-2 text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border bg-primary" /> Current
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-green-200 bg-green-50" /> Answered
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-yellow-500 bg-yellow-50" /> Marked for Review
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border bg-background" /> Unanswered
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t p-4 bg-background flex items-center justify-between sticky bottom-0">
        <Button
          variant="outline"
          onClick={toggleMarkForReview}
          className={currentAnswerRecord?.isMarkedForReview ? "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100" : ""}
        >
          <Bookmark className={`w-4 h-4 mr-2 ${currentAnswerRecord?.isMarkedForReview ? 'fill-current' : ''}`} />
          {currentAnswerRecord?.isMarkedForReview ? "Unmark" : "Mark for Review"}
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentIndex < questions.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => setIsSubmitDialogOpen(true)}>
              Finish
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      <SubmitTestDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        unansweredCount={unansweredCount}
        totalQuestions={questions.length}
        onConfirm={handleManualSubmit}
        isSubmitting={submitAttemptMutation.isPending}
      />
    </div>
  );
}
