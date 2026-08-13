import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/features/auth/hooks/use-session";

export function useExportData() {
  const { user } = useSession();
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportData = async () => {
    if (!user) throw new Error("Not authenticated");
    setIsExporting(true);
    setError(null);

    try {
      // Fetch all relevant data
      const [
        { data: profile },
        { data: preferences },
        { data: banks },
        { data: tests },
        { data: attempts },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("user_preferences").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("question_banks").select("*"),
        supabase.from("tests").select("*"),
        supabase.from("attempts").select("*"),
      ]);

      const exportObject = {
        exportedAt: new Date().toISOString(),
        user: {
          profile,
          preferences
        },
        data: {
          questionBanks: banks || [],
          tests: tests || [],
          attempts: attempts || [],
        }
      };

      // Create blob and download
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qbank-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportData, isExporting, error };
}
