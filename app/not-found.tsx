import Link from 'next/link'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] w-full max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <div aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
        <MagnifyingGlass size={48} weight="duotone" aria-hidden="true" />
      </div>
      <p className="mt-6 font-mono text-sm font-semibold tabular-nums text-stone-500 dark:text-stone-400">404</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        Tautan yang kamu buka sudah tidak ada atau lombanya telah dihapus. Coba kembali ke beranda atau cari lomba lain.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]"
        >
          Ke beranda
        </Link>
        <Link
          href="/lomba"
          className="inline-flex min-h-[44px] items-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
        >
          Cari lomba
        </Link>
      </div>
    </div>
  )
}
