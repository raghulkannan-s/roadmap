"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { FolderKanban, Plus, Lock, Cloud, RefreshCw } from "lucide-react";

import { SavedItemCard } from "./saved-item-card";

import type { TodoList } from "@/lib/types";

interface SavedItemsListProps {
  onNewPlanClick?: () => void;
}

export function SavedItemsList({ onNewPlanClick }: SavedItemsListProps) {
  const { data: session } = useSession();
  const [todos, setTodos] = useState<TodoList[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCloudItems = useCallback(async () => {
    if (!session?.user) return;
    setIsLoading(true);

    try {
      const todosRes = await fetch("/api/todos");
      const todosData = await todosRes.json();
      if (todosData.success) setTodos(todosData.data);
    } catch (err) {
      console.error("Failed to refresh cloud items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    let ignore = false;
    if (!session?.user) return;

    fetch("/api/todos")
      .then((r) => r.json())
      .then((todosData) => {
        if (!ignore) {
          if (todosData.success) setTodos(todosData.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load cloud items:", err);
      });

    return () => {
      ignore = true;
    };
  }, [session?.user]);

  const handleDelete = async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/todos/${id}`, { method: "DELETE" }).catch(() => {});
  };

  const totalCount = todos.length;

  return (
    <section id="saved-items" className="w-full max-w-4xl mx-auto space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Saved Plans
              </h2>
              <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <Cloud className="h-3 w-3" />
                <span>Cloud</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Securely stored in your PostgreSQL / Neon Database
            </p>
          </div>
        </div>

        {session?.user && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshCloudItems}
              disabled={isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              title="Refresh cloud items"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>

          </div>
        )}
      </div>

      {!session?.user ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/40 p-10 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            Sign in to access your cloud plans
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm dark:text-slate-400">
            Connect your Google account to view, track, and sync all your generated todo lists in the cloud.
          </p>
          <button
            type="button"
            onClick={() => signIn("google")}
            className="mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <span>Sign in with Google</span>
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-slate-200 bg-white/50 p-5 animate-pulse dark:border-slate-800 dark:bg-slate-900/50"
            />
          ))}
        </div>
      ) : totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 p-10 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <FolderKanban className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            No saved plans in the cloud yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-xs dark:text-slate-400">
            Generate your first todo list using AI above. It will be saved automatically to your database.
          </p>
          {onNewPlanClick && (
            <button
              type="button"
              onClick={onNewPlanClick}
              className="mt-4 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Create Plan</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {todos.map((item) => (
            <SavedItemCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
