'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE_OUT, SPRING } from '@/lib/motion'

interface Props {
  terisi: number
  total: number
  className?: string
}

/** Bar slot: bertambah dengan scaleX saat anggota diterima, angka berganti singkat. */
export function SlotBar({ terisi, total, className = '' }: Props) {
  const reduce = useReducedMotion()
  const penuh = terisi >= total
  const ratio = total > 0 ? Math.min(1, terisi / total) : 0

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
        <span>
          Slot terisi{' '}
          <span className="font-mono font-bold text-slate-900">
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
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          {penuh && (
            <motion.span
              key="penuh"
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
              className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700"
            >
              Penuh
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div
        role="progressbar"
        aria-valuenow={terisi}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Slot terisi ${terisi} dari ${total}`}
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"
      >
        <motion.div
          className={`h-full w-full origin-left rounded-full ${penuh ? 'bg-rose-500' : 'bg-indigo-600'}`}
          initial={false}
          animate={{ scaleX: ratio }}
          transition={reduce ? { duration: 0 } : { ...SPRING, stiffness: 120, damping: 22 }}
        />
      </div>
    </div>
  )
}
