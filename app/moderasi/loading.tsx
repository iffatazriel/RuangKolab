export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Memuat panel moderasi">
      <div className="skeleton h-8 w-48 rounded-lg bg-stone-200 dark:bg-stone-800" />
      <div className="skeleton mt-2 h-4 w-72 rounded bg-stone-100 dark:bg-stone-800" />
      <div className="mt-8 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <div className="skeleton h-5 w-3/4 rounded bg-stone-200 dark:bg-stone-800" />
            <div className="skeleton mt-3 h-3 w-full rounded bg-stone-100 dark:bg-stone-800" />
            <div className="mt-4 flex gap-2">
              <div className="skeleton h-10 w-28 rounded-full bg-stone-100 dark:bg-stone-800" />
              <div className="skeleton h-10 w-28 rounded-full bg-stone-100 dark:bg-stone-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
