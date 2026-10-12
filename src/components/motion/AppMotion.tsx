'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_OUT, D_COMPONENT, SPRING, VIEWPORT_ONCE, staggerContainer, fadeUp } from '@/lib/motion'

/**
 * Grid daftar untuk kartu (dial 4):
 * - Muat pertama: fadeUp stagger 60ms, maks 6 kartu, sekali saja.
 * - Filter berubah: layout animation pada daftar.
 */
export function CardGridMotion({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      layout
      className={className}
      initial={reduce ? false : 'hidden'}
      animate="show"
      variants={staggerContainer(6)}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {children}
      </AnimatePresence>
    </motion.div>
  )
}

/** Item kartu dalam CardGridMotion. */
export function CardGridItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      layout
      variants={fadeUp}
      initial={reduce ? false : 'hidden'}
      animate="show"
      exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: D_COMPONENT, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Grid daftar yang menganimasikan item masuk/keluar saat filter berubah. */
export function AnimateGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div layout className={className}>
      <AnimatePresence initial={false} mode="popLayout">
        {children}
      </AnimatePresence>
    </motion.div>
  )
}

/** Item grid: berpindah mulus saat daftar tersisa, fade saat keluar. */
export function GridItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      layout
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: D_COMPONENT, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Fade masuk singkat (150ms) untuk item admin/moderator. */
export function FadeIn({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Badge angka: pegas saat nilai berganti. */
export function BadgePop({ count, className = '' }: { count: number; className?: string }) {
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={SPRING}
      className={className}
    >
      {count > 9 ? '9+' : count}
    </motion.span>
  )
}

/** Membungkus dua keadaan (form dan status) agar terbaca sebagai satu blok yang berubah. */
export function Flip({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <motion.div layoutId={id} className={className}>
      {children}
    </motion.div>
  )
}
