import { CheckCircle2, Edit2, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Question } from "@/types/domain";
import { cn } from "@/lib/utils";

interface QuestionPreviewProps {
  question: Question;
  index?: number;
  onEdit?: (question: Question) => void;
  onDelete?: (question: Question) => void;
  isReadOnly?: boolean;
}

export function QuestionPreview({
  question,
  index,
  onEdit,
  onDelete,
  isReadOnly = false,
}: QuestionPreviewProps) {
  const options = [
    { id: "A", text: question.optionA },
    { id: "B", text: question.optionB },
    { id: "C", text: question.optionC },
    { id: "D", text: question.optionD },
  ] as const;

  return (
    <Card className="w-full relative group">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            {index !== undefined && (
              <span className="font-semibold text-muted-foreground min-w-[1.5rem]">{index}.</span>
            )}
            <p className="font-medium text-base leading-relaxed whitespace-pre-wrap">
              {question.questionText}
            </p>
          </div>
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(question)}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(question)}
                className="h-8 w-8 text-destructive hover:text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2 pl-8">
          {options.map((opt) => {
            const isCorrect = question.correctAnswer === opt.id;

            return (
              <div
                key={opt.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-md border transition-colors",
                  isCorrect
                    ? "border-green-500/50 bg-green-500/10 text-green-900 dark:text-green-100"
                    : "border-border bg-card",
                )}
              >
                <span
                  className={cn(
                    "font-bold min-w-[1.2rem]",
                    isCorrect ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
                  )}
                >
                  {opt.id}.
                </span>
                <span className="flex-1 whitespace-pre-wrap">{opt.text}</span>
                {isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
              </div>
            );
          })}
        </div>

        {question.explanation && (
          <div className="pl-8 pt-2">
            <div className="bg-muted p-4 rounded-md text-sm border-l-4 border-l-primary/50">
              <span className="font-semibold mb-1 block">Explanation:</span>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {(question.difficulty || question.topic || question.sourceReference) && (
        <CardFooter className="pt-2 pb-4 pl-14 flex flex-wrap gap-2 text-xs">
          {question.difficulty && (
            <Badge
              variant="outline"
              className={cn(
                "font-normal",
                question.difficulty === "easy" &&
                  "text-green-600 border-green-200 dark:text-green-400 dark:border-green-800",
                question.difficulty === "medium" &&
                  "text-amber-600 border-amber-200 dark:text-amber-400 dark:border-amber-800",
                question.difficulty === "hard" &&
                  "text-red-600 border-red-200 dark:text-red-400 dark:border-red-800",
              )}
            >
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </Badge>
          )}
          {question.topic && (
            <Badge variant="secondary" className="font-normal text-muted-foreground">
              {question.topic}
            </Badge>
          )}
          {question.sourceReference && (
            <Badge variant="outline" className="font-normal text-muted-foreground border-dashed">
              Source: {question.sourceReference}
            </Badge>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
