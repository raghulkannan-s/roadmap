"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Save, RotateCcw, ArrowLeft, Check, Cloud } from "lucide-react";

import { CategoryGroup } from "./category-group";
import { ProgressBar } from "./progress-bar";
import { calculateProgress, generateId } from "@/lib/utils";
import { saveTodo, updateTodo } from "@/lib/storage";

import type { TodoList, Category } from "@/lib/types";

interface TodoViewProps {
  data: Omit<TodoList, "id" | "createdAt" | "prompt"> & { id?: string; createdAt?: string };
  prompt?: string;
  onBack: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function TodoView({
  data,
  prompt = "",
  onBack,
  onRegenerate,
  isRegenerating = false,
}: TodoViewProps) {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>(data.categories);
  const [currentId, setCurrentId] = useState<string | undefined>(data.id);
  const [isSaved, setIsSaved] = useState(Boolean(data.id));
  const [isSaving, setIsSaving] = useState(false);

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
      updateTodo(currentId, { categories: updated });

      if (session?.user) {
        try {
          await fetch(`/api/todos/${currentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categories: updated }),
          });
        } catch {
          // Cloud sync failure handled silently (cached locally)
        }
      }
    } else {
      setIsSaved(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    let targetId = currentId ?? generateId();

    if (session?.user) {
      try {
        const res = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            categories,
            prompt,
          }),
        });
        const json = await res.json();
        if (json.success && json.data?.id) {
          targetId = json.data.id;
        }
      } catch {
        // Fallback to local
      }
    }

    const todo: TodoList = {
      id: targetId,
      title: data.title,
      description: data.description,
      categories,
      createdAt: new Date().toISOString(),
      prompt,
    };

    saveTodo(todo);
    setCurrentId(targetId);
    setIsSaved(true);
    setIsSaving(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{data.title}</h1>
            <p className="text-sm text-gray-500">{data.description}</p>
          </div>
        </div>
      </div>

      <ProgressBar percentage={overallProgress} />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaved || isSaving}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaved ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isSaving ? "Saving..." : isSaved ? "Saved" : "Save Todo"}</span>
          {session?.user && (
            <span title="Cloud Sync enabled">
              <Cloud className="h-3.5 w-3.5 text-blue-500 ml-1" />
            </span>
          )}
        </button>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <RotateCcw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            Regenerate
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
