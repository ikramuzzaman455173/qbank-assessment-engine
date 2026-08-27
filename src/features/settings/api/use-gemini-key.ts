import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGeminiKeyStatus,
  getCustomGeminiApiKey,
  setCustomGeminiApiKey,
  removeCustomGeminiApiKey,
  validateGeminiApiKey,
  type GeminiKeyStatus,
} from "@/lib/gemini-config";

export function useGeminiKey() {
  const [status, setStatus] = useState<GeminiKeyStatus>(getGeminiKeyStatus());
  const [customKey, setCustomKey] = useState<string>(getCustomGeminiApiKey() || "");

  const refreshStatus = useCallback(() => {
    setStatus(getGeminiKeyStatus());
    setCustomKey(getCustomGeminiApiKey() || "");
  }, []);

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
      // Test key first before saving
      const validation = await validateGeminiApiKey(trimmed);
      if (!validation.success) {
        throw new Error(validation.message || "Failed to validate API key with Google Gemini.");
      }
      setCustomGeminiApiKey(trimmed);
      return validation;
    },
    onSuccess: (data) => {
      refreshStatus();
      toast.success(data.message || "Gemini API key verified & saved successfully!");
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

  const removeKey = useCallback(() => {
    removeCustomGeminiApiKey();
    refreshStatus();
    toast.success("Custom Gemini API key removed. Reverted to system default (if available).");
  }, [refreshStatus]);

  return {
    status,
    customKey,
    saveKey: saveKeyMutation.mutateAsync,
    isSaving: saveKeyMutation.isPending,
    testKey: testKeyMutation.mutateAsync,
    isTesting: testKeyMutation.isPending,
    removeKey,
    refreshStatus,
  };
}
