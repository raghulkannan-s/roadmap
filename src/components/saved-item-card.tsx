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
    <div className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-gray-300 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isRoadmap ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {isRoadmap ? <Map className="h-3 w-3" /> : <CheckSquare className="h-3 w-3" />}
            {isRoadmap ? "Roadmap" : "Todo"}
          </span>
          <button
            type="button"
            onClick={() => onDelete(item.id, type)}
            aria-label="Delete item"
            className="rounded-md p-1 text-gray-400 opacity-60 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <Link href={detailHref} className="mt-3 block">
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900 group-hover:text-blue-600">
            {item.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</p>
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        <ProgressBar percentage={progress} />

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
          <Link
            href={detailHref}
            className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
          >
            <span>{itemCount} items</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
