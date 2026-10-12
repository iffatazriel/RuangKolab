'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from '@phosphor-icons/react/dist/ssr'
import { EASE_OUT, D_COMPONENT } from '@/lib/motion'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

/** Dialog modal: backdrop klik/Esc menutup, fokus ke tombol tutup saat dibuka. */
export function Modal({ open, onClose, title, children }: Props) {
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[95] bg-stone-950/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : D_COMPONENT, ease: EASE_OUT }}
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[96] flex items-end justify-center p-0 sm:items-center sm:p-6">
            {/* web glass approximation - bukan Apple Liquid Glass resmi.
               Fallback solid saat transparansi dikurangi (lihat globals). */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="modal-glass w-full max-w-lg rounded-t-2xl border border-white/20 bg-white/85 p-6 shadow-xl backdrop-blur-[24px] backdrop-saturate-[180%] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.3),0_18px_60px_rgba(0,0,0,0.18)] sm:rounded-2xl dark:border-white/20 dark:bg-stone-900/70 dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.12),0_18px_60px_rgba(0,0,0,0.42)]"
              initial={reduce ? false : { opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: reduce ? 0 : D_COMPONENT, ease: EASE_OUT }}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">{title}</h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup dialog"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 active:scale-[0.98] dark:active:text-stone-400 dark:hover:bg-stone-800"
                >
                  <X size={20} weight="bold" aria-hidden="true" />
                </button>
              </div>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
