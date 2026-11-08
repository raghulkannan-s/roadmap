"use client";

import { useSyncExternalStore } from "react";

import {
  subscribeToStorage,
  getRoadmaps,
  getTodos,
  getRoadmapById,
  getTodoById,
} from "@/lib/storage";

import type { Roadmap, TodoList } from "@/lib/types";

const EMPTY_ROADMAPS: Roadmap[] = [];
const EMPTY_TODOS: TodoList[] = [];

export function useRoadmaps(): Roadmap[] {
  return useSyncExternalStore(
    subscribeToStorage,
    getRoadmaps,
    () => EMPTY_ROADMAPS
  );
}

export function useTodos(): TodoList[] {
  return useSyncExternalStore(
    subscribeToStorage,
    getTodos,
    () => EMPTY_TODOS
  );
}

export function useRoadmap(id: string): Roadmap | null {
  return useSyncExternalStore(
    subscribeToStorage,
    () => getRoadmapById(id),
    () => null
  );
}

export function useTodo(id: string): TodoList | null {
  return useSyncExternalStore(
    subscribeToStorage,
    () => getTodoById(id),
    () => null
  );
}
