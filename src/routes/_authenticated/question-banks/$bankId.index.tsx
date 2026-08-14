import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Upload, Play, Settings2 } from "lucide-react";

import { ErrorState, LoadingState, PageHeader, EmptyState } from "@/components/common";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuestionBank } from "@/features/question-banks/api/use-question-bank";
import { useQuestions } from "@/features/questions/api/use-questions";
import { useCreateQuestion } from "@/features/questions/api/use-create-question";
import { useUpdateQuestion } from "@/features/questions/api/use-update-question";
import { useDeleteQuestion } from "@/features/questions/api/use-delete-question";
import { QuestionPreview } from "@/features/questions/components/question-preview";
import { QuestionForm, type QuestionValues } from "@/features/questions/components/question-form";
import type { Question } from "@/types/domain";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_authenticated/question-banks/$bankId/")({
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

  const { data: bank, isLoading: isBankLoading, error: bankError } = useQuestionBank(bankId);
  const { data: questionsData, isLoading: isQuestionsLoading, error: questionsError } = useQuestions(bankId, { pageSize: 100 });
  
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  const handleCreate = (values: QuestionValues) => {
    createMutation.mutate(
      { bankId, ...values } as any,
      { onSuccess: () => setIsCreateOpen(false) }
    );
  };

  const handleUpdate = (values: QuestionValues) => {
    if (!questionToEdit) return;
    updateMutation.mutate(
      { id: questionToEdit.id, bankId, ...values } as any,
      { onSuccess: () => setQuestionToEdit(null) }
    );
  };

  const handleDelete = () => {
    if (!questionToDelete) return;
    deleteMutation.mutate(
      { id: questionToDelete.id, bankId },
      { onSuccess: () => setQuestionToDelete(null) }
    );
  };

  if (isBankLoading) return <LoadingState label="Loading bank details..." />;
  if (bankError) return <ErrorState title="Failed to load bank" description={bankError.message} />;
  if (!bank) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title={bank.name}
          description={bank.description || "Manage your questions for this bank."}
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Questions ({bank.questionCount || 0})</h2>
        </div>

        {isQuestionsLoading ? (
          <LoadingState label="Loading questions..." />
        ) : questionsError ? (
          <ErrorState title="Failed to load questions" description={questionsError.message} />
        ) : questionsData?.items.length === 0 ? (
          <EmptyState
            title="No questions yet"
            description="Add your first question manually or import from a file."
            action={
              <Button onClick={() => setIsCreateOpen(true)}>Add Question</Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {questionsData?.items.map((q, i) => (
              <QuestionPreview
                key={q.id}
                question={q}
                index={i + 1}
                onEdit={setQuestionToEdit}
                onDelete={setQuestionToDelete}
              />
            ))}
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
