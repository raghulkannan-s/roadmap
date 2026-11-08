"use client";

import Link from "next/link";
import { Trash2, Map, CheckSquare, Calendar, ChevronRight } from "lucide-react";

import { ProgressBar } from "./progress-bar";
import { formatDate, calculateProgress } from "@/lib/utils";

import type { Roadmap, TodoList } from "@/lib/types";

interface SavedItemCardProps {
  item: Roadmap | TodoList;
  type: "roadmap" | "todo";
  onDelete: (id: string, type: "roadmap" | "todo") => void;
}

export function SavedItemCard({ item, type, onDelete }: SavedItemCardProps) {
  const isRoadmap = type === "roadmap";
  const roadmap = isRoadmap ? (item as Roadmap) : null;
  const todo = !isRoadmap ? (item as TodoList) : null;

  const milestones = roadmap?.phases.flatMap((p) => p.milestones) ?? [];
  const tasks = todo?.categories.flatMap((c) => c.tasks) ?? [];
  const progress = calculateProgress(isRoadmap ? milestones : tasks);
  const itemCount = isRoadmap ? milestones.length : tasks.length;
  const detailHref = isRoadmap ? `/roadmap/${item.id}` : `/todo/${item.id}`;

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-xs backdrop-blur-xs transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800/90 dark:bg-slate-900/70 dark:hover:border-blue-600/80">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isRoadmap
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
            }`}
          >
            {isRoadmap ? <Map className="h-3 w-3" /> : <CheckSquare className="h-3 w-3" />}
            <span>{isRoadmap ? "Roadmap" : "Todo"}</span>
          </span>
          <button
            type="button"
            onClick={() => onDelete(item.id, type)}
            aria-label="Delete item"
            className="rounded-lg p-1 text-slate-400 opacity-60 transition-all hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 group-hover:opacity-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <Link href={detailHref} className="mt-3 block">
          <h3 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {item.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        <ProgressBar percentage={progress} />

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
          <Link
            href={detailHref}
            className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span>{itemCount} items</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
