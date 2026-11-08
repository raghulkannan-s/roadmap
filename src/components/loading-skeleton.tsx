export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-2/3 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-5/6 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
      </div>

      <div className="h-2 w-full rounded-full bg-slate-200/80 dark:bg-slate-800" />

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="space-y-3 rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60"
        >
          <div className="h-5 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800/60" />
          <div className="space-y-2 pt-2">
            {[1, 2].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 flex-1 rounded bg-slate-100 dark:bg-slate-800/60" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
