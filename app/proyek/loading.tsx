export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Memuat daftar proyek">
      <div className="skeleton h-8 w-56 rounded-lg bg-stone-200 dark:bg-stone-800" />
      <div className="skeleton mt-2 h-4 w-80 max-w-full rounded bg-stone-100 dark:bg-stone-800" />
      <div className="mt-6 flex flex-wrap gap-2.5">
        <div className="skeleton h-11 min-w-[220px] flex-1 rounded-[10px] bg-stone-100 dark:bg-stone-800" />
        <div className="skeleton h-11 w-36 rounded-[10px] bg-stone-100 dark:bg-stone-800" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <div className="skeleton h-5 w-3/4 rounded bg-stone-200 dark:bg-stone-800" />
            <div className="skeleton mt-3 h-3 w-full rounded bg-stone-100 dark:bg-stone-800" />
            <div className="skeleton mt-4 h-3 w-28 rounded bg-stone-100 dark:bg-stone-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
