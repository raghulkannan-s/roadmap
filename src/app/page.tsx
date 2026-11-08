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
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                <span>Generating your custom {mode === "roadmap" ? "roadmap" : "todo list"}...</span>
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
            {/* Hero Section */}
            <section className="text-center space-y-3 pt-4 sm:pt-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>AI Roadmap & Todo Studio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Turn your goals into{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  executable plans
                </span>
              </h1>
              <p className="mx-auto max-w-lg text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Describe your target or project idea. Get a phased roadmap or an organized task list stored securely in your cloud database.
              </p>
            </section>

            {error && (
              <div className="mx-auto max-w-2xl flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Generation failed</p>
                  <p className="mt-0.5 text-rose-700 dark:text-rose-400">{error}</p>
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
