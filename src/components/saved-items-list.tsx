"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FolderKanban, Plus } from "lucide-react";

import { SavedItemCard } from "./saved-item-card";
import { useRoadmaps, useTodos } from "@/hooks/use-local-storage";
import { deleteRoadmap, deleteTodo } from "@/lib/storage";

type FilterTab = "all" | "roadmap" | "todo";

interface SavedItemsListProps {
  onNewPlanClick?: () => void;
}

export function SavedItemsList({ onNewPlanClick }: SavedItemsListProps) {
  const { data: session } = useSession();
  const roadmaps = useRoadmaps();
  const todos = useTodos();
  const [filter, setFilter] = useState<FilterTab>("all");

  const handleDelete = (id: string, type: "roadmap" | "todo") => {
    if (type === "roadmap") {
      deleteRoadmap(id);
    } else {
      deleteTodo(id);
    }

    if (session?.user) {
      const endpoint = type === "roadmap" ? `/api/roadmaps/${id}` : `/api/todos/${id}`;
      fetch(endpoint, { method: "DELETE" }).catch(() => {});
    }
  };

  const totalCount = roadmaps.length + todos.length;

  return (
    <section id="saved-items" className="w-full max-w-4xl mx-auto space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Saved Plans</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {session?.user
              ? "Synced with Neon Database & cached locally"
              : "Stored locally in your browser"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200/80 bg-slate-100/80 p-1 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900/80">
          {(["all", "roadmap", "todo"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1 capitalize transition-all ${
                filter === tab
                  ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab === "all" ? `All (${totalCount})` : tab === "roadmap" ? `Roadmaps (${roadmaps.length})` : `Todos (${todos.length})`}
            </button>
          ))}
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 p-10 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <FolderKanban className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No saved plans yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-xs dark:text-slate-400">
            Generate your first roadmap or todo list using AI above and save it to track your progress.
          </p>
          {onNewPlanClick && (
            <button
              type="button"
              onClick={onNewPlanClick}
              className="mt-4 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:opacity-95"
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
