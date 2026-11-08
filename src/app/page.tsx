"use client";

import { AlertCircle, Sparkles } from "lucide-react";

import { PromptInput } from "@/components/prompt-input";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { RoadmapView } from "@/components/roadmap-view";
import { TodoView } from "@/components/todo-view";
import { SavedItemsList } from "@/components/saved-items-list";
import { useGeneration } from "@/context/generation-context";

import type { Roadmap, TodoList, GenerationMode } from "@/lib/types";

export default function HomePage() {
  const {
    result,
    mode,
    prompt,
    isLoading,
    error,
    generate,
    clearResult,
  } = useGeneration();

  const handlePromptSubmit = (newPrompt: string, newMode: GenerationMode) => {
    generate(newPrompt, newMode);
  };

  return (
    <main className="flex-1 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Active generation or result view */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                AI is crafting your {mode === "roadmap" ? "roadmap" : "todo list"}...
              </span>
            </div>
            <LoadingSkeleton />
          </div>
        ) : result ? (
          <div>
            {mode === "roadmap" ? (
              <RoadmapView
                data={result as Roadmap}
                prompt={prompt}
                onBack={clearResult}
                onRegenerate={() => generate()}
                isRegenerating={isLoading}
              />
            ) : (
              <TodoView
                data={result as TodoList}
                prompt={prompt}
                onBack={clearResult}
                onRegenerate={() => generate()}
                isRegenerating={isLoading}
              />
            )}
          </div>
        ) : (
          <>
            {/* Hero & Prompt Section */}
            <section className="text-center space-y-3 pt-4 sm:pt-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/70 px-3 py-1 text-xs font-medium text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Powered by Gemini AI</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                Plan your goals with <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Intelligence</span>
              </h1>
              <p className="mx-auto max-w-lg text-sm sm:text-base text-gray-500">
                Type your goal or project idea. Get a phased roadmap or an organized, prioritized todo list in seconds.
              </p>
            </section>

            {error && (
              <div className="mx-auto max-w-2xl flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 p-4 text-xs text-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Generation failed</p>
                  <p className="mt-0.5 text-red-700">{error}</p>
                </div>
              </div>
            )}

            <PromptInput onSubmit={handlePromptSubmit} isLoading={isLoading} />

            {/* Saved Items Section */}
            <SavedItemsList />
          </>
        )}
      </div>
    </main>
  );
}
