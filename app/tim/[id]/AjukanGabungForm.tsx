'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { friendlyError } from '@/lib/errors'

interface Props {
  postId: string
  existingStatus: string | null
  requestId: string | null
}

export function AjukanGabungForm({ postId, existingStatus, requestId }: Props) {
  const router = useRouter()
  const [pesan, setPesan] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Belum masuk.'); setLoading(false); return }

    const { error: dbError } = await supabase.from('join_requests').insert({
      post_id: postId,
      user_id: user.id,
      pesan: pesan.trim() || null,
    })
    setLoading(false)
    if (dbError) { setError(friendlyError(dbError)); return }
    router.refresh()
  }

  async function cancel() {
    if (!requestId) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: cancelError } = await supabase
      .from('join_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)
      .eq('status', 'pending')
    setLoading(false)
    if (cancelError) { setError(friendlyError(cancelError)); return }
    router.refresh()
  }

  if (existingStatus === 'pending') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            Pengajuan sedang diproses...
          </span>
          <Button variant="ghost" size="sm" loading={loading} onClick={cancel}>Batalkan</Button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  if (existingStatus === 'accepted') {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
        Pengajuanmu diterima! Lihat kontak di atas.
      </span>
    )
  }

  if (existingStatus === 'rejected') {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
        Pengajuanmu ditolak.
      </span>
    )
  }

  if (existingStatus === 'cancelled') {
    return (
      <span className="text-sm text-gray-500">Pengajuanmu telah dibatalkan.</span>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <h3 className="font-semibold text-gray-900">Ajukan Bergabung</h3>
      <textarea
        value={pesan}
        onChange={(e) => setPesan(e.target.value)}
        placeholder="Perkenalkan dirimu dan alasan ingin bergabung (opsional)..."
        rows={3}
        className="rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" loading={loading}>Ajukan Bergabung</Button>
    </form>
  )
}
