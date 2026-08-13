export const questionBankKeys = {
  all: ["questionBanks"] as const,
  lists: () => [...questionBankKeys.all, "list"] as const,
  list: (filters: string) => [...questionBankKeys.lists(), { filters }] as const,
  details: () => [...questionBankKeys.all, "detail"] as const,
  detail: (id: string) => [...questionBankKeys.details(), id] as const,
};
