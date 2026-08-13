import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/common";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuestionBanks } from "@/features/question-banks/api/use-question-banks";
import { useCreateQuestionBank } from "@/features/question-banks/api/use-create-question-bank";
import { useUpdateQuestionBank } from "@/features/question-banks/api/use-update-question-bank";
import { useDeleteQuestionBank } from "@/features/question-banks/api/use-delete-question-bank";
import { QuestionBankCard } from "@/features/question-banks/components/question-bank-card";
import {
  QuestionBankForm,
  type QuestionBankValues,
} from "@/features/question-banks/components/question-bank-form";
import type { QuestionBank } from "@/types/domain";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_authenticated/question-banks/")({
  head: () => ({
    meta: [
      { title: "Question Banks — QBank" },
      { name: "description", content: "Manage your question banks." },
    ],
  }),
  component: QuestionBanksPage,
});

function QuestionBanksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: banks, isLoading, error, refetch } = useQuestionBanks(debouncedSearch);
  const createMutation = useCreateQuestionBank();
  const updateMutation = useUpdateQuestionBank();
  const deleteMutation = useDeleteQuestionBank();
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [bankToEdit, setBankToEdit] = useState<QuestionBank | null>(null);
  const [bankToDelete, setBankToDelete] = useState<QuestionBank | null>(null);

  const handleCreate = (values: QuestionBankValues) => {
    createMutation.mutate(
      {
        ...values,
        description: values.description || undefined,
        subject: values.subject || undefined,
        topic: values.topic || undefined,
      },
      {
        onSuccess: (newBank) => {
          setIsCreateOpen(false);
          void navigate({ to: ROUTES.questionBank(newBank.id) });
        },
      },
    );
  };

  const handleUpdate = (values: QuestionBankValues) => {
    if (!bankToEdit) return;
    updateMutation.mutate(
      {
        id: bankToEdit.id,
        name: values.name,
        description: values.description || null,
        subject: values.subject || null,
        topic: values.topic || null,
      },
      {
        onSuccess: () => setBankToEdit(null),
      },
    );
  };

  const handleDelete = () => {
    if (!bankToDelete) return;
    deleteMutation.mutate(bankToDelete.id, {
      onSuccess: () => setBankToDelete(null),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Question Banks"
          description="Create and manage your collections of questions."
        />
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Bank
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search question banks..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="Loading question banks..." />
      ) : error ? (
        <ErrorState
          title="Failed to load question banks"
          description={(error as Error).message}
          onRetry={() => refetch()}
        />
      ) : banks?.length === 0 ? (
        <EmptyState
          title={debouncedSearch ? "No results found" : "No question banks yet"}
          description={
            debouncedSearch
              ? `No question banks match "${debouncedSearch}".`
              : "Create your first question bank to start managing MCQs."
          }
          action={
            <Button onClick={() => (debouncedSearch ? setSearchTerm("") : setIsCreateOpen(true))}>
              {debouncedSearch ? "Clear search" : "Create Bank"}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {banks?.map((bank) => (
            <QuestionBankCard
              key={bank.id}
              bank={bank}
              onEdit={setBankToEdit}
              onDelete={setBankToDelete}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Question Bank</DialogTitle>
            <DialogDescription>
              Create a new collection to organize your questions.
            </DialogDescription>
          </DialogHeader>
          <QuestionBankForm
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
            submitLabel="Create Bank"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!bankToEdit} onOpenChange={(open) => !open && setBankToEdit(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Question Bank</DialogTitle>
            <DialogDescription>Update the details of your question bank.</DialogDescription>
          </DialogHeader>
          {bankToEdit && (
            <QuestionBankForm
              initialValues={bankToEdit}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!bankToDelete}
        onOpenChange={(open) => !open && setBankToDelete(null)}
        title="Delete Question Bank?"
        description={`This will permanently delete "${bankToDelete?.name}" and all ${bankToDelete?.questionCount} questions inside it. This action cannot be undone.`}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
