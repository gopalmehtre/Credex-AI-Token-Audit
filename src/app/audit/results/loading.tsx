// src/app/audit/results/loading.tsx
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-ink-900 border border-ink-800 rounded-2xl p-8">
        <div className="h-4 w-32 bg-ink-800 rounded-full mb-5" />
        <div className="h-14 w-48 bg-ink-800 rounded-lg mb-3" />
        <div className="h-6 w-36 bg-ink-800 rounded-lg mb-8" />
        <div className="flex gap-3">
          <div className="h-10 w-36 bg-ink-800 rounded-lg" />
          <div className="h-10 w-32 bg-ink-800 rounded-lg" />
        </div>
      </div>

      {/* AI summary skeleton */}
      <div className="bg-ink-900 border border-ink-800 rounded-xl p-6 space-y-3">
        <div className="h-3 w-24 bg-ink-800 rounded-full" />
        <div className="h-4 w-full bg-ink-800 rounded-full" />
        <div className="h-4 w-5/6 bg-ink-800 rounded-full" />
        <div className="h-4 w-4/6 bg-ink-800 rounded-full" />
      </div>

      {/* Cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-ink-900 border border-ink-800 rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-3 flex-1">
              <div className="flex gap-3">
                <div className="h-5 w-24 bg-ink-800 rounded-full" />
                <div className="h-5 w-32 bg-ink-800 rounded-full" />
              </div>
              <div className="h-4 w-full bg-ink-800 rounded-full" />
              <div className="h-4 w-3/4 bg-ink-800 rounded-full" />
            </div>
            <div className="ml-4 h-20 w-32 bg-ink-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
