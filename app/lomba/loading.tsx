export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Memuat daftar lomba">
      {/* Skeleton header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="skeleton h-8 w-56 rounded-lg bg-stone-200" />
          <div className="skeleton mt-2 h-4 w-80 max-w-full rounded bg-stone-100 dark:bg-stone-800" />
        </div>
        <div className="skeleton h-10 w-32 rounded-[10px] bg-stone-100 dark:bg-stone-800" />
      </div>

      {/* Skeleton filter sticky */}
      <div className="sticky mt-6 border-b border-stone-100 dark:border-stone-800 pb-3" style={{ top: 'var(--nav-h)' }}>
        <div className="flex flex-wrap gap-2.5">
          <div className="skeleton h-11 min-w-[220px] flex-1 rounded-[10px] bg-stone-100 dark:bg-stone-800" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-11 w-36 rounded-[10px] bg-stone-100 dark:bg-stone-800" />
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <div className="skeleton h-4 w-24 rounded bg-stone-100 dark:bg-stone-800" />
          <div className="skeleton h-7 w-20 rounded-full bg-stone-100 dark:bg-stone-800" />
          <div className="skeleton h-7 w-16 rounded-full bg-stone-100 dark:bg-stone-800" />
        </div>
      </div>

      {/* Skeleton grid kartu: poster 4:3, baris tag, dua baris judul, footer */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 bg-[var(--card-bg)] shadow-sm">
            <div className="skeleton aspect-[4/3] bg-stone-200" />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="skeleton h-6 w-20 rounded-lg bg-stone-100 dark:bg-stone-800" />
                <div className="skeleton h-4 w-16 rounded bg-stone-100 dark:bg-stone-800" />
              </div>
              <div className="skeleton mt-3 h-5 w-full rounded bg-stone-200" />
              <div className="skeleton mt-2 h-5 w-3/4 rounded bg-stone-200" />
              <div className="skeleton mt-2 h-4 w-1/2 rounded bg-stone-100 dark:bg-stone-800" />
              <div className="mt-5 border-t border-stone-100 dark:border-stone-800 pt-3">
                <div className="skeleton h-4 w-40 rounded bg-stone-100 dark:bg-stone-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
