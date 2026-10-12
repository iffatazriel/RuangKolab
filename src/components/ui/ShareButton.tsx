'use client'

import { useState } from 'react'
import { Link as LinkIcon, Check } from '@phosphor-icons/react/dist/ssr'

/** Tombol salin tautan halaman ini, dengan umpan balik visual. */
export function ShareButton({ label = 'Salin tautan' }: { label?: string }) {
  const [done, setDone] = useState(false)

  async function copy() {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
    >
      {done ? <Check size={16} weight="bold" aria-hidden="true" /> : <LinkIcon size={16} aria-hidden="true" />}
      {done ? 'Tersalin!' : label}
    </button>
  )
}
