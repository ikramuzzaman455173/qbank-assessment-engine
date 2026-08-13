import { Button } from "@/components/ui/button";
import { Bookmark, Check } from "lucide-react";
import type { AttemptAnswer } from "@/types/domain";

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
        const answer = answers.find(a => a.testQuestionId === questionId);
        
        const isAnswered = !!answer?.selectedAnswer;
        const isMarked = !!answer?.isMarkedForReview;
        const isCurrent = idx === currentIndex;

        let variant: "default" | "outline" | "secondary" | "ghost" = "outline";
        if (isCurrent) {
          variant = "default"; // solid primary color
        } else if (isAnswered && !isMarked) {
          variant = "secondary"; // answered but not marked
        }

        return (
          <Button
            key={idx}
            variant={variant}
            size="sm"
            onClick={() => onSelectQuestion(idx)}
            className={`
              relative h-10 w-10 p-0 text-sm font-medium
              ${isMarked && !isCurrent ? 'border-yellow-500 text-yellow-700' : ''}
              ${isAnswered && isMarked && !isCurrent ? 'bg-yellow-50 border-yellow-500' : ''}
              ${isAnswered && !isMarked && !isCurrent ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800' : ''}
            `}
          >
            {idx + 1}
            {isMarked && (
              <Bookmark className={`absolute -top-1 -right-1 h-3 w-3 ${isCurrent ? 'text-primary-foreground' : 'text-yellow-600'} fill-current`} />
            )}
            {isAnswered && !isMarked && (
              <Check className={`absolute -bottom-1 -right-1 h-3 w-3 ${isCurrent ? 'text-primary-foreground' : 'text-green-600'}`} />
            )}
          </Button>
        );
      })}
    </div>
  );
}
