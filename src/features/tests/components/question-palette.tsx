import { Button } from "@/components/ui/button";
import { Bookmark, Check } from "lucide-react";
import type { AttemptAnswer } from "@/types/domain";
import { cn } from "@/lib/utils";

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answers: AttemptAnswer[];
  onSelectQuestion: (index: number) => void;
  orderedQuestionIds: string[];
}

export function QuestionPalette({
  totalQuestions,
  currentIndex,
  answers,
  onSelectQuestion,
  orderedQuestionIds,
}: QuestionPaletteProps) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-5 gap-2">
      {Array.from({ length: totalQuestions }).map((_, idx) => {
        const questionId = orderedQuestionIds[idx];
        const answer = answers.find((a) => a.testQuestionId === questionId);

        const isAnswered = !!answer?.selectedAnswer;
        const isMarked = !!answer?.isMarkedForReview;
        const isCurrent = idx === currentIndex;

        return (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            onClick={() => onSelectQuestion(idx)}
            className={cn(
              "relative h-10 w-10 p-0 text-sm font-semibold transition-all",
              isCurrent &&
                "bg-primary text-primary-foreground border-primary ring-2 ring-primary/30 hover:bg-primary/90 hover:text-primary-foreground",
              !isCurrent &&
                isAnswered &&
                !isMarked &&
                "bg-emerald-100 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 hover:text-emerald-800",
              !isCurrent &&
                isMarked &&
                "bg-amber-100 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60",
              !isCurrent &&
                !isAnswered &&
                !isMarked &&
                "bg-muted/30 border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {idx + 1}
            {isMarked && (
              <Bookmark
                className={cn(
                  "absolute -top-1 -right-1 h-3 w-3 fill-current",
                  isCurrent ? "text-primary-foreground" : "text-amber-600 dark:text-amber-400",
                )}
              />
            )}
            {isAnswered && !isMarked && (
              <Check
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3 w-3",
                  isCurrent ? "text-primary-foreground" : "text-emerald-600 dark:text-emerald-400",
                )}
              />
            )}
          </Button>
        );
      })}
    </div>
  );
}
