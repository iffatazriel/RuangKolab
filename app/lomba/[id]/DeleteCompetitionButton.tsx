'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { friendlyError } from '@/lib/errors'
import { useToast } from '@/components/ui/Toast'

export function DeleteCompetitionButton({ competitionId, judul }: { competitionId: string; judul: string }) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function remove() {
    if (!window.confirm(`Hapus lomba "${judul}"? Tindakan tidak bisa dibatalkan.`)) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('competitions')
      .delete()
      .eq('id', competitionId)
    setLoading(false)
    if (dbError) {
      setError(friendlyError(dbError, 'Lomba tidak bisa dihapus. Kemungkinan masih ada postingan tim yang terkait; tutup postingannya dulu.'))
      toast.push(friendlyError(dbError, 'Lomba tidak bisa dihapus. Kemungkinan masih ada postingan tim yang terkait; tutup postingannya dulu.'), 'error')
      return
    }
    toast.push('Lomba dihapus.')
    router.push('/lomba')
    router.refresh()
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button variant="danger" size="sm" loading={loading} onClick={remove}>
        Hapus Lomba
      </Button>
      {error && <p className="max-w-[280px] text-xs text-rose-600">{error}</p>}
    </div>
  )
}
