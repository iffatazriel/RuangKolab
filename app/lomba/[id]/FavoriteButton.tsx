'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  competitionId: string
  initiallySaved: boolean
}

export function FavoriteButton({ competitionId, initiallySaved }: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState(initiallySaved)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }
    if (saved) {
      await supabase
        .from('competition_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('competition_id', competitionId)
      setSaved(false)
    } else {
      await supabase
        .from('competition_favorites')
        .insert({ user_id: user.id, competition_id: competitionId })
      setSaved(true)
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition disabled:opacity-60 ${
        saved
          ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {saved ? '★ Tersimpan di Minat Saya' : '☆ Simpan ke Minat Saya'}
    </button>
  )
}
