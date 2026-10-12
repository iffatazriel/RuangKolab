export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Memuat daftar lomba">
      {/* Skeleton header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="h-8 w-56 skeleton animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-2 h-4 w-80 max-w-full skeleton animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-10 w-32 skeleton animate-pulse rounded-lg bg-slate-100" />
      </div>

      {/* Skeleton filter bar */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        <div className="h-11 min-w-[240px] flex-1 skeleton animate-pulse rounded-lg bg-slate-100" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-11 w-36 skeleton animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>

      {/* Skeleton grid kartu lomba: bentuk sama dengan kartu berfoto */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="aspect-[2/1] skeleton animate-pulse bg-slate-200" />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="h-6 w-20 skeleton animate-pulse rounded-full bg-slate-100" />
                <div className="h-3 w-16 skeleton animate-pulse rounded bg-slate-100" />
              </div>
              <div className="mt-3 h-5 w-full skeleton animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-5 w-3/4 skeleton animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/2 skeleton animate-pulse rounded bg-slate-100" />
              <div className="mt-5 border-t border-slate-100 pt-3">
                <div className="h-3 w-40 skeleton animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
