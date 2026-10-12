export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Memuat profil">
      <div className="skeleton h-8 w-40 rounded-lg bg-stone-200 dark:bg-stone-800" />
      <div className="skeleton mt-2 h-4 w-64 rounded bg-stone-100 dark:bg-stone-800" />
      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center gap-4">
          <div className="skeleton h-14 w-14 shrink-0 rounded-full bg-stone-200 dark:bg-stone-800" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-1/2 rounded bg-stone-200 dark:bg-stone-800" />
            <div className="skeleton h-3 w-2/3 rounded bg-stone-100 dark:bg-stone-800" />
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="skeleton h-3 w-24 rounded bg-stone-100 dark:bg-stone-800" />
              <div className="skeleton mt-2 h-11 w-full rounded-[10px] bg-stone-100 dark:bg-stone-800" />
            </div>
          ))}
          <div className="skeleton h-12 w-40 rounded-full bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>
    </div>
  )
}
