"use client";

import type { Milestone } from "@/lib/types";

interface MilestoneItemProps {
  milestone: Milestone;
  onToggle: (id: string) => void;
}

export function MilestoneItem({ milestone, onToggle }: MilestoneItemProps) {
  return (
    <label
      className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
      htmlFor={milestone.id}
    >
      <input
        id={milestone.id}
        type="checkbox"
        checked={milestone.isCompleted}
        onChange={() => onToggle(milestone.id)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            milestone.isCompleted
              ? "text-gray-400 line-through"
              : "text-gray-900"
          }`}
        >
          {milestone.title}
        </p>
        {milestone.description && (
          <p className="mt-0.5 text-xs text-gray-500">{milestone.description}</p>
        )}
      </div>
    </label>
  );
}

