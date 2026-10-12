'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { EASE_OUT, D_COMPONENT } from '@/lib/motion'

type Tone = 'success' | 'error'
interface ToastItem { id: number; msg: string; tone: Tone }

const ToastCtx = createContext<{ push: (msg: string, tone?: Tone) => void }>({ push: () => {} })

export function useToast() {
  return useContext(ToastCtx)
}

/** Toast global: masuk dari atas, hilang otomatis. Dipasang sekali di layout. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const reduce = useReducedMotion()

  const push = useCallback((msg: string, tone: Tone = 'success') => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev.slice(-2), { id, msg, tone }])
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed left-1/2 top-4 z-[70] flex w-full max-w-sm -transtone-x-1/2 flex-col gap-2 px-4"
      >
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={reduce ? false : { opacity: 0, y: -24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: D_COMPONENT, ease: EASE_OUT }}
              role="status"
              className={`pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ring-1 ${
                t.tone === 'success'
                  ? 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 ring-emerald-200 dark:ring-emerald-800'
                  : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 ring-rose-200'
              }`}
            >
              {t.tone === 'success' ? (
                <CheckCircle size={20} weight="fill" className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <WarningCircle size={20} weight="fill" className="shrink-0 text-rose-600 dark:text-rose-400" />
              )}
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}
