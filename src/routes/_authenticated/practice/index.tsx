import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuestions } from '@/features/questions/api/use-questions';
import { PracticeEngine } from '@/features/practice/components';
import { LoadingState, ErrorState } from '@/components/common';

interface PracticeSearch {
  bankId?: string;
  practiceMode: string;
  totalQuestions: number;
  difficulty?: string;
  topic?: string;
  timerEnabled?: boolean;
  durationMinutes?: number;
  durationSeconds?: number;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

export const Route = createFileRoute('/_authenticated/practice/')({
  validateSearch: (search: Record<string, unknown>): PracticeSearch => {
    const rawSeconds = search['durationSeconds'] ? Number(search['durationSeconds']) : undefined;
    const rawMinutes = search['durationMinutes'] ? Number(search['durationMinutes']) : undefined;

    const result: PracticeSearch = {
      practiceMode: (search['practiceMode'] as string) || "all",
      totalQuestions: Number(search['totalQuestions']) || 10,
      randomizeQuestions: search['randomizeQuestions'] !== "false",
      randomizeOptions: search['randomizeOptions'] !== "false",
      timerEnabled: search['timerEnabled'] === true || search['timerEnabled'] === "true",
      durationMinutes: rawMinutes || 10,
      durationSeconds: rawSeconds ?? (rawMinutes ? rawMinutes * 60 : 600),
    };
    
    if (search['bankId']) result.bankId = search['bankId'] as string;
    if (search['difficulty']) result.difficulty = search['difficulty'] as string;
    if (search['topic']) result.topic = search['topic'] as string;
    
    return result;
  },
  component: PracticeRoute,
});

function PracticeRoute() {
  const search = Route.useSearch() as PracticeSearch;
  const navigate = useNavigate();

  // If no bankId is provided, redirect to config
  if (!search.bankId) {
    void navigate({ to: '/practice/config' as any, replace: true });
    return null;
  }

  const filters: Record<string, any> = { pageSize: search.totalQuestions };
  if (search.difficulty) filters['difficulty'] = search.difficulty;
  if (search.topic) filters['topic'] = search.topic;

  const { data, isLoading, error } = useQuestions(search.bankId, filters);

  if (isLoading) return <LoadingState label="Preparing your practice session..." />;
  if (error) return <ErrorState title="Error" description={error.message} />;

  // Basic client-side randomization since the backend query just returns top N
  let questions = data?.items || [];
  if (search.randomizeQuestions) {
    questions = [...questions].sort(() => Math.random() - 0.5);
  }

  return (
    <div className="py-6">
      <PracticeEngine 
        questions={questions} 
        bankId={search.bankId}
        randomizeOptions={search.randomizeOptions}
        defaultMode={search.practiceMode === "instant" ? "instant" : "exam"}
        timerEnabled={search.timerEnabled}
        durationSeconds={search.durationSeconds}
        onFinish={() => void navigate({ to: '/question-banks/$bankId', params: { bankId: search.bankId! } })}
      />
    </div>
  );
}
