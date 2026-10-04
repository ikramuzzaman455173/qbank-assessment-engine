import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "@/features/auth/hooks/use-session";
import { usePreferences, useUpdatePreferences } from "./use-preferences";
import {
  getGeminiKeyStatus,
  getCustomGeminiApiKey,
  setCustomGeminiApiKey,
  removeCustomGeminiApiKey,
  validateGeminiApiKey,
  type GeminiKeyStatus,
} from "@/lib/gemini-config";

export function useGeminiKey() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { data: preferences } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const [status, setStatus] = useState<GeminiKeyStatus>(getGeminiKeyStatus());
  const [customKey, setCustomKey] = useState<string>(
    preferences?.gemini_api_key || getCustomGeminiApiKey() || "",
  );

  // Sync DB key to state and cache
  useEffect(() => {
    if (preferences?.gemini_api_key) {
      setCustomGeminiApiKey(preferences.gemini_api_key);
      setCustomKey(preferences.gemini_api_key);
      setStatus(getGeminiKeyStatus());
    } else if (preferences && preferences.gemini_api_key === null) {
      removeCustomGeminiApiKey();
      setCustomKey("");
      setStatus(getGeminiKeyStatus());
    }
  }, [preferences]);

  const refreshStatus = useCallback(() => {
    setStatus(getGeminiKeyStatus());
    setCustomKey(preferences?.gemini_api_key || getCustomGeminiApiKey() || "");
  }, [preferences?.gemini_api_key]);

  useEffect(() => {
    refreshStatus();
    const handleKeyChange = () => refreshStatus();
    window.addEventListener("gemini-key-changed", handleKeyChange);
    window.addEventListener("storage", handleKeyChange);
    return () => {
      window.removeEventListener("gemini-key-changed", handleKeyChange);
      window.removeEventListener("storage", handleKeyChange);
    };
  }, [refreshStatus]);

  const saveKeyMutation = useMutation({
    mutationFn: async (key: string) => {
      const trimmed = key.trim();
      if (!trimmed) {
        throw new Error("Please enter a valid Gemini API key.");
      }
      // 1. Test key first before saving
      const validation = await validateGeminiApiKey(trimmed);
      if (!validation.success) {
        throw new Error(validation.message || "Failed to validate API key with Google Gemini.");
      }

      // 2. Save in database if logged in
      if (user) {
        await updatePreferences.mutateAsync({ gemini_api_key: trimmed });
      }

      // 3. Save in local cache
      setCustomGeminiApiKey(trimmed);
      return validation;
    },
    onSuccess: (data) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["user_preferences", user.id] });
      }
      refreshStatus();
      toast.success(data.message || "Gemini API key saved to your account successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save API key.");
    },
  });

  const testKeyMutation = useMutation({
    mutationFn: async (key: string) => {
      const trimmed = key.trim();
      if (!trimmed) {
        throw new Error("Please enter an API key to test.");
      }
      return await validateGeminiApiKey(trimmed);
    },
  });

  const removeKey = useCallback(async () => {
    try {
      if (user) {
        await updatePreferences.mutateAsync({ gemini_api_key: null });
        queryClient.invalidateQueries({ queryKey: ["user_preferences", user.id] });
      }
      removeCustomGeminiApiKey();
      refreshStatus();
      toast.success("Custom Gemini API key removed from your account.");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove API key.");
    }
  }, [user, updatePreferences, queryClient, refreshStatus]);

  return {
    status,
    customKey,
    saveKey: saveKeyMutation.mutateAsync,
    isSaving: saveKeyMutation.isPending || updatePreferences.isPending,
    testKey: testKeyMutation.mutateAsync,
    isTesting: testKeyMutation.isPending,
    removeKey,
    refreshStatus,
  };
}
