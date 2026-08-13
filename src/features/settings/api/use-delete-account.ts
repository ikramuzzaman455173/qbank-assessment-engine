import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useDeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteAccount = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error: functionError } = await supabase.functions.invoke(
        "delete-user-account",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (functionError) throw functionError;

      // Ensure local session is cleared
      await supabase.auth.signOut();
      
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteAccount, isDeleting, error };
}
