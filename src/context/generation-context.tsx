"use client";

import { createContext, useContext, useState, useCallback } from "react";

import type { ReactNode } from "react";
import type { GeneratedTodo } from "@/lib/types";
import { GenerationErrorToast } from "@/components/generation-error-toast";

interface GenerationContextValue {
  result: GeneratedTodo | null;
  prompt: string;
  isLoading: boolean;
  error: string | null;
  setPrompt: (prompt: string) => void;
  generate: (customPrompt?: string) => Promise<void>;
  clearResult: () => void;
}

const GenerationContext = createContext<GenerationContextValue | null>(null);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<GeneratedTodo | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (customPrompt?: string) => {
      const targetPrompt = (customPrompt ?? prompt).trim();

      if (!targetPrompt) {
        setError("Please enter a prompt.");
        return;
      }

      if (customPrompt !== undefined) setPrompt(customPrompt);

      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: targetPrompt }),
        });

        const json = await response.json();

        if (!json.success) {
          setError(json.error || "Something went wrong.");
          return;
        }

        setResult(json.data);
        if (json.data.status === "fallback" && json.data.message) {
          setError(json.data.message);
        }
      } catch (err) {
        console.error("[Generation] Request failed:", err);
        setError("Network error. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [prompt]
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <GenerationContext.Provider
      value={{
        result,
        prompt,
        isLoading,
        error,
        setPrompt,
        generate,
        clearResult,
      }}
    >
      {children}
      {error && (
        <GenerationErrorToast message={error} onClose={dismissError} />
      )}
    </GenerationContext.Provider>
  );
}

export function useGeneration(): GenerationContextValue {
  const context = useContext(GenerationContext);

  if (!context) {
    throw new Error("useGeneration must be used within a GenerationProvider");
  }

  return context;
}
