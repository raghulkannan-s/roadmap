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
          // Cloud sync failure handled silently (cached locally)
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
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{data.title}</h1>
            <p className="text-sm text-gray-500">{data.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md shrink-0">
          <Clock className="h-3.5 w-3.5" />
          <span>{data.estimatedDuration}</span>
        </div>
      </div>

      <ProgressBar percentage={overallProgress} />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaved || isSaving}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaved ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isSaving ? "Saving..." : isSaved ? "Saved" : "Save Plan"}</span>
          {session?.user && (
            <span title="Cloud Sync enabled">
              <Cloud className="h-3.5 w-3.5 text-blue-500 ml-1" />
            </span>
          )}
        </button>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <RotateCcw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            Regenerate
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
