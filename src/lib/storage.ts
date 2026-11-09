import { STORAGE_KEYS } from "./constants";

import type { TodoList } from "./types";

const STORAGE_EVENT = "todo_storage_change";

let lastTodosRaw: string | null = null;
let lastTodosParsed: TodoList[] = [];

function dispatchStorageChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }
}

export function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(STORAGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(STORAGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// ===== TODOS =====

export function getTodos(): TodoList[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TODOS);
    if (raw === lastTodosRaw) return lastTodosParsed;
    lastTodosRaw = raw;
    lastTodosParsed = raw ? (JSON.parse(raw) as TodoList[]) : [];
    return lastTodosParsed;
  } catch (error) {
    console.error("[Storage] Failed to read todos:", error);
    return [];
  }
}

export function saveTodo(todo: TodoList): void {
  const items = getTodos();
  const updated = [todo, ...items];
  try {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(updated));
    dispatchStorageChange();
  } catch (error) {
    console.error("[Storage] Failed to save todo:", error);
  }
}

export function getTodoById(id: string): TodoList | null {
  const items = getTodos();
  return items.find((item) => item.id === id) ?? null;
}

export function updateTodo(id: string, updates: Partial<TodoList>): void {
  const items = getTodos();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) return;

  const updated = [...items];
  updated[index] = { ...updated[index], ...updates };

  try {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(updated));
    dispatchStorageChange();
  } catch (error) {
    console.error("[Storage] Failed to update todo:", error);
  }
}

export function deleteTodo(id: string): void {
  const items = getTodos().filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(items));
    dispatchStorageChange();
  } catch (error) {
    console.error("[Storage] Failed to delete todo:", error);
  }
}
