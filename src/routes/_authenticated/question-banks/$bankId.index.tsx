import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Upload,
  Play,
  Settings2,
  Search,
  X,
  Filter,
  HelpCircle,
  Sparkles,
} from "lucide-react";

import {
  ErrorState,
  LoadingState,
  PageHeader,
  EmptyState,
  AdvancedPagination,
} from "@/components/common";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuestionBank } from "@/features/question-banks/api/use-question-bank";
import { useQuestions } from "@/features/questions/api/use-questions";
import { useCreateQuestion } from "@/features/questions/api/use-create-question";
import { useUpdateQuestion } from "@/features/questions/api/use-update-question";
import { useDeleteQuestion } from "@/features/questions/api/use-delete-question";
import { QuestionPreview } from "@/features/questions/components/question-preview";
import { QuestionForm, type QuestionValues } from "@/features/questions/components/question-form";
import type { Question } from "@/types/domain";
import { ROUTES } from "@/constants/routes";

interface BankSearchFilters {
  page?: number;
  pageSize?: number;
  q?: string;
  difficulty?: string;
}

export const Route = createFileRoute("/_authenticated/question-banks/$bankId/")({
  validateSearch: (search: Record<string, unknown>): BankSearchFilters => {
    return {
      page: Number(search["page"]) || 1,
      pageSize: Number(search["pageSize"]) || 20,
      q: (search["q"] as string) || "",
      difficulty: (search["difficulty"] as string) || "all",
    };
  },
  head: () => ({
    meta: [
      { title: "Bank Details — QBank" },
      { name: "description", content: "View and manage questions." },
    ],
  }),
  component: QuestionBankDetailsPage,
});

function QuestionBankDetailsPage() {
  const { bankId } = Route.useParams();
  const searchParams = Route.useSearch() as BankSearchFilters;
  const navigate = useNavigate();

  const page = searchParams.page || 1;
  const pageSize = searchParams.pageSize || 20;
  const difficulty = searchParams.difficulty || "all";

  const [searchInput, setSearchInput] = useState(searchParams.q || "");
  const debouncedSearch = useDebounce(searchInput, 350);

  const { data: bank, isLoading: isBankLoading, error: bankError } = useQuestionBank(bankId);

  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestions(bankId, {
    page,
    pageSize,
    searchQuery: debouncedSearch || undefined,
    difficulty: difficulty !== "all" ? difficulty : undefined,
  });

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  // Sync filters with URL
  const updateFilters = (newParams: Partial<BankSearchFilters>) => {
    void navigate({
      to: "/question-banks/$bankId",
      params: { bankId },
      search: {
        page:
          newParams.page ??
          (newParams.q !== undefined || newParams.difficulty !== undefined ? 1 : page),
        pageSize: newParams.pageSize ?? pageSize,
        q: newParams.q !== undefined ? newParams.q || undefined : debouncedSearch || undefined,
        difficulty:
          newParams.difficulty !== undefined
            ? newParams.difficulty === "all"
              ? undefined
              : newParams.difficulty
            : difficulty !== "all"
              ? difficulty
              : undefined,
      } as any,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };

  const handlePageSizeChange = (newSize: number) => {
    updateFilters({ pageSize: newSize, page: 1 });
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    updateFilters({ difficulty: newDifficulty, page: 1 });
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    updateFilters({ q: val, page: 1 });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    updateFilters({ q: "", difficulty: "all", page: 1 });
  };

  const hasActiveFilters = Boolean(debouncedSearch || (difficulty && difficulty !== "all"));

  const handleCreate = (values: QuestionValues) => {
    createMutation.mutate({ bankId, ...values } as any, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (values: QuestionValues) => {
    if (!questionToEdit) return;
    updateMutation.mutate({ id: questionToEdit.id, bankId, ...values } as any, {
      onSuccess: () => setQuestionToEdit(null),
    });
  };

  const handleDelete = () => {
    if (!questionToDelete) return;
    deleteMutation.mutate(
      { id: questionToDelete.id, bankId },
      { onSuccess: () => setQuestionToDelete(null) },
    );
  };

  if (isBankLoading) return <LoadingState label="Loading bank details..." />;
  if (bankError) return <ErrorState title="Failed to load bank" description={bankError.message} />;
  if (!bank) return null;

  const totalQuestions = questionsData?.total ?? bank.questionCount ?? 0;
  const questions = questionsData?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title={bank.name}
          description={bank.description || "Manage and review questions in this question bank."}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/practice/config`} search={{ mode: "all", topic: undefined }}>
              <Play className="mr-2 h-4 w-4" /> Practice
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={ROUTES.createTest}>
              <Settings2 className="mr-2 h-4 w-4" /> Create Test
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/question-banks/$bankId/import" params={{ bankId }}>
              <Upload className="mr-2 h-4 w-4" /> Import
            </Link>
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>
      </div>

      {/* Main Section */}
      <div id="questions-list-section" className="space-y-4 pt-2">
        {/* Section Title & Live Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Questions</h2>
            <Badge variant="secondary" className="font-mono text-xs font-semibold">
              {totalQuestions}
            </Badge>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                Matching search: <strong>{totalQuestions}</strong> questions
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6 px-2 text-xs text-primary hover:text-primary"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card p-3 rounded-lg border shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search question text or options..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-8 h-9 text-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2 sm:w-[180px]">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:inline" />
            <Select value={difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Questions List Content */}
        {isQuestionsLoading ? (
          <LoadingState label="Loading questions..." />
        ) : questionsError ? (
          <ErrorState title="Failed to load questions" description={questionsError.message} />
        ) : questions.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              title="No matching questions"
              description="No questions match your current search or filter criteria."
              action={
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              title="No questions yet"
              description="Add your first question manually or import from a PDF / file."
              action={<Button onClick={() => setIsCreateOpen(true)}>Add Question</Button>}
            />
          )
        ) : (
          <div className="space-y-4">
            {/* Question Cards */}
            <div className="space-y-4">
              {questions.map((q, i) => {
                const questionIndex = (page - 1) * pageSize + i + 1;
                return (
                  <QuestionPreview
                    key={q.id}
                    question={q}
                    index={questionIndex}
                    onEdit={setQuestionToEdit}
                    onDelete={setQuestionToDelete}
                  />
                );
              })}
            </div>

            {/* Advanced Pagination Bar */}
            <AdvancedPagination
              currentPage={page}
              totalItems={totalQuestions}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 20, 50, 100]}
              scrollTargetId="questions-list-section"
              showQuickJumper
              showBatchPills
              showPageSizeSelector
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>Create a new multiple choice question.</DialogDescription>
          </DialogHeader>
          <QuestionForm
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
            onCancel={() => setIsCreateOpen(false)}
            submitLabel="Create Question"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!questionToEdit} onOpenChange={(open) => !open && setQuestionToEdit(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>Update the details of this question.</DialogDescription>
          </DialogHeader>
          {questionToEdit && (
            <QuestionForm
              initialValues={questionToEdit}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
              onCancel={() => setQuestionToEdit(null)}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!questionToDelete}
        onOpenChange={(open) => !open && setQuestionToDelete(null)}
        title="Delete Question?"
        description="This action cannot be undone. Are you sure you want to permanently delete this question?"
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
