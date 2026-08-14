import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Question } from "@/types/domain";
import { cn } from "@/lib/utils";

interface PracticeEngineProps {
  questions: Question[];
  randomizeOptions?: boolean;
  onFinish?: () => void;
}

export function PracticeEngine({ questions, randomizeOptions = false, onFinish }: PracticeEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
        <p className="text-muted-foreground mb-6">Could not find any questions matching your criteria.</p>
        <Button onClick={onFinish}>Go Back</Button>
      </div>
    );
  }

  const isFinished = currentIndex >= questions.length;

  if (isFinished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
        <Card className="text-center p-6">
          <CardHeader>
            <CardTitle className="text-3xl mb-2">Practice Complete!</CardTitle>
            <div className="text-muted-foreground">You have finished this practice session.</div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center rounded-full border-8 border-muted">
              <div className={cn(
                "absolute inset-0 rounded-full border-8",
                percentage >= 80 ? "border-green-500" : percentage >= 50 ? "border-amber-500" : "border-red-500"
              )} style={{ clipPath: `polygon(0 0, 100% 0, 100% ${percentage}%, 0 ${percentage}%)` /* pseudo clip */ }} />
              <div className="flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{percentage}%</span>
                <span className="text-sm text-muted-foreground mt-1">Accuracy</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-green-500/10 text-green-700 p-4 rounded-lg">
                <div className="text-2xl font-bold">{correctCount}</div>
                <div className="text-sm">Correct</div>
              </div>
              <div className="bg-red-500/10 text-red-700 p-4 rounded-lg">
                <div className="text-2xl font-bold">{questions.length - correctCount}</div>
                <div className="text-sm">Incorrect</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => {
              setCurrentIndex(0);
              setCorrectCount(0);
              setSelectedOption(null);
              setHasAnswered(false);
            }} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button onClick={onFinish}>Done</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const question = questions[currentIndex];
  if (!question) return null;

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedOption(optionId);
    setHasAnswered(true);

    if (optionId === question.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setCurrentIndex(questions.length); // Mark as finished
    }
  };

  const options = useMemo(() => {
    const baseOptions = [
      { id: "A", text: question.optionA },
      { id: "B", text: question.optionB },
      { id: "C", text: question.optionC },
      { id: "D", text: question.optionD },
    ];
    if (randomizeOptions) {
      return [...baseOptions].sort(() => Math.random() - 0.5);
    }
    return baseOptions;
  }, [question, randomizeOptions]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Accuracy: {currentIndex > 0 ? Math.round((correctCount / currentIndex) * 100) : 0}%</span>
      </div>
      <Progress value={(currentIndex / questions.length) * 100} className="h-2" />

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed whitespace-pre-wrap">
            {question.questionText}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = question.correctAnswer === opt.id;
            
            let stateClass = "border-border hover:border-primary/50 cursor-pointer";
            let Icon = null;
            
            if (hasAnswered) {
              stateClass = "border-border opacity-50 cursor-default";
              
              if (isCorrect) {
                stateClass = "border-green-500 bg-green-500/10 text-green-900 dark:text-green-100 ring-1 ring-green-500 cursor-default opacity-100";
                Icon = <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />;
              } else if (isSelected && !isCorrect) {
                stateClass = "border-red-500 bg-red-500/10 text-red-900 dark:text-red-100 ring-1 ring-red-500 cursor-default opacity-100";
                Icon = <XCircle className="h-5 w-5 text-red-500 shrink-0" />;
              }
            } else if (isSelected) {
              stateClass = "border-primary bg-primary/5 ring-1 ring-primary";
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border transition-all duration-200",
                  stateClass
                )}
              >
                <span className={cn(
                  "font-bold min-w-[1.5rem]",
                  hasAnswered && isCorrect ? "text-green-600 dark:text-green-400" : 
                  hasAnswered && isSelected && !isCorrect ? "text-red-600 dark:text-red-400" : 
                  "text-muted-foreground"
                )}>
                  {opt.id}.
                </span>
                <span className="flex-1 whitespace-pre-wrap leading-relaxed">{opt.text}</span>
                {Icon && <div>{Icon}</div>}
              </div>
            );
          })}
        </CardContent>

        {hasAnswered && question.explanation && (
          <div className="px-6 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
              <span className="font-semibold text-sm block mb-1 text-primary">Explanation:</span>
              <p className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        )}

        {hasAnswered && (
          <CardFooter className="pt-2 animate-in fade-in duration-300">
            <Button className="w-full" size="lg" onClick={handleNext}>
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish Practice"} 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
