"use client";

import { Map, CheckSquare } from "lucide-react";

import { cn } from "@/lib/utils";

import type { GenerationMode } from "@/lib/types";

interface ModeToggleProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex rounded-xl border border-slate-200/90 bg-slate-100/80 p-1 shadow-inner dark:border-slate-800 dark:bg-slate-900/90">
      <button
        type="button"
        onClick={() => onModeChange("roadmap")}
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-150",
          mode === "roadmap"
            ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        )}
      >
        <Map className="h-3.5 w-3.5 text-indigo-500" />
        <span>Roadmap</span>
      </button>
      <button
        type="button"
        onClick={() => onModeChange("todo")}
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-150",
          mode === "todo"
            ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        )}
      >
        <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />
        <span>Todo List</span>
      </button>
    </div>
  );
}
