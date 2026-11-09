"use client";

import { useState } from "react";
import { RotateCcw, ArrowLeft, Check, Cloud } from "lucide-react";

import { CategoryGroup } from "./category-group";
import { ProgressBar } from "./progress-bar";
import { calculateProgress } from "@/lib/utils";

import type { TodoList, Category } from "@/lib/types";

interface TodoViewProps {
  data: Omit<TodoList, "createdAt" | "prompt"> & { id?: string; createdAt?: string };
  onBack: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function TodoView({
  data,
  onBack,
  onRegenerate,
  isRegenerating = false,
}: TodoViewProps) {
  const [categories, setCategories] = useState<Category[]>(data.categories);
  const currentId = data.id;

  const allTasks = categories.flatMap((cat) => cat.tasks);
  const overallProgress = calculateProgress(allTasks);

  const handleToggleTask = async (categoryId: string, taskId: string) => {
    const updated = categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            tasks: cat.tasks.map((t) =>
              t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
            ),
          }
        : cat
    );

    setCategories(updated);

    if (currentId) {
      try {
        await fetch(`/api/todos/${currentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categories: updated }),
        });
      } catch (err) {
        console.error("Failed to sync task toggle to cloud:", err);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {data.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{data.description}</p>
          </div>
        </div>
      </div>

      <ProgressBar percentage={overallProgress} />

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
          <Check className="h-4 w-4" />
          <span>Saved to Cloud</span>
          <Cloud className="h-3.5 w-3.5 ml-0.5" />
        </div>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <RotateCcw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryGroup
            key={category.id}
            category={category}
            onToggleTask={handleToggleTask}
          />
        ))}
      </div>
    </div>
  );
}
