"use client";

import { createContext, useContext, useState, useCallback } from "react";

import type { ReactNode } from "react";
import type { GenerationMode, Roadmap, TodoList } from "@/lib/types";

interface GenerationContextValue {
  result: Roadmap | TodoList | null;
  mode: GenerationMode;
  prompt: string;
  isLoading: boolean;
  error: string | null;
  setMode: (mode: GenerationMode) => void;
  setPrompt: (prompt: string) => void;
  generate: (customPrompt?: string, customMode?: GenerationMode) => Promise<void>;
  clearResult: () => void;
}

const GenerationContext = createContext<GenerationContextValue | null>(null);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<Roadmap | TodoList | null>(null);
  const [mode, setMode] = useState<GenerationMode>("roadmap");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (customPrompt?: string, customMode?: GenerationMode) => {
      const targetPrompt = (customPrompt ?? prompt).trim();
      const targetMode = customMode ?? mode;

      if (!targetPrompt) {
        setError("Please enter a prompt.");
        return;
      }

      if (customPrompt !== undefined) setPrompt(customPrompt);
      if (customMode !== undefined) setMode(customMode);

      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: targetPrompt, mode: targetMode }),
        });

        const json = await response.json();

        if (!json.success) {
          setError(json.error || "Something went wrong.");
          return;
        }

        setResult(json.data);
      } catch (err) {
        console.error("[Generation] Request failed:", err);
        setError("Network error. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [prompt, mode]
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return (
    <GenerationContext.Provider
      value={{
        result,
        mode,
        prompt,
        isLoading,
        error,
        setMode,
        setPrompt,
        generate,
        clearResult,
      }}
    >
      {children}
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
