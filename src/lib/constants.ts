export const STORAGE_KEYS = {
  ROADMAPS: "roadmap_items",
  TODOS: "todo_items",
} as const;

export const MAX_PROMPT_LENGTH = 500;

export const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
} as const;

export const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

