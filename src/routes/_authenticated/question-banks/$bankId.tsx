import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Download } from "lucide-react";
import { useState } from "react";

import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/common";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useQuestionBank } from "@/features/question-banks/api/use-question-bank";
import {
  useQuestions,
  type QuestionFilters as IQuestionFilters,
} from "@/features/questions/api/use-questions";
import { useCreateQuestion } from "@/features/questions/api/use-create-question";
import { useUpdateQuestion } from "@/features/questions/api/use-update-question";
import { useDeleteQuestion } from "@/features/questions/api/use-delete-question";

import { QuestionFilters } from "@/features/questions/components/question-filters";
import { QuestionForm, type QuestionValues } from "@/features/questions/components/question-form";
import { QuestionPreview } from "@/features/questions/components/question-preview";
import { BankPerformanceSummary } from "@/features/practice/components/bank-performance-summary";
import type { Question } from "@/types/domain";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_authenticated/question-banks/$bankId")({
  head: () => ({
    meta: [
      { title: "Question Bank Details — QBank" },
      { name: "description", content: "Manage questions in this bank." },
    ],
  }),
  component: QuestionBankDetailsPage,
});

function QuestionBankDetailsPage() {
  const { bankId } = Route.useParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<IQuestionFilters>({ page: 1, pageSize: 10 });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  const {
    data: bank,
    isLoading: isBankLoading,
    error: bankError,
    refetch: refetchBank,
  } = useQuestionBank(bankId);
  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuestions(bankId, filters);

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const handleCreate = (values: QuestionValues) => {
    createMutation.mutate(
      {
        bankId,
        ...values,
        explanation: values.explanation || null,
        difficulty: values.difficulty || null,
        topic: values.topic || null,
        sourceReference: values.sourceReference || null,
      },
      {
        onSuccess: () => setIsCreateOpen(false),
      },
    );
  };

  const handleUpdate = (values: QuestionValues) => {
    if (!questionToEdit) return;
    updateMutation.mutate(
      {
        id: questionToEdit.id,
        bankId,
        ...values,
        explanation: values.explanation || null,
        difficulty: values.difficulty || null,
        topic: values.topic || null,
        sourceReference: values.sourceReference || null,
      },
      {
        onSuccess: () => setQuestionToEdit(null),
      },
    );
  };

  const handleDelete = () => {
    if (!questionToDelete) return;
    deleteMutation.mutate(
      { id: questionToDelete.id, bankId },
      {
        onSuccess: () => setQuestionToDelete(null),
      },
    );
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  if (isBankLoading) return <LoadingState label="Loading question bank details..." />;
  if (bankError)
    return (
      <ErrorState
        title="Failed to load bank"
        description={(bankError as Error).message}
        onRetry={() => refetchBank()}
      />
    );
  if (!bank)
    return (
      <EmptyState
        title="Not found"
        description="This question bank does not exist or you do not have permission to view it."
      />
    );

  const totalPages = Math.ceil((questionsData?.total || 0) / (filters.pageSize || 10));

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <AppBreadcrumbs />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground mb-2"
            onClick={() => navigate({ to: ROUTES.questionBanks })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Banks
          </Button>
          <PageHeader
            title={bank.name}
            description={bank.description || "No description provided."}
          />
          <p className="text-sm text-muted-foreground">
            {bank.questionCount} {bank.questionCount === 1 ? "question" : "questions"}
            {bank.subject ? ` • ${bank.subject}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate({ to: ROUTES.importQuestions(bankId) })}>
            <Download className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="performance">Performance Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-6">

      <QuestionFilters
        onFiltersChange={(f) => setFilters((prev) => ({ ...prev, ...f, page: 1 }))}
        isLoading={isQuestionsLoading}
      />

      {isQuestionsLoading ? (
        <LoadingState label="Loading questions..." />
      ) : questionsError ? (
        <ErrorState
          title="Failed to load questions"
          description={(questionsError as Error).message}
          onRetry={() => refetchQuestions()}
        />
      ) : questionsData?.items.length === 0 ? (
        <EmptyState
          title="No questions found"
          description="There are no questions matching your criteria."
          action={<Button onClick={() => setIsCreateOpen(true)}>Add Question</Button>}
        />
      ) : (
        <div className="space-y-4">
          {questionsData?.items.map((q, i) => (
            <QuestionPreview
              key={q.id}
              question={q}
              index={((filters.page || 1) - 1) * (filters.pageSize || 10) + i + 1}
              onEdit={setQuestionToEdit}
              onDelete={setQuestionToDelete}
            />
          ))}

          {totalPages > 1 && (
            <div className="py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                      className={
                        (filters.page || 1) <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-sm text-muted-foreground px-4">
                      Page {filters.page} of {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, (filters.page || 1) + 1))
                      }
                      className={
                        (filters.page || 1) >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
      </TabsContent>
      
      <TabsContent value="performance">
        <BankPerformanceSummary bankId={bankId} />
      </TabsContent>
      </Tabs>

      {/* Create Question Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Create a new multiple choice question in this bank.
            </DialogDescription>
          </DialogHeader>
          <QuestionForm
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
            onCancel={() => setIsCreateOpen(false)}
            submitLabel="Add Question"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={!!questionToEdit} onOpenChange={(open) => !open && setQuestionToEdit(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>Update the question details and answers.</DialogDescription>
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

      {/* Delete Question Confirmation */}
      <ConfirmDialog
        open={!!questionToDelete}
        onOpenChange={(open) => !open && setQuestionToDelete(null)}
        title="Delete Question?"
        description="Are you sure you want to delete this question? This action cannot be undone."
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        confirmLabel="Delete Question"
        destructive
      />
    </div>
  );
}
