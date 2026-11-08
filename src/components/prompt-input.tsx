"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import { MAX_PROMPT_LENGTH } from "@/lib/constants";

import type { GenerationMode } from "@/lib/types";

interface PromptInputProps {
  onSubmit: (prompt: string, mode: GenerationMode) => void;
  isLoading: boolean;
}

const PLACEHOLDER_EXAMPLES: Record<GenerationMode, string> = {
  roadmap: "e.g., I want to learn React from scratch in 3 months...",
  todo: "e.g., Things I need to do to launch my portfolio website...",
};

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<GenerationMode>("roadmap");

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim(), mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCount = prompt.length;
  const isOverLimit = charCount > MAX_PROMPT_LENGTH;

  return (
    <section className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex justify-center">
        <ModeToggle mode={mode} onModeChange={setMode} />
      </div>

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER_EXAMPLES[mode]}
          rows={4}
          disabled={isLoading}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span
          className={`absolute bottom-3 right-3 text-xs ${
            isOverLimit ? "text-red-500" : "text-gray-400"
          }`}
        >
          {charCount}/{MAX_PROMPT_LENGTH}
        </span>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim() || isOverLimit}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate {mode === "roadmap" ? "Roadmap" : "Todo List"}
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        Press Ctrl+Enter to generate
      </p>
    </section>
  );
}

