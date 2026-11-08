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
    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
      <button
        type="button"
        onClick={() => onModeChange("roadmap")}
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
          mode === "roadmap"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        <Map className="h-4 w-4" />
        Roadmap
      </button>
      <button
        type="button"
        onClick={() => onModeChange("todo")}
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
          mode === "todo"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        <CheckSquare className="h-4 w-4" />
        Todo
      </button>
    </div>
  );
}

