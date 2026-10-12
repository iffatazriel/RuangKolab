'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { MagnifyingGlass, SlidersHorizontal, X } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE_OUT, SPRING } from '@/lib/motion'

const KATEGORI = ['Ilmiah', 'Teknologi', 'Bisnis', 'Desain', 'Seni & Budaya', 'Olahraga', 'Lainnya']
const TINGKAT = ['Nasional', 'Regional', 'Internasional', 'Internal Kampus']

const selectClass =
  'custom-input min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none'

function Fields({ searchParams, set }: { searchParams: URLSearchParams; set: (k: string, v: string) => void }) {
  return (
    <>
      <div className="relative min-w-[240px] flex-1">
        <MagnifyingGlass size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          aria-label="Cari lomba"
          placeholder="Cari nama lomba atau topik..."
          defaultValue={searchParams.get('q') ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') set('q', (e.target as HTMLInputElement).value)
          }}
          onBlur={(e) => set('q', e.target.value)}
          className="custom-input min-h-[44px] w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      <select aria-label="Filter kategori" value={searchParams.get('kategori') ?? ''} onChange={(e) => set('kategori', e.target.value)} className={selectClass}>
        <option value="">Semua Kategori</option>
        {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
      </select>
      <select aria-label="Filter tingkat" value={searchParams.get('tingkat') ?? ''} onChange={(e) => set('tingkat', e.target.value)} className={selectClass}>
        <option value="">Semua Tingkat</option>
        {TINGKAT.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <select aria-label="Filter rentang deadline" value={searchParams.get('deadline') ?? ''} onChange={(e) => set('deadline', e.target.value)} className={selectClass}>
        <option value="">Semua Deadline</option>
        <option value="7">7 hari ke depan</option>
        <option value="30">30 hari ke depan</option>
      </select>
      <select aria-label="Filter biaya" value={searchParams.get('biaya') ?? ''} onChange={(e) => set('biaya', e.target.value)} className={selectClass}>
        <option value="">Semua Biaya</option>
        <option value="gratis">Gratis</option>
        <option value="berbayar">Berbayar</option>
      </select>
    </>
  )
}

export function LombaFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)

  const set = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.push(`/lomba?${params.toString()}`)
    },
    [router, searchParams]
  )

  const keys = ['kategori', 'tingkat', 'deadline', 'biaya']
  const activeCount = keys.filter((k) => searchParams.get(k)).length + (searchParams.get('q') ? 1 : 0)

  return (
    <>
      {/* Desktop: baris inline */}
      <div className="hidden flex-wrap items-center gap-2.5 md:flex">
        <Fields searchParams={searchParams} set={set} />
      </div>

      {/* Mobile: tombol pemicu bottom sheet */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[44px] w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] md:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={18} />
          Filter dan pencarian
        </span>
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Tutup filter"
              className="fixed inset-0 z-[80] bg-slate-900/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filter lomba"
              className="fixed inset-x-0 bottom-0 z-[90] rounded-t-2xl bg-white p-5 pb-8 shadow-2xl md:hidden"
              initial={reduce ? { y: '100%' } : { y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: reduce ? 0 : 0.35, ease: EASE_OUT }}
              drag={reduce ? false : 'y'}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => { if (info.offset.y > 90) setOpen(false) }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" aria-hidden="true" />
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Filter dan pencarian</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup"
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 active:scale-[0.98]"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>
              <div className="flex flex-col gap-3" onClick={() => setOpen(false)}>
                <Fields searchParams={searchParams} set={set} />
              </div>
              <motion.button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-5 min-h-[48px] w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]"
                whileTap={reduce ? undefined : { scale: 0.98 }}
                transition={SPRING}
              >
                Terapkan
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
