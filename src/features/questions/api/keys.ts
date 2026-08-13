export const questionKeys = {
  all: ["questions"] as const,
  lists: () => [...questionKeys.all, "list"] as const,
  list: (bankId: string, filters: any) => [...questionKeys.lists(), bankId, { filters }] as const,
  details: () => [...questionKeys.all, "detail"] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
};

export const sourceKeys = {
  all: ["sources"] as const,
  lists: () => [...sourceKeys.all, "list"] as const,
  list: (bankId: string) => [...sourceKeys.lists(), bankId] as const,
  details: () => [...sourceKeys.all, "detail"] as const,
  detail: (id: string) => [...sourceKeys.details(), id] as const,
};
