import { useMutation } from "@tanstack/react-query";

export function useCreatePracticeSession() {
  return useMutation({
    mutationFn: async (variables: any) => {
      console.log("Mock create practice session", variables);
      return { id: "mock-session-id" };
    }
  });
}
