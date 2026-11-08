export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-2/3 rounded-lg bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-100" />
      </div>

      {/* Progress bar skeleton */}
      <div className="h-2 w-full rounded-full bg-gray-100" />

      {/* Phase/Category skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3 rounded-xl border border-gray-100 p-5">
          <div className="h-5 w-1/3 rounded bg-gray-200" />
          <div className="h-3 w-2/3 rounded bg-gray-100" />
          <div className="space-y-2 pl-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-gray-200" />
                <div className="h-3 flex-1 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

