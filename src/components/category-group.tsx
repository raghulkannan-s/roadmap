"use client";

import { FolderOpen } from "lucide-react";

import { TaskItem } from "./task-item";
import { calculateProgress } from "@/lib/utils";

import type { Category } from "@/lib/types";

interface CategoryGroupProps {
  category: Category;
  onToggleTask: (categoryId: string, taskId: string) => void;
}

export function CategoryGroup({ category, onToggleTask }: CategoryGroupProps) {
  const progress = calculateProgress(category.tasks);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-xs backdrop-blur-xs transition-all dark:border-slate-800/90 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <FolderOpen className="h-4 w-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {category.name}
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md dark:bg-slate-800/60 dark:text-slate-400">
          {category.tasks.filter((t) => t.isCompleted).length} / {category.tasks.length} done
        </span>
      </div>

      {/* Category progress */}
      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-3 space-y-0.5">
        {category.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={(taskId) => onToggleTask(category.id, taskId)}
          />
        ))}
      </div>
    </div>
  );
}
