'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface NotificationItem {
  id: string
  tipe: string
  payload: { post_id?: string; competition_id?: string; judul?: string }
  link: string | null
  dibaca: boolean
  created_at: string
}

const LABEL: Record<string, string> = {
  pengajuan_baru: 'Ada pengajuan gabung baru',
  pengajuan_diterima: 'Pengajuanmu diterima',
  pengajuan_ditolak: 'Pengajuanmu ditolak',
  usulan_lomba_baru: 'Ada usulan lomba baru',
  usulan_lomba_diterima: 'Usulan lombamu diterbitkan',
  usulan_lomba_ditolak: 'Usulan lombamu tidak diterbitkan',
}

// Fallback bila link kosong (notifikasi lama sebelum migrasi 007)
function fallbackLink(n: NotificationItem): string {
  if (n.tipe.startsWith('usulan_lomba_baru')) return '/moderasi'
  if (n.payload?.competition_id) return `/lomba/${n.payload.competition_id}`
  if (n.payload?.post_id) return '/dashboard#pengajuan'
  return '/dashboard'
}

export function NotificationList({ items }: { items: NotificationItem[] }) {
  const router = useRouter()
  const [marking, setMarking] = useState(false)
  const unread = items.filter((n) => !n.dibaca).map((n) => n.id)

  async function markRead(ids: string[]) {
    if (ids.length === 0) return
    const supabase = createClient()
    await supabase.from('notifications').update({ dibaca: true }).in('id', ids)
  }

  async function markAllRead() {
    setMarking(true)
    await markRead(unread)
    setMarking(false)
    router.refresh()
  }

  async function open(n: NotificationItem) {
    if (!n.dibaca) await markRead([n.id])
    router.push(n.link ?? fallbackLink(n))
    router.refresh()
  }

  if (items.length === 0) {
    return <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">Belum ada notifikasi.</p>
  }

  return (
    <div className="mt-4">
      {unread.length > 0 && (
        <button
          type="button"
          onClick={markAllRead}
          disabled={marking}
          className="mb-3 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50"
        >
          Tandai semua sudah dibaca ({unread.length})
        </button>
      )}
      <ul className="flex flex-col gap-2">
        {items.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => open(n)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left text-sm transition hover:shadow-sm ${
                n.dibaca ? 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900' : 'border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/60'
              }`}
            >
              <div className="min-w-0">
                <p className={`font-medium ${n.dibaca ? 'text-stone-700 dark:text-stone-300' : 'text-stone-900 dark:text-stone-100'}`}>
                  {LABEL[n.tipe] ?? n.tipe}
                </p>
                {n.payload?.judul && <p className="truncate text-xs text-stone-500 dark:text-stone-400">{n.payload.judul}</p>}
                <p className="text-[11px] text-stone-400">{new Date(n.created_at).toLocaleString('id-ID')}</p>
              </div>
              {!n.dibaca && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-label="Belum dibaca" />}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-stone-400">
        <Link href="/dashboard" className="hover:underline">Muat ulang</Link> untuk melihat notifikasi terbaru.
      </p>
    </div>
  )
}
