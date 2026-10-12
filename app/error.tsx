'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { WarningCircle } from '@phosphor-icons/react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
          <WarningCircle size={24} weight="duotone" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Ada yang tidak beres
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          Halaman gagal dimuat. Periksa koneksimu lalu coba lagi. Jika masih bermasalah, muat ulang beranda.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button onClick={reset}>Coba lagi</Button>
          <Button variant="secondary" onClick={() => router.push('/')}>
            Ke beranda
          </Button>
        </div>
      </div>
    </div>
  )
}
