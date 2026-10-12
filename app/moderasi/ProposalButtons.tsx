'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { friendlyError } from '@/lib/errors'
import { useToast } from '@/components/ui/Toast'

export function ProposalButtons({ competitionId }: { competitionId: string }) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState<'published' | 'draft' | null>(null)
  const [error, setError] = useState('')

  async function decide(status: 'published' | 'draft') {
    setLoading(status)
    setError('')
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('competitions')
      .update({ publish_status: status })
      .eq('id', competitionId)
    setLoading(null)
    if (dbError) {
      setError(friendlyError(dbError))
      toast.push(friendlyError(dbError), 'error')
      return
    }
    toast.push(status === 'published' ? 'Usulan diterbitkan. Pengusul sudah diberi tahu.' : 'Usulan tidak diterbitkan.')
    router.refresh()
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button size="sm" variant="primary" loading={loading === 'published'} onClick={() => decide('published')}>
          Terbitkan
        </Button>
        <Button size="sm" variant="secondary" loading={loading === 'draft'} onClick={() => decide('draft')}>
          Tolak
        </Button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
