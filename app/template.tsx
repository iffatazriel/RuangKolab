'use client'

import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/lib/motion'

/**
 * Transisi antar halaman: fade + geser 8px, 200ms.
 * Alasan: menandai perpindahan konteks tanpa memperlambat navigasi.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="rk-ensure-visible"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}
