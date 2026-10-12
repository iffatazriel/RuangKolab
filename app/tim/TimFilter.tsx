'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Skill } from '@/lib/types'

interface Props { allSkills: Skill[] }

export function TimFilter({ allSkills }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function set(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/tim?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-[240px] flex-1">
        <input
          type="search"
          placeholder="Cari judul postingan atau peran..."
          defaultValue={searchParams.get('q') ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') set('q', (e.target as HTMLInputElement).value)
          }}
          onBlur={(e) => set('q', e.target.value)}
          className="custom-input w-full rounded-[10px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
        />
      </div>
      <select
        value={searchParams.get('keahlian') ?? ''}
        onChange={(e) => set('keahlian', e.target.value)}
        className="custom-input rounded-[10px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-700 dark:text-stone-300 focus:outline-none"
      >
        <option value="">Semua Keahlian</option>
        {allSkills.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
      </select>
    </div>
  )
}
