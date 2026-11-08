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
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-gray-400" />
          <h3 className="text-base font-semibold text-gray-900">
            {category.name}
          </h3>
        </div>
        <span className="text-xs text-gray-400">
          {category.tasks.filter((t) => t.isCompleted).length}/
          {category.tasks.length} done
        </span>
      </div>

      {/* Category progress */}
      <div className="mt-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
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

