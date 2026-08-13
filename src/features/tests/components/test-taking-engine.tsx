import { Test, Attempt } from "@/types/domain";

interface TestTakingEngineProps {
  test: Test;
  attempt: Attempt;
}

export function TestTakingEngine({ test, attempt }: TestTakingEngineProps) {
  return (
    <div className="p-8 text-center text-muted-foreground">
      <h2 className="text-xl font-bold mb-4 text-foreground">Test Engine Under Construction</h2>
      <p>Test ID: {test.id}</p>
      <p>Attempt ID: {attempt.id}</p>
      <p className="mt-4">This module is currently being finalized.</p>
    </div>
  );
}
