'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const KATEGORI = ['Ilmiah', 'Teknologi', 'Bisnis', 'Desain', 'Seni & Budaya', 'Olahraga', 'Lainnya']
const TINGKAT = ['Nasional', 'Regional', 'Internasional', 'Internal Kampus']

export function LombaFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const set = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.push(`/lomba?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-[240px] flex-1">
        <input
          type="search"
          placeholder="Cari nama lomba atau topik..."
          defaultValue={searchParams.get('q') ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') set('q', (e.target as HTMLInputElement).value)
          }}
          onBlur={(e) => set('q', e.target.value)}
          className="custom-input w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      <select
        value={searchParams.get('kategori') ?? ''}
        onChange={(e) => set('kategori', e.target.value)}
        className="custom-input rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none"
      >
        <option value="">Semua Kategori</option>
        {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
      </select>
      <select
        value={searchParams.get('tingkat') ?? ''}
        onChange={(e) => set('tingkat', e.target.value)}
        className="custom-input rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none"
      >
        <option value="">Semua Tingkat</option>
        {TINGKAT.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <select
        value={searchParams.get('deadline') ?? ''}
        onChange={(e) => set('deadline', e.target.value)}
        className="custom-input rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none"
      >
        <option value="">Semua Deadline</option>
        <option value="7">7 hari ke depan</option>
        <option value="30">30 hari ke depan</option>
      </select>
      <select
        value={searchParams.get('biaya') ?? ''}
        onChange={(e) => set('biaya', e.target.value)}
        className="custom-input rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none"
      >
        <option value="">Semua Biaya</option>
        <option value="gratis">Gratis</option>
        <option value="berbayar">Berbayar</option>
      </select>
    </div>
  )
}
