'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, useReducedMotion } from 'motion/react'
import { BookmarkSimple, Bookmark } from '@phosphor-icons/react/dist/ssr'
import { SPRING } from '@/lib/motion'
import { useToast } from '@/components/ui/Toast'

interface Props {
  competitionId: string
  initiallySaved: boolean
  judul: string
}

export function FavoriteButton({ competitionId, initiallySaved, judul }: Props) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const toast = useToast()
  const [saved, setSaved] = useState(initiallySaved)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      toast.push('Masuk dulu untuk menyimpan lomba.', 'error')
      return
    }
    if (saved) {
      await supabase
        .from('competition_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('competition_id', competitionId)
      setSaved(false)
      toast.push('Dihapus dari minat saya.')
    } else {
      await supabase
        .from('competition_favorites')
        .insert({ user_id: user.id, competition_id: competitionId })
      setSaved(true)
      toast.push(`Tersimpan: ${judul}`)
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      disabled={loading}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
        saved
          ? 'border-amber-300 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
          : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900'
      }`}
      aria-pressed={saved}
    >
      {/* Ikon memantul dengan pegas saat disimpan */}
      <motion.span
        key={saved ? 'on' : 'off'}
        initial={reduce ? false : { scale: 0.5, y: saved ? -6 : 0 }}
        animate={{ scale: 1, y: 0 }}
        transition={SPRING}
        className="inline-flex"
      >
        {saved ? <BookmarkSimple size={18} weight="fill" /> : <Bookmark size={18} />}
      </motion.span>
      {saved ? 'Tersimpan' : 'Simpan ke minat saya'}
    </motion.button>
  )
}
