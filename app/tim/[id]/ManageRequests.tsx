'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { friendlyError } from '@/lib/errors'
import { Avatar } from '@/components/ui/Avatar'
import type { PostStatus } from '@/lib/types'

interface Request {
  id: string
  user_id: string
  status: string
  pesan: string | null
  nama: string
  jurusan: string
  whatsapp?: string
}

interface Props {
  postId: string
  requests: Request[]
  postStatus: PostStatus
}

export function ManageRequests({ postId, requests, postStatus }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function updateRequest(requestId: string, status: 'accepted' | 'rejected') {
    setLoadingId(requestId)
    setError('')
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('join_requests')
      .update({ status })
      .eq('id', requestId)
      .eq('status', 'pending')
    setLoadingId(null)
    if (dbError) {
      setError(friendlyError(dbError))
      return
    }
    router.refresh()
  }

  async function closePost() {
    setLoadingId('close')
    setError('')
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('team_posts')
      .update({ status: 'closed' })
      .eq('id', postId)
    setLoadingId(null)
    if (dbError) {
      setError(friendlyError(dbError))
      return
    }
    router.refresh()
  }

  const pending = requests.filter((r) => r.status === 'pending')
  const accepted = requests.filter((r) => r.status === 'accepted')

  return (
    <div className="mt-4 flex flex-col gap-6">
      {postStatus === 'open' && (
        <Button variant="danger" size="sm" loading={loadingId === 'close'} onClick={closePost} className="self-start">
          Tutup Postingan
        </Button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300">Pengajuan Pending ({pending.length})</h3>
          <div className="mt-3 flex flex-col gap-3">
            {pending.map((r) => (
              <div key={r.id} className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar nama={r.nama} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-stone-900 dark:text-stone-100">{r.nama}</p>
                      {r.jurusan && <p className="truncate text-xs text-stone-500 dark:text-stone-400">{r.jurusan}</p>}
                      {r.pesan && <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">&ldquo;{r.pesan}&rdquo;</p>}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      loading={loadingId === r.id}
                      onClick={() => updateRequest(r.id, 'accepted')}
                    >
                      Terima
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      loading={loadingId === r.id}
                      onClick={() => updateRequest(r.id, 'rejected')}
                    >
                      Tolak
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {accepted.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300">Anggota Diterima ({accepted.length})</h3>
          <div className="mt-3 flex flex-col gap-2">
            {accepted.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-sm dark:bg-emerald-950">
                <Avatar nama={r.nama} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-stone-900 dark:text-stone-100">{r.nama}</p>
                  {r.whatsapp && (
                    <a
                      href={`https://wa.me/${r.whatsapp.replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 underline dark:text-emerald-400"
                    >
                      WhatsApp: {r.whatsapp}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && accepted.length === 0 && (
        <p className="text-sm text-stone-500 dark:text-stone-400">Belum ada pengajuan masuk.</p>
      )}
    </div>
  )
}
