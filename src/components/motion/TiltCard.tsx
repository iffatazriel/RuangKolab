'use client'

import { useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { SPRING } from '@/lib/motion'

interface Props {
  children: React.ReactNode
  className?: string
  /** Derajat tilt maksimum (default 6 sesuai batas). */
  max?: number
  /** Jarak pandang 3D (default 900px; kartu profil memakai 800px). */
  perspective?: number
}

/**
 * Tilt 3D halus + sorotan tipis mengikuti kursor (maks 6 derajat).
 * Nonaktif di layar sentuh dan saat reduced-motion.
 */
export function TiltCard({ children, className = '', max = 6, perspective = 900 }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const srx = useSpring(rx, SPRING)
  const sry = useSpring(ry, SPRING)
  const glow = useMotionTemplate`radial-gradient(300px circle at ${gx}% ${gy}%, rgba(255,255,255,0.12), transparent 70%)`

  // Tilt hanya untuk pointer presisi; layar sentuh selalu statis
  function coarsePointer(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  }

  return (
    <motion.div
      ref={ref}
      className={`group ${className}`}
      style={{ perspective }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || coarsePointer()) return
        const r = e.currentTarget.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        ry.set((px - 0.5) * max * 2)
        rx.set((0.5 - py) * max * 2)
        gx.set(px * 100)
        gy.set(py * 100)
      }}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
        setHovering(false)
      }}
    >
      <motion.div
        className="relative h-full [transform-style:preserve-3d]"
        // will-change hanya aktif saat hover, dihapus saat mouse leave
        style={reduce ? undefined : { rotateX: srx, rotateY: sry, willChange: hovering ? 'transform' : 'auto' }}
      >
        {children}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
          style={{ background: glow }}
        />
      </motion.div>
    </motion.div>
  )
}
