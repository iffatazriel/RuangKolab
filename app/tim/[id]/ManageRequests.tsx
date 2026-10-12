'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { friendlyError } from '@/lib/errors'
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
          <h3 className="text-sm font-semibold text-slate-700">Pengajuan Pending ({pending.length})</h3>
          <div className="mt-3 flex flex-col gap-3">
            {pending.map((r) => (
              <div key={r.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{r.nama}</p>
                    {r.jurusan && <p className="text-xs text-slate-500">{r.jurusan}</p>}
                    {r.pesan && <p className="mt-1 text-sm text-slate-700">&ldquo;{r.pesan}&rdquo;</p>}
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
          <h3 className="text-sm font-semibold text-slate-700">Anggota Diterima ({accepted.length})</h3>
          <div className="mt-3 flex flex-col gap-2">
            {accepted.map((r) => (
              <div key={r.id} className="rounded-lg bg-green-50 p-3 text-sm">
                <p className="font-medium text-slate-900">{r.nama}</p>
                {r.whatsapp && (
                  <a
                    href={`https://wa.me/${r.whatsapp.replace(/^0/, '62')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 underline"
                  >
                    WhatsApp: {r.whatsapp}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && accepted.length === 0 && (
        <p className="text-sm text-slate-500">Belum ada pengajuan masuk.</p>
      )}
    </div>
  )
}
