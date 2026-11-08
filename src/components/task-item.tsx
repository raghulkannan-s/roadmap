"use client";

import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/constants";

import type { Task } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <label
      className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
      htmlFor={task.id}
    >
      <input
        id={task.id}
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggle(task.id)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-medium ${
              task.isCompleted
                ? "text-gray-400 line-through"
                : "text-gray-900"
            }`}
          >
            {task.title}
          </p>
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${PRIORITY_COLORS[task.priority]}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
        {task.description && (
          <p className="mt-0.5 text-xs text-gray-500">{task.description}</p>
        )}
      </div>
    </label>
  );
}

