"use client";

import { useSyncExternalStore } from "react";

import {
  subscribeToStorage,
  getTodos,
  getTodoById,
} from "@/lib/storage";

import type { TodoList } from "@/lib/types";

const EMPTY_TODOS: TodoList[] = [];

export function useTodos(): TodoList[] {
  return useSyncExternalStore(
    subscribeToStorage,
    getTodos,
    () => EMPTY_TODOS
  );
}

export function useTodo(id: string): TodoList | null {
  return useSyncExternalStore(
    subscribeToStorage,
    () => getTodoById(id),
    () => null
  );
}
