"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { TodoView } from "@/components/todo-view";
import { useTodo } from "@/hooks/use-local-storage";

interface TodoDetailClientProps {
  id: string;
}

export function TodoDetailClient({ id }: TodoDetailClientProps) {
  const router = useRouter();
  const todo = useTodo(id);

  if (!todo) {
    return (
      <main className="flex-1 py-16 px-4 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-lg font-bold text-gray-900">Todo List Not Found</h1>
          <p className="mt-1 text-sm text-gray-500">
            This todo list could not be found in your local storage. It may have been deleted.
          </p>
          <Link
            href="/"
            className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
