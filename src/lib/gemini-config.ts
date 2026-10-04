/**
 * Gemini API Configuration and Local Storage Helpers
 *
 * Provides secure client-side storage of user's personal Google Gemini API keys,
 * status checks, active key resolution (Custom -> System Default), and test connection.
 */

const STORAGE_KEY = "qbank_gemini_api_key";

export interface GeminiKeyStatus {
  hasKey: boolean;
  isCustom: boolean;
  hasSystemDefault: boolean;
  maskedKey: string;
  source: "custom" | "system" | "none";
}

/**
 * Get user's custom API key from localStorage (if any)
 */
export function getCustomGeminiApiKey(): string | null {
  try {
    const key = localStorage.getItem(STORAGE_KEY);
    return key ? key.trim() : null;
  } catch {
    return null;
  }
}

/**
 * Save user's custom API key to localStorage
 */
export function setCustomGeminiApiKey(key: string): void {
  try {
    const cleanKey = key.trim();
    if (cleanKey) {
      localStorage.setItem(STORAGE_KEY, cleanKey);
      window.dispatchEvent(new Event("gemini-key-changed"));
    } else {
      removeCustomGeminiApiKey();
    }
  } catch (err) {
    console.error("Failed to save Gemini API key in localStorage:", err);
  }
}

/**
 * Remove user's custom API key from localStorage
 */
export function removeCustomGeminiApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("gemini-key-changed"));
  } catch (err) {
    console.error("Failed to remove Gemini API key from localStorage:", err);
  }
}

/**
 * Get the system default API key from environment variables
 */
export function getSystemGeminiApiKey(): string | null {
  const envKey = import.meta.env["VITE_GEMINI_API_KEY"];
  return envKey ? String(envKey).trim() : null;
}

/**
 * Get the currently active Gemini API key (custom takes precedence over system default)
 */
export function getActiveGeminiApiKey(): string | null {
  const custom = getCustomGeminiApiKey();
  if (custom) return custom;
  return getSystemGeminiApiKey();
}

/**
 * Mask an API key for safe display (e.g. AIzaSy...9xK)
 */
export function maskApiKey(key: string | null): string {
  if (!key) return "Not configured";
  if (key.length <= 10) return "••••••••";
  return `${key.slice(0, 7)}...${key.slice(-4)}`;
}

/**
 * Get complete status of Gemini API configuration
 */
export function getGeminiKeyStatus(): GeminiKeyStatus {
  const custom = getCustomGeminiApiKey();
  const system = getSystemGeminiApiKey();

  if (custom) {
    return {
      hasKey: true,
      isCustom: true,
      hasSystemDefault: Boolean(system),
      maskedKey: maskApiKey(custom),
      source: "custom",
    };
  }

  if (system) {
    return {
      hasKey: true,
      isCustom: false,
      hasSystemDefault: true,
      maskedKey: maskApiKey(system),
      source: "system",
    };
  }

  return {
    hasKey: false,
    isCustom: false,
    hasSystemDefault: false,
    maskedKey: "None",
    source: "none",
  };
}

/**
 * Test a Gemini API key by making a minimal generateContent call
 */
export async function validateGeminiApiKey(apiKey: string): Promise<{
  success: boolean;
  message: string;
  modelUsed?: string;
}> {
  const keyToTest = apiKey.trim();
  if (!keyToTest) {
    return { success: false, message: "API key cannot be empty." };
  }

  const candidateModels = [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
  ];

  let lastError = "";

  for (const model of candidateModels) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keyToTest}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }],
            generationConfig: { maxOutputTokens: 5 },
          }),
        },
      );

      if (response.ok) {
        return {
          success: true,
          message: `Connection successful! Connected to Google ${model}.`,
          modelUsed: model,
        };
      } else {
        const errText = await response.text();
        lastError = errText;
        if (response.status === 400 || response.status === 403) {
          try {
            const parsed = JSON.parse(errText);
            const msg = parsed?.error?.message || "Invalid API key or unauthorized.";
            return { success: false, message: msg };
          } catch {
            return { success: false, message: `Invalid API key (${response.status})` };
          }
        }
      }
    } catch (err: any) {
      lastError = err?.message || String(err);
    }
  }

  return {
    success: false,
    message: lastError || "Failed to reach Google Gemini API.",
  };
}
