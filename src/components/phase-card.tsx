"use client";

import { Clock } from "lucide-react";

import { MilestoneItem } from "./milestone-item";
import { calculateProgress } from "@/lib/utils";

import type { Phase } from "@/lib/types";

interface PhaseCardProps {
  phase: Phase;
  onToggleMilestone: (phaseId: string, milestoneId: string) => void;
}

export function PhaseCard({ phase, onToggleMilestone }: PhaseCardProps) {
  const progress = calculateProgress(phase.milestones);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-xs backdrop-blur-xs transition-all dark:border-slate-800/90 dark:bg-slate-900/70">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:border-indigo-800/60 dark:text-indigo-400">
              {phase.order}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {phase.title}
            </h3>
          </div>
          {phase.description && (
            <p className="mt-1 text-xs text-slate-500 pl-8.5 dark:text-slate-400">
              {phase.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg shrink-0 dark:bg-slate-800/60 dark:text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          <span>{phase.duration}</span>
        </div>
      </div>

      {/* Phase progress */}
      <div className="mt-3 ml-8.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-3 space-y-0.5 pl-6">
        {phase.milestones.map((milestone) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            onToggle={(milestoneId) =>
              onToggleMilestone(phase.id, milestoneId)
            }
          />
        ))}
      </div>
    </div>
  );
}
