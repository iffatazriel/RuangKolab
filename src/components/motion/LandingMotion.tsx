'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, animate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import type { ReactNode } from 'react'
import {
  fadeUp,
  fadeIn,
  scaleIn,
  staggerContainer,
  VIEWPORT_ONCE,
  EASE_OUT,
  SPRING,
} from '@/lib/motion'

/* ---------- HERO: stagger per baris, alasan: mengarahkan mata berurutan ---------- */

export function HeroLines() {
  const reduce = useReducedMotion()
  return (
    <motion.h1
      className="rk-ensure-visible text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl sm:leading-[1.12] dark:text-stone-100"
      initial={reduce ? false : 'hidden'}
      animate="show"
      variants={staggerContainer(2)}
      aria-label="Temukan lomba, bentuk tim impianmu."
    >
      <motion.span className="block" variants={fadeUp}>
        Temukan Lomba,
      </motion.span>
      <motion.span className="block" variants={fadeUp}>
        <em>Bentuk Tim</em> Impianmu.
      </motion.span>
    </motion.h1>
  )
}

export function HeroFollow({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {/* Konten diisi pemanggil */}
    </motion.div>
  )
}

/** Bungkus konten hero (subteks, CTA) agar masuk setelah headline. */
export function HeroSequence({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="rk-ensure-visible"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

/** Parallax halus kartu hero, maks 40px. Gambar tetap tanpa fade demi LCP. */
export function HeroParallax({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -40])
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  )
}

/* ---------- HERO STACK 3D: 2-3 kartu lomba asli, parallax kursor (desktop saja) ---------- */

export function HeroStack({ cards }: { cards: ReactNode[] }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  // rotate ±8deg mengikuti kursor; pegas agar terasa fisik
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), SPRING)
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), SPRING)

  const shown = cards.slice(0, 3)

  if (shown.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-900">
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400">Belum ada lomba aktif (contoh)</p>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="[perspective:1200px]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {/* HP: satu kartu statis */}
      <div className="lg:hidden">{shown[0]}</div>
      {/* Desktop: tumpukan berlapis dengan kedalaman translateZ */}
      <motion.div
        className="relative hidden h-[440px] [transform-style:preserve-3d] lg:block"
        style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
        aria-label="Contoh lomba yang sedang dibuka"
      >
        {shown.map((card, i) => (
          <StackCard key={i} index={i} total={shown.length}>
            <div
              className="overflow-hidden rounded-2xl shadow-xl"
              style={{ transform: `translate(${-i * 22}px, ${i * 26}px) rotate(${-i * 2}deg)` }}
            >
              {card}
            </div>
          </StackCard>
        ))}
      </motion.div>
    </div>
  )
}

/**
 * Satu kartu dalam tumpukan hero.
 * Parallax scroll multi-kecepatan: kartu atas (depan) bergerak lebih cepat
 * daripada kartu bawah. Tiap kartu punya useTransform sendiri (bukan loop).
 */
function StackCard({ index, total, children }: { index: number; total: number; children: ReactNode }) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  // Kartu paling atas (index 0) paling cepat: -64px; paling bawah paling lambat
  const speed = -64 + index * 20
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : speed])
  const z = (total - 1 - index) * 40

  return (
    <motion.div
      className="absolute inset-x-8 top-0"
      style={{ zIndex: total - index }}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 + index * 0.12 }}
    >
      {/* Lapisan dalam khusus parallax scroll agar tidak konflik dengan entrance */}
      <motion.div style={{ y, z }}>{children}</motion.div>
    </motion.div>
  )
}

/* ---------- NAVBAR: shrink 72-56 + glass blur 16px saat scroll ---------- */

export function NavbarShell({ left, right }: { left: ReactNode; right: ReactNode }) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const h = useTransform(scrollY, [0, 120], [72, 56])
  const hPx = useTransform(h, (v) => `${v}px`)
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled((prev) => (v > 80 ? true : v <= 40 ? false : prev))
  })

  if (reduce) {
    return (
      <header
        className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90"
        style={{ height: 'var(--nav-h)' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6" style={{ height: 'var(--nav-h)' }}>
          {left}
          {right}
        </div>
      </header>
    )
  }

  return (
    <motion.header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        /* web glass approximation - bukan Apple Liquid Glass resmi */
        scrolled
          ? 'border-white/10 bg-white/75 backdrop-blur-lg backdrop-saturate-[160%] shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)] dark:border-white/10 dark:bg-stone-950/70'
          : 'border-transparent bg-white/70 dark:bg-stone-950/70'
      }`}
      style={{ height: hPx }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {left}
        {right}
      </div>
    </motion.header>
  )
}

/* ---------- SECTION REVEAL: kartu masuk dengan stagger ---------- */

/* ---------- COUNTER: count-up satu kali saat masuk viewport ----------
   Tanpa setState loop: useMotionValue + animate(), angka dirender via
   useTransform yang dibulatkan. Alasan: memberi bobot pada angka bukti. */
export function CountUp({ value, className = '' }: { value: number; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => String(Math.round(v)))

  useEffect(() => {
    if (reduce || !inView) {
      mv.set(value)
      return
    }
    const controls = animate(mv, value, { duration: 1.2, ease: EASE_OUT })
    return () => controls.stop()
  }, [inView, reduce, value, mv])

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  )
}

/* ---------- SCROLL-REVEAL STAGGER (ringan, tanpa pin) ----------
   Untuk "items appear as they enter viewport": pakai whileInView,
   bukan GSAP. Simpan GSAP hanya untuk pin/scrub (sticky-stack). */
export function RevealStagger({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  return (
    <ul className="grid gap-6">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            delay: i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {item}
        </motion.li>
      ))}
    </ul>
  )
}

export function RevealGroup({ children, className = '' }: { children: ReactNode[]; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={VIEWPORT_ONCE}
      variants={staggerContainer(children.length)}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  )
}

/* ---------- CAROUSEL DEADLINE: scroll-snap horizontal, full-bleed dengan gutter ---------- */

/**
 * Baris scroll-snap horizontal.
 * - Full-bleed: kartu keluar dari tepi kontainer tapi selalu berhenti
 *   sejajar dengan garis konten (padding-inline sama dengan container).
 * - Mask tepi: kartu yang terpotong memudar, memberi hint "masih ada isi".
 * - Keyboard: region fokusabel, geser dengan panah saat fokus.
 */
export function SnapRow({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="relative"
    >
      <div
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          // Gutter agar kartu pertama/terakhir sejajar konten, sisanya full-bleed
          scrollPaddingInline: '1rem',
          maskImage: 'linear-gradient(90deg, transparent, black 2rem, black calc(100% - 2rem), transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 2rem, black calc(100% - 2rem), transparent)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function SnapCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    // Lebar kartu ringkas: ~70% layar HP, 300px desktop
    <div className={`w-[70%] max-w-[300px] shrink-0 snap-start pl-4 first:pl-0 sm:pl-5 sm:first:pl-0 lg:w-[300px] ${className}`}>
      {children}
    </div>
  )
}

/* ---------- SPOTLIGHT BORDER: menyala mengikuti kursor, hanya pointer halus ---------- */

export function SpotlightCard({ children, className = '', lift = false }: { children: ReactNode; className?: string; lift?: boolean }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const bg = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(240px circle at ${x}px ${y}px, rgba(43, 92, 180,0.10), transparent 70%)`
  )

  // Lift translateZ 8-12px saat hover: terasa naik tanpa berlebihan
  const inner = (
    <motion.div
      className="h-full"
      whileHover={reduce || !lift ? undefined : { z: 10 }}
      transition={reduce || !lift ? undefined : { type: 'spring', stiffness: 150, damping: 18 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900 shadow-sm transition-shadow hover:shadow-md ${lift ? '[perspective:800px]' : ''} ${className}`}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
      }}
      onPointerLeave={() => { mx.set(0); my.set(0) }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:block hidden"
        style={{ background: bg }}
      />
      {inner}
    </div>
  )
}

/* ---------- CTA MAGNETIK: tarikan maks 8px, hanya desktop pointer halus ---------- */

export function MagneticLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, SPRING)
  const y = useSpring(my, SPRING)

  return (
    <motion.div
      style={reduce ? undefined : { x, y }}
      className="inline-block [@media(hover:hover)_and_(pointer:fine)]:block"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 16)
        my.set(((e.clientY - r.top) / r.height - 0.5) * 16)
      }}
      onPointerLeave={() => { mx.set(0); my.set(0) }}
    >
      <a
        href={href}
        className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 active:scale-[0.98] ${className}`}
      >
        {children}
      </a>
    </motion.div>
  )
}

/* ---------- MARQUEE: satu-satunya, keahlian populer, berhenti saat hover ---------- */

export function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  if (reduce) {
    return (
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((it) => (
          <span key={it} className="rounded-full bg-white dark:bg-stone-900 px-3.5 py-1.5 text-sm font-medium text-stone-700 dark:text-stone-300 ring-1 ring-stone-200 dark:ring-stone-700">{it}</span>
        ))}
      </div>
    )
  }
  const doubled = [...items, ...items]
  return (
    <div className="group relative overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max gap-3 group-hover:[animation-play-state:paused] motion-safe:animate-[rk-marquee_28s_linear_infinite]">
        {doubled.map((it, i) => (
          <span
            key={`${it}-${i}`}
            aria-hidden={i >= items.length}
            className="rounded-full bg-white dark:bg-stone-900 px-3.5 py-1.5 text-sm font-medium text-stone-700 dark:text-stone-300 ring-1 ring-stone-200 dark:ring-stone-700"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- Latar bergeser lambat: satu section, aksen sama ---------- */

export function DriftBackdrop({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-50%]"
        style={{
          background:
            'radial-gradient(600px circle at 30% 30%, rgba(43, 92, 180,0.08), transparent 60%), radial-gradient(600px circle at 70% 70%, rgba(43, 92, 180,0.06), transparent 60%)',
        }}
        animate={reduce ? undefined : { rotate: [0, 8, 0], scale: [1, 1.05, 1] }}
        transition={reduce ? undefined : { duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export { motion, fadeUp, fadeIn, scaleIn, staggerContainer, VIEWPORT_ONCE }
