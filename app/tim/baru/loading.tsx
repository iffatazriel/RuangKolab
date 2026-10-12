export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Memuat form">
      {/* Skeleton header */}
      <div className="h-8 w-64 skeleton animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-2 h-4 w-96 max-w-full skeleton animate-pulse rounded bg-slate-100" />

      {/* Skeleton kartu form */}
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-6">
          <div>
            <div className="h-4 w-32 skeleton animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-12 w-full skeleton animate-pulse rounded-lg bg-slate-100" />
            <div className="mt-1.5 h-3 w-56 skeleton animate-pulse rounded bg-slate-100" />
          </div>
          <div>
            <div className="h-4 w-28 skeleton animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-12 w-full skeleton animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div>
            <div className="h-4 w-24 skeleton animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-32 w-full skeleton animate-pulse rounded-lg bg-slate-100" />
            <div className="mt-1.5 h-3 w-24 skeleton animate-pulse rounded bg-slate-100" />
          </div>
          <div>
            <div className="h-4 w-36 skeleton animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-12 w-28 skeleton animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div>
            <div className="h-4 w-44 skeleton animate-pulse rounded bg-slate-200" />
            <div className="mt-3 flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-10 w-24 skeleton animate-pulse rounded-full bg-slate-100" />
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-5">
            <div className="h-12 w-48 skeleton animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
