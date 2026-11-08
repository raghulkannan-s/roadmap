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
      className="group flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
      htmlFor={task.id}
    >
      <input
        id={task.id}
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggle(task.id)}
        className="mt-0.5 h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:checked:bg-indigo-600"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-medium transition-all ${
              task.isCompleted
                ? "text-slate-400 line-through dark:text-slate-500"
                : "text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
            }`}
          >
            {task.title}
          </p>
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${PRIORITY_COLORS[task.priority]}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
        {task.description && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
        )}
      </div>
    </label>
  );
}
