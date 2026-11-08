"use client";

import { useState } from "react";
import { FolderKanban, Plus } from "lucide-react";

import { SavedItemCard } from "./saved-item-card";
import { useRoadmaps, useTodos } from "@/hooks/use-local-storage";
import { deleteRoadmap, deleteTodo } from "@/lib/storage";

type FilterTab = "all" | "roadmap" | "todo";

interface SavedItemsListProps {
  onNewPlanClick?: () => void;
}

export function SavedItemsList({ onNewPlanClick }: SavedItemsListProps) {
  const roadmaps = useRoadmaps();
  const todos = useTodos();
  const [filter, setFilter] = useState<FilterTab>("all");

  const handleDelete = (id: string, type: "roadmap" | "todo") => {
    if (type === "roadmap") {
      deleteRoadmap(id);
    } else {
      deleteTodo(id);
    }
  };

  const totalCount = roadmaps.length + todos.length;

  return (
    <section id="saved-items" className="w-full max-w-4xl mx-auto space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Saved Plans</h2>
          <p className="text-xs text-gray-500 mt-0.5">Stored locally in your browser</p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-gray-200 bg-gray-50 p-1 text-xs font-medium">
          {(["all", "roadmap", "todo"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-md px-3 py-1 capitalize transition-all ${
                filter === tab ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "all" ? `All (${totalCount})` : tab === "roadmap" ? `Roadmaps (${roadmaps.length})` : `Todos (${todos.length})`}
            </button>
          ))}
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <FolderKanban className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-gray-900">No saved plans yet</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-xs">
            Generate your first roadmap or todo list using AI above and save it to track your progress.
          </p>
          {onNewPlanClick && (
            <button
              type="button"
              onClick={onNewPlanClick}
              className="mt-4 flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Create Plan</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(filter === "all" || filter === "roadmap") &&
            roadmaps.map((item) => (
              <SavedItemCard key={item.id} item={item} type="roadmap" onDelete={handleDelete} />
            ))}
          {(filter === "all" || filter === "todo") &&
            todos.map((item) => (
              <SavedItemCard key={item.id} item={item} type="todo" onDelete={handleDelete} />
            ))}
        </div>
      )}
    </section>
  );
}
