"use client";

import { AlertCircle, X } from "lucide-react";

interface GenerationErrorToastProps {
  message: string;
  onClose: () => void;
}

export function GenerationErrorToast({
  message,
  onClose,
}: GenerationErrorToastProps) {
  return (
    <div
      role="alert"
      className="fixed right-4 top-4 z-50 flex w-[min(calc(100vw-2rem),32rem)] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 shadow-lg dark:border-rose-900/70 dark:bg-rose-950/90 dark:text-rose-100"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-300" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">Generation failed</p>
        <p className="mt-1 break-words text-sm text-rose-800 dark:text-rose-200">
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close error notification"
        className="shrink-0 rounded-md p-1 text-rose-600 transition-colors hover:bg-rose-100 dark:text-rose-300 dark:hover:bg-rose-900/60"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
