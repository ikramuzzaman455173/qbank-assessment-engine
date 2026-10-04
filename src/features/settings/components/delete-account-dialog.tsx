import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { useDeleteAccount } from "../api/use-delete-account";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function DeleteAccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { deleteAccount, isDeleting, error } = useDeleteAccount();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
      setIsOpen(false);
      navigate({ to: "/auth" });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account");
    }
  };

  const isConfirmEnabled = confirmText === "DELETE";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="size-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription className="pt-2 text-base text-foreground">
            This action is permanent and cannot be undone. All of your profile data, question banks,
            tests, and practice history will be immediately and permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20">
              {error.message}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Please type <span className="font-bold">DELETE</span> to confirm
            </label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE in capital letters to confirm"
              className="border-destructive/50 focus-visible:ring-destructive"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmEnabled || isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              "Permanently Delete Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
