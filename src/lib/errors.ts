/**
 * Consistent error taxonomy. UI must render `toUserMessage(error)` and never
 * raw database/stack details.
 */

export type AppErrorKind =
  | "validation"
  | "authentication"
  | "authorization"
  | "not_found"
  | "network"
  | "server"
  | "unknown";

export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly cause?: unknown;

  constructor(kind: AppErrorKind, message: string, cause?: unknown) {
    super(message);
    this.name = "AppError";
    this.kind = kind;
    this.cause = cause;
  }
}

const FALLBACK_MESSAGES: Record<AppErrorKind, string> = {
  validation: "Some of the information provided isn't valid. Please review and try again.",
  authentication: "Please sign in to continue.",
  authorization: "You don't have permission to do this.",
  not_found: "We couldn't find what you were looking for.",
  network: "Connection problem. Check your internet and try again.",
  server: "Something went wrong on our side. Please try again in a moment.",
  unknown: "Something unexpected happened. Please try again.",
};

interface SupabaseLikeError {
  message?: string;
  status?: number;
  code?: string;
}

function isSupabaseLikeError(value: unknown): value is SupabaseLikeError {
  return typeof value === "object" && value !== null && "message" in value;
}

/** Normalize any thrown value into an AppError. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (isSupabaseLikeError(error)) {
    const status = error.status ?? 0;
    if (status === 401) return new AppError("authentication", FALLBACK_MESSAGES.authentication, error);
    if (status === 403) return new AppError("authorization", FALLBACK_MESSAGES.authorization, error);
    if (status === 404) return new AppError("not_found", FALLBACK_MESSAGES.not_found, error);
    if (status >= 500) return new AppError("server", FALLBACK_MESSAGES.server, error);
  }

  if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
    return new AppError("network", FALLBACK_MESSAGES.network, error);
  }

  return new AppError("unknown", FALLBACK_MESSAGES.unknown, error);
}

/** Safe, human-readable message for end users. */
export function toUserMessage(error: unknown): string {
  const appError = toAppError(error);
  return appError.kind === "unknown" ? FALLBACK_MESSAGES.unknown : appError.message;
}
