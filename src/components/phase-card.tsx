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
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
              {phase.order}
            </span>
            <h3 className="text-base font-semibold text-gray-900">
              {phase.title}
            </h3>
          </div>
          {phase.description && (
            <p className="mt-1 text-sm text-gray-500 pl-8">
              {phase.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
          <Clock className="h-3.5 w-3.5" />
          <span>{phase.duration}</span>
        </div>
      </div>

      {/* Phase progress */}
      <div className="mt-3 ml-8">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
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

