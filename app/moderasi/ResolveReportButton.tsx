'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { friendlyError } from '@/lib/errors'

interface Props {
  reportId: string
  targetType: string
  targetId: string
}

export function ResolveReportButton({ reportId, targetType, targetId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'resolve' | 'delete' | null>(null)
  const [error, setError] = useState('')

  async function resolve(deleteContent: boolean) {
    setLoading(deleteContent ? 'delete' : 'resolve')
    setError('')
    const supabase = createClient()

    const { error: reportErr } = await supabase
      .from('reports')
      .update({ status: 'resolved' })
      .eq('id', reportId)
    if (reportErr) {
      setLoading(null)
      setError(friendlyError(reportErr))
      return
    }

    if (deleteContent) {
      let contentErr: { message?: string; code?: string } | null = null
      if (targetType === 'post') {
        const res = await supabase.from('team_posts').delete().eq('id', targetId)
        contentErr = res.error
      } else if (targetType === 'competition') {
        const res = await supabase.from('competitions').update({ publish_status: 'draft' }).eq('id', targetId)
        contentErr = res.error
      }
      // Profil (targetType 'user') tidak dihapus di sini: akun hanya bisa
      // dihapus oleh pemiliknya. Laporan ditandai selesai saja.
      if (contentErr) {
        setLoading(null)
        setError(friendlyError(contentErr))
        return
      }
    }

    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" loading={loading === 'resolve'} onClick={() => resolve(false)}>
          Tandai Selesai
        </Button>
        {targetType !== 'user' && (
          <Button size="sm" variant="danger" loading={loading === 'delete'} onClick={() => resolve(true)}>
            Hapus Konten
          </Button>
        )}
      </div>
      {error && <p className="max-w-[240px] text-right text-xs text-red-600">{error}</p>}
    </div>
  )
}
