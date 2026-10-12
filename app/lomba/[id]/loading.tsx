export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Memuat detail lomba">
      <div className="skeleton mb-4 h-4 w-32 rounded bg-stone-200 dark:bg-stone-800" />
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
            <div className="skeleton aspect-[4/3] bg-stone-200 dark:bg-stone-800" />
            <div className="grid grid-cols-2 divide-x divide-stone-100 dark:divide-stone-800">
              <div className="space-y-2 p-4">
                <div className="skeleton h-3 w-16 rounded bg-stone-100 dark:bg-stone-800" />
                <div className="skeleton h-6 w-24 rounded bg-stone-200 dark:bg-stone-800" />
              </div>
              <div className="space-y-2 p-4">
                <div className="skeleton h-3 w-16 rounded bg-stone-100 dark:bg-stone-800" />
                <div className="skeleton h-6 w-20 rounded bg-stone-200 dark:bg-stone-800" />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="skeleton h-8 w-3/4 rounded-lg bg-stone-200 dark:bg-stone-800" />
          <div className="skeleton mt-3 h-4 w-1/2 rounded bg-stone-100 dark:bg-stone-800" />
          <div className="mt-6 space-y-2">
            <div className="skeleton h-3 w-full rounded bg-stone-100 dark:bg-stone-800" />
            <div className="skeleton h-3 w-11/12 rounded bg-stone-100 dark:bg-stone-800" />
            <div className="skeleton h-3 w-4/6 rounded bg-stone-100 dark:bg-stone-800" />
          </div>
          <div className="mt-8 flex gap-3">
            <div className="skeleton h-12 w-44 rounded-full bg-stone-200 dark:bg-stone-800" />
            <div className="skeleton h-12 w-36 rounded-full bg-stone-100 dark:bg-stone-800" />
          </div>
        </div>
      </div>
    </div>
  )
}
