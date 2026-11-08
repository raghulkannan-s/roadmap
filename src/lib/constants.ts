export const STORAGE_KEYS = {
  ROADMAPS: "roadmap_items",
  TODOS: "todo_items",
} as const;

export const MAX_PROMPT_LENGTH = 500;

export const PRIORITY_COLORS = {
  high: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60",
  medium: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60",
} as const;

export const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;
