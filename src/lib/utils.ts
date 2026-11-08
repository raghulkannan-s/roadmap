export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateProgress(
  items: { isCompleted: boolean }[]
): number {
  if (items.length === 0) return 0;
  const completed = items.filter((item) => item.isCompleted).length;
  return Math.round((completed / items.length) * 100);
}

