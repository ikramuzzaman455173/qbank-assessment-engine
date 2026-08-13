import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toUserMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  error?: unknown;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  error,
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  const message = description ?? (error ? toUserMessage(error) : undefined);

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-12 text-center",
        className,
      )}
    >
      <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      {message ? <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{message}</p> : null}
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
