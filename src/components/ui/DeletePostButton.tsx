'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from './Button'

interface Props {
  postId: string
  redirectTo: string
}

export function DeletePostButton({ postId, redirectTo }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function remove() {
    if (!window.confirm('Hapus postingan ini? Tindakan tidak bisa dibatalkan.')) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: dbError } = await supabase.from('team_posts').delete().eq('id', postId)
    setLoading(false)
    if (dbError) {
      setError(dbError.message)
      return
    }
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="danger" size="sm" loading={loading} onClick={remove}>
        Hapus Postingan
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
