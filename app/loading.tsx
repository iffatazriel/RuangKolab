export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Memuat">
      {/* Skeleton hero: bentuk sama dengan hero akhir */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-14 sm:px-6 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="h-10 w-4/5 skeleton animate-pulse rounded-lg bg-stone-200 sm:h-12" />
            <div className="mt-2 h-10 w-3/5 skeleton animate-pulse rounded-lg bg-stone-200 sm:h-12" />
            <div className="mt-5 h-4 w-full max-w-xl skeleton animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
            <div className="mt-2 h-4 w-2/3 max-w-md skeleton animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
            <div className="mt-8 flex gap-3">
              <div className="h-12 w-40 skeleton animate-pulse rounded-lg bg-stone-200" />
              <div className="h-12 w-36 skeleton animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900 p-4 shadow-sm">
              <div className="mb-4 aspect-[16/10] skeleton animate-pulse rounded-xl bg-stone-200" />
              <div className="px-2 pb-2">
                <div className="h-3 w-24 skeleton animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                <div className="mt-2.5 h-5 w-3/4 skeleton animate-pulse rounded bg-stone-200" />
                <div className="mt-2 h-3 w-1/2 skeleton animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skeleton strip statistik */}
      <div className="border-y border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 skeleton animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
              <div>
                <div className="h-5 w-10 skeleton animate-pulse rounded bg-stone-200" />
                <div className="mt-1 h-3 w-16 skeleton animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton grid lomba */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 h-7 w-52 skeleton animate-pulse rounded bg-stone-200" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900 shadow-sm">
              <div className="aspect-[2/1] skeleton animate-pulse bg-stone-200" />
              <div className="p-5">
                <div className="h-5 w-24 skeleton animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
                <div className="mt-3 h-5 w-full skeleton animate-pulse rounded bg-stone-200" />
                <div className="mt-2 h-3 w-2/3 skeleton animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
