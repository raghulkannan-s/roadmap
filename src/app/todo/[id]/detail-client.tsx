"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

import { TodoView } from "@/components/todo-view";

import type { TodoList } from "@/lib/types";

interface TodoDetailClientProps {
  id: string;
  initialData?: TodoList | null;
}

export function TodoDetailClient({ id, initialData }: TodoDetailClientProps) {
  const router = useRouter();
  const [todo, setTodo] = useState<TodoList | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData && id) {
      let isMounted = true;
      fetch(`/api/todos/${id}`)
        .then((res) => res.json())
        .then((json) => {
          if (isMounted) {
            if (json.success && json.data) {
              setTodo(json.data);
            }
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [id, initialData]);

  if (isLoading) {
    return (
      <main className="flex-1 py-16 px-4 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">Loading plan from cloud database...</p>
        </div>
      </main>
    );
  }

  if (!todo) {
    return (
      <main className="flex-1 py-16 px-4 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Todo List Not Found</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This todo list could not be retrieved from your cloud database. You may need to sign in with the account that created it.
          </p>
          <Link
            href="/"
            className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-8 px-4 sm:px-6">
      <TodoView
        data={todo}
        prompt={todo.prompt}
        onBack={() => router.push("/")}
      />
    </main>
  );
}
