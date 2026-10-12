'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Skill } from '@/lib/types'

interface Props { allSkills: Skill[] }

export function ProyekFilter({ allSkills }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function set(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/proyek?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-[240px] flex-1">
        <input
          type="search"
          placeholder="Cari ide atau topik proyek..."
          defaultValue={searchParams.get('q') ?? ''}
          onKeyDown={(e) => { if (e.key === 'Enter') set('q', (e.target as HTMLInputElement).value) }}
          onBlur={(e) => set('q', e.target.value)}
          className="custom-input w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      <select
        value={searchParams.get('keahlian') ?? ''}
        onChange={(e) => set('keahlian', e.target.value)}
        className="custom-input rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none"
      >
        <option value="">Semua Keahlian</option>
        {allSkills.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
      </select>
    </div>
  )
}
