"use client";

import type { Milestone } from "@/lib/types";

interface MilestoneItemProps {
  milestone: Milestone;
  onToggle: (id: string) => void;
}

export function MilestoneItem({ milestone, onToggle }: MilestoneItemProps) {
  return (
    <label
      className="group flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
      htmlFor={milestone.id}
    >
      <input
        id={milestone.id}
        type="checkbox"
        checked={milestone.isCompleted}
        onChange={() => onToggle(milestone.id)}
        className="mt-0.5 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:checked:bg-blue-600"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium transition-all ${
            milestone.isCompleted
              ? "text-slate-400 line-through dark:text-slate-500"
              : "text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          }`}
        >
          {milestone.title}
        </p>
        {milestone.description && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{milestone.description}</p>
        )}
      </div>
    </label>
  );
}
