'use client'

import { useEffect } from 'react'
import { WarningCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="id">
      <body className="flex min-h-[100dvh] items-center justify-center bg-stone-50 px-4 dark:bg-stone-950">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div aria-hidden="true" className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <WarningCircle size={48} weight="duotone" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Terjadi kesalahan
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            Aplikasi gagal dimuat. Coba muat ulang halaman ini.
          </p>
          <div className="mt-6">
            <Button size="lg" onClick={() => reset()}>
              Muat ulang
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
