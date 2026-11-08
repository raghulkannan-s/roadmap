"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

export function ProgressBar({ percentage, className }: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>Completion</span>
        <span className="font-mono text-slate-700 dark:text-slate-300">{clampedPercentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}
