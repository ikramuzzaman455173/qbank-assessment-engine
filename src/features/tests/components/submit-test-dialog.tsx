import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface SubmitTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unansweredCount: number;
  totalQuestions: number;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function SubmitTestDialog({
  open,
  onOpenChange,
  unansweredCount,
  totalQuestions,
  onConfirm,
  isSubmitting,
}: SubmitTestDialogProps) {
  const isComplete = unansweredCount === 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Test?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            {!isComplete ? (
              <>
                <p className="font-semibold text-destructive">
                  You have {unansweredCount} unanswered{" "}
                  {unansweredCount === 1 ? "question" : "questions"}.
                </p>
                <p>
                  Are you sure you want to submit your test now? You will not be able to return to
                  this attempt.
                </p>
              </>
            ) : (
              <p>
                You have answered all {totalQuestions} questions. Are you ready to submit your test
                and view your results?
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Continue Test</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Prevent closing immediately to show loading state if desired, but AlertDialogAction closes by default.
              onConfirm();
            }}
            disabled={isSubmitting}
            className={
              !isComplete
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Test
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
