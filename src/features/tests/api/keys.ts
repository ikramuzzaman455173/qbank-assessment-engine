export const testKeys = {
  all: ["tests"] as const,
  lists: () => [...testKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...testKeys.lists(), filters] as const,
  details: () => [...testKeys.all, "detail"] as const,
  detail: (id: string) => [...testKeys.details(), id] as const,
};

export const attemptKeys = {
  all: ["attempts"] as const,
  lists: (testId?: string) => [...attemptKeys.all, "list", { testId }] as const,
  details: () => [...attemptKeys.all, "detail"] as const,
  detail: (id: string) => [...attemptKeys.details(), id] as const,
};
