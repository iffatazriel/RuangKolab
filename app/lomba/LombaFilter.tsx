'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { MagnifyingGlass, SlidersHorizontal, X, ArrowDown } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/lib/motion'

const KATEGORI = ['Ilmiah', 'Teknologi', 'Bisnis', 'Desain', 'Seni & Budaya', 'Olahraga', 'Lainnya']
const TINGKAT = ['Nasional', 'Regional', 'Internasional', 'Internal Kampus']

export type SortKey = 'deadline' | 'terbaru'

interface Props {
  resultCount: number
}

/** Label manusiawi untuk chip filter aktif. */
function chipLabel(key: string, value: string): string {
  switch (key) {
    case 'q': return `"${value}"`
    case 'kategori': return value
    case 'tingkat': return value
    case 'deadline': return value === '7' ? '7 hari ke depan' : '30 hari ke depan'
    case 'biaya': return value === 'gratis' ? 'Gratis' : 'Berbayar'
    default: return value
  }
}

const selectClass =
  'custom-input min-h-[44px] rounded-[10px] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

export function LombaFilter({ resultCount }: Props) {
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

  const removeChip = useCallback(
    (key: string) => set(key, ''),
    [set]
  )

  const chipKeys = ['q', 'kategori', 'tingkat', 'deadline', 'biaya']
  const activeChips = chipKeys
    .filter((k) => searchParams.get(k))
    .map((k) => ({ key: k, value: searchParams.get(k)! }))

  const sortKey: SortKey = searchParams.get('urut') === 'terbaru' ? 'terbaru' : 'deadline'
  const activeCount = activeChips.length

  return (
    <>
      {/* Bar sticky: top mengikuti tinggi navbar (var --nav-h), z di bawah navbar */}
      <div className="sticky z-[45] -mx-4 border-b border-slate-100 bg-[var(--background)]/95 px-4 pb-3 pt-3 backdrop-blur-md dark:border-slate-800 sm:-mx-6 sm:px-6" style={{ top: 'var(--nav-h)' }}>
        <div className="hidden flex-wrap items-center gap-2.5 md:flex">
          <div className="relative min-w-[220px] flex-1">
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
              className="custom-input min-h-[44px] w-full rounded-[10px] border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
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
          <select
            aria-label="Urutkan"
            value={sortKey}
            onChange={(e) => set('urut', e.target.value === 'deadline' ? '' : e.target.value)}
            className={selectClass}
          >
            <option value="deadline">Deadline terdekat</option>
            <option value="terbaru">Terbaru</option>
          </select>
        </div>

        {/* Baris ringkasan: jumlah hasil + chip aktif */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-medium tabular-nums text-slate-600 dark:text-slate-400" aria-live="polite">
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{resultCount}</span> lomba aktif
          </p>
          {activeChips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => removeChip(c.key)}
              className="inline-flex min-h-[32px] items-center gap-1 rounded-full bg-indigo-50 pl-3 pr-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 active:scale-[0.98] dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
            >
              {chipLabel(c.key, c.value)}
              <X size={12} weight="bold" aria-hidden="true" />
              <span className="sr-only">Hapus filter {chipLabel(c.key, c.value)}</span>
            </button>
          ))}
          {sortKey === 'terbaru' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <ArrowDown size={12} weight="bold" /> terbaru dulu
            </span>
          )}
        </div>

        {/* Pemicu bottom sheet di HP */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 inline-flex min-h-[44px] w-full items-center justify-between rounded-[10px] border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 md:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={18} />
            Filter dan urutan
          </span>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Bottom sheet (HP): muncul dari bawah, tarik turun untuk menutup */}
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
              className="fixed inset-x-0 bottom-0 z-[90] rounded-t-2xl bg-white p-5 pb-8 shadow-2xl dark:bg-slate-900 md:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: reduce ? 0 : 0.35, ease: EASE_OUT }}
              drag={reduce ? false : 'y'}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => { if (info.offset.y > 90) setOpen(false) }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Filter dan urutan</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup"
                  className="flex h-11 w-11 items-center justify-center rounded-[10px] text-slate-500 transition hover:bg-slate-100 active:scale-[0.98] dark:hover:bg-slate-800"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>
              <div className="flex flex-col gap-3" onClick={() => setOpen(false)}>
                <div className="relative">
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
                    className="custom-input min-h-[44px] w-full rounded-[10px] border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
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
                <select aria-label="Urutkan" value={sortKey} onChange={(e) => set('urut', e.target.value === 'deadline' ? '' : e.target.value)} className={selectClass}>
                  <option value="deadline">Deadline terdekat</option>
                  <option value="terbaru">Terbaru</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-5 min-h-[48px] w-full rounded-[10px] bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]"
              >
                Terapkan
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
