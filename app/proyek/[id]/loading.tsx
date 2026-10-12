export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Memuat postingan">
      {/* Skeleton breadcrumb */}
      <div className="mb-4 h-4 w-64 skeleton animate-pulse rounded bg-slate-100" />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Skeleton artikel utama */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex gap-2">
              <div className="h-6 w-24 skeleton animate-pulse rounded-full bg-slate-100" />
              <div className="h-6 w-32 skeleton animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="mt-4 h-8 w-3/4 skeleton animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-6 h-4 w-40 skeleton animate-pulse rounded bg-slate-100" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full skeleton animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-11/12 skeleton animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-4/6 skeleton animate-pulse rounded bg-slate-100" />
            </div>
            <div className="mt-6 flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-6 w-20 skeleton animate-pulse rounded-full bg-slate-100" />
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
              <div>
                <div className="h-3 w-16 skeleton animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-4 w-28 skeleton animate-pulse rounded bg-slate-200" />
              </div>
              <div>
                <div className="h-3 w-20 skeleton animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-4 w-24 skeleton animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton sidebar aksi */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 skeleton animate-pulse rounded-xl bg-slate-200" />
              <div className="flex-1">
                <div className="h-4 w-40 skeleton animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-full skeleton animate-pulse rounded bg-slate-100" />
                <div className="mt-1.5 h-3 w-4/5 skeleton animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="h-5 w-36 skeleton animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-24 w-full skeleton animate-pulse rounded-lg bg-slate-100" />
            <div className="mt-4 h-11 w-full skeleton animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
