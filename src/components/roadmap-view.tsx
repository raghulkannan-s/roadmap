"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Save, RotateCcw, ArrowLeft, Clock, Check, Cloud } from "lucide-react";

import { PhaseCard } from "./phase-card";
import { ProgressBar } from "./progress-bar";
import { calculateProgress, generateId } from "@/lib/utils";
import { saveRoadmap, updateRoadmap } from "@/lib/storage";

import type { Roadmap, Phase } from "@/lib/types";

interface RoadmapViewProps {
  data: Omit<Roadmap, "id" | "createdAt" | "prompt"> & { id?: string; createdAt?: string };
  prompt?: string;
  onBack: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function RoadmapView({
  data,
  prompt = "",
  onBack,
  onRegenerate,
  isRegenerating = false,
}: RoadmapViewProps) {
  const { data: session } = useSession();
  const [phases, setPhases] = useState<Phase[]>(data.phases);
  const [currentId, setCurrentId] = useState<string | undefined>(data.id);
  const [isSaved, setIsSaved] = useState(Boolean(data.id));
  const [isSaving, setIsSaving] = useState(false);

  const allMilestones = phases.flatMap((phase) => phase.milestones);
  const overallProgress = calculateProgress(allMilestones);

  const handleToggleMilestone = async (phaseId: string, milestoneId: string) => {
    const updated = phases.map((phase) =>
      phase.id === phaseId
        ? {
            ...phase,
            milestones: phase.milestones.map((m) =>
              m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
            ),
          }
        : phase
    );

    setPhases(updated);

    if (currentId) {
      updateRoadmap(currentId, { phases: updated });

      if (session?.user) {
        try {
          await fetch(`/api/roadmaps/${currentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phases: updated }),
          });
        } catch {
          // Cloud sync failure handled silently
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
        const res = await fetch("/api/roadmaps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            estimatedDuration: data.estimatedDuration,
            phases,
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

    const roadmap: Roadmap = {
      id: targetId,
      title: data.title,
      description: data.description,
      estimatedDuration: data.estimatedDuration,
      phases,
      createdAt: new Date().toISOString(),
      prompt,
    };

    saveRoadmap(roadmap);
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
            className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {data.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{data.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg shrink-0 dark:bg-slate-800 dark:text-slate-300">
          <Clock className="h-3.5 w-3.5 text-indigo-500" />
          <span>{data.estimatedDuration}</span>
        </div>
      </div>

      <ProgressBar percentage={overallProgress} />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaved || isSaving}
          className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaved ? (
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isSaving ? "Saving..." : isSaved ? "Saved" : "Save Plan"}</span>
          {session?.user && (
            <span title="Cloud Sync enabled">
              <Cloud className="h-3.5 w-3.5 text-indigo-500 ml-1" />
            </span>
          )}
        </button>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <RotateCcw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {phases
          .sort((a, b) => a.order - b.order)
          .map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              onToggleMilestone={handleToggleMilestone}
            />
          ))}
      </div>
    </div>
  );
}
