'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { friendlyError } from '@/lib/errors'
import { useToast } from '@/components/ui/Toast'

export function IncomingRequestButtons({ requestId }: { requestId: string }) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState<'accepted' | 'rejected' | null>(null)
  const [error, setError] = useState('')

  async function update(status: 'accepted' | 'rejected') {
    setLoading(status)
    setError('')
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('join_requests')
      .update({ status })
      .eq('id', requestId)
      .eq('status', 'pending')
    setLoading(null)
    if (dbError) {
      setError(friendlyError(dbError))
      toast.push(friendlyError(dbError), 'error')
      return
    }
    toast.push(status === 'accepted' ? 'Pengajuan diterima. Kontak anggota sudah terbuka.' : 'Pengajuan ditolak.')
    router.refresh()
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button size="sm" variant="primary" loading={loading === 'accepted'} onClick={() => update('accepted')}>
          Terima
        </Button>
        <Button size="sm" variant="danger" loading={loading === 'rejected'} onClick={() => update('rejected')}>
          Tolak
        </Button>
      </div>
      {error && <p className="max-w-[220px] text-right text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function CancelRequestButton({ requestId }: { requestId: string }) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function cancel() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('join_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)
      .eq('status', 'pending')
    setLoading(false)
    if (dbError) {
      setError(friendlyError(dbError))
      toast.push(friendlyError(dbError), 'error')
      return
    }
    toast.push('Pengajuan dibatalkan.')
    router.refresh()
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="ghost" size="sm" loading={loading} onClick={cancel}>
        Batalkan
      </Button>
      {error && <p className="max-w-[220px] text-right text-xs text-red-600">{error}</p>}
    </div>
  )
}
