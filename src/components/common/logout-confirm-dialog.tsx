import { ConfirmDialog } from "@/components/common/confirm-dialog";

export interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function LogoutConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: LogoutConfirmDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Log out of your account?"
      description="You will need to sign in again to access your question banks, custom tests, and study sessions."
      confirmLabel={isPending ? "Logging out..." : "Log out"}
      cancelLabel="Cancel"
      destructive
      isPending={isPending}
      onConfirm={onConfirm}
    />
  );
}
