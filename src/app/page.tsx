"use client";

import { AlertCircle, Sparkles } from "lucide-react";

import { PromptInput } from "@/components/prompt-input";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { TodoView } from "@/components/todo-view";
import { SavedItemsList } from "@/components/saved-items-list";
import { useGeneration } from "@/context/generation-context";

import type { TodoList } from "@/lib/types";

export default function HomePage() {
  const {
    result,
    isLoading,
    generate,
    clearResult,
  } = useGeneration();

  const handlePromptSubmit = (newPrompt: string) => {
    generate(newPrompt);
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
                <span>Generating and saving your todo list... This can take up to 90 seconds.</span>
              </span>
            </div>
            <LoadingSkeleton />
          </div>
        ) : result?.status === "fallback" ? (
          <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900/60 dark:bg-amber-950/30">
            <AlertCircle className="mx-auto h-6 w-6 text-amber-600 dark:text-amber-400" />
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{result.title}</h1>
            <p className="text-sm text-amber-800 dark:text-amber-300">{result.message}</p>
            <button
              type="button"
              onClick={clearResult}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Try another request
            </button>
          </div>
        ) : result ? (
          <div>
            <TodoView
              data={result as TodoList}
              onBack={clearResult}
              onRegenerate={() => generate()}
              isRegenerating={isLoading}
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="text-center space-y-3 pt-4 sm:pt-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>AI Todo Studio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Turn your goals into{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  executable plans
                </span>
              </h1>
              <p className="mx-auto max-w-lg text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Describe your target or project idea. Get an organized todo list saved securely to your cloud database.
              </p>
            </section>

            <PromptInput onSubmit={handlePromptSubmit} isLoading={isLoading} />

            {/* Saved Items Section */}
            <SavedItemsList />
          </>
        )}
      </div>
    </main>
  );
}
