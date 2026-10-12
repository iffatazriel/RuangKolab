'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE_OUT, SPRING } from '@/lib/motion'

interface Props {
  terisi: number
  total: number
  className?: string
}

/**
 * Indikator slot minimalis: angka mono + titik status, tanpa track penuh.
 * Titik hijau = masih ada slot, merah = penuh (keadaan nyata, bukan hiasan).
 */
export function SlotBar({ terisi, total, className = '' }: Props) {
  const reduce = useReducedMotion()
  const penuh = terisi >= total
  const sisa = Math.max(0, total - terisi)

  return (
    <div className={`flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400 ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={penuh ? 'penuh' : 'buka'}
          initial={reduce ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={reduce ? undefined : { scale: 0.5, opacity: 0 }}
          transition={SPRING}
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rounded-full ${penuh ? 'bg-rose-500' : 'bg-emerald-500'}`}
        />
      </AnimatePresence>
      <span>
        Slot terisi{' '}
        <span className="font-mono font-bold tabular-nums text-stone-900 dark:text-stone-100">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={terisi}
              className="inline-block"
              initial={reduce ? false : { y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: -8, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
            >
              {terisi}
            </motion.span>
          </AnimatePresence>
          /{total}
        </span>
        {penuh ? (
          <span className="ml-1.5 font-semibold text-rose-700 dark:text-rose-400">Penuh</span>
        ) : (
          <span className="ml-1.5 text-stone-500 dark:text-stone-400">tersisa {sisa}</span>
        )}
      </span>
    </div>
  )
}
