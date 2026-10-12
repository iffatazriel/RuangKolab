'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
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
  const items = [
    'Temukan Lomba,',
    'Bentuk Tim,',
    'Wujudkan Proyek.',
  ]
  return (
    <motion.h1
      className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.12]"
      initial={reduce ? false : 'hidden'}
      animate="show"
      variants={staggerContainer(items.length)}
      aria-label="Temukan Lomba, Bentuk Tim, Wujudkan Proyek."
    >
      {items.map((line) => (
        <motion.span
          key={line}
          className="block"
          variants={fadeUp}
        >
          {line}
        </motion.span>
      ))}
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

/* ---------- NAVBAR: blur + border muncul saat scroll, tinggi tetap --nav-h ---------- */

export function NavbarShell({ left, right }: { left: ReactNode; right: ReactNode }) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const scrolled = useTransform(scrollY, [0, 80], [0, 1])
  const bg = useTransform(scrolled, [0, 1], ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.9)'])
  const blur = useTransform(scrolled, [0, 1], ['backdrop-blur-none', 'backdrop-blur-md'])
  const borderColor = useTransform(scrolled, [0, 1], ['rgba(241,245,249,0)', 'rgba(226,232,240,0.8)'])

  return (
    <motion.header
      className="sticky top-0 z-50 border-b"
      style={reduce
        ? { height: 'var(--nav-h)', backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderColor: 'rgba(226,232,240,0.8)' }
        : { height: 'var(--nav-h)', backgroundColor: bg, backdropFilter: blur, borderColor }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6" style={{ height: 'var(--nav-h)' }}>
        {left}
        {right}
      </div>
    </motion.header>
  )
}

/* ---------- SECTION REVEAL: kartu masuk dengan stagger ---------- */

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
    // Lebar mengikuti grid lomba: ~1 kolom penuh di HP, 360px di desktop
    <div className={`w-[78%] max-w-[340px] shrink-0 snap-start pl-4 first:pl-0 sm:pl-5 sm:first:pl-0 lg:w-[360px] ${className}`}>
      {children}
    </div>
  )
}

/* ---------- CARA KERJA: garis SVG tergambar mengikuti scroll, langkah menyala saat garis sampai ---------- */

export function HowItWorks({ steps }: { steps: { title: string; body: string }[] }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] })

  return (
    <div ref={ref} className="relative mt-8 max-w-2xl">
      {/* Garis penghubung: latar abu + garis indigo yang tergambar */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[27px] w-0.5 bg-slate-200" />
      <svg aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[27px] h-full w-0.5" preserveAspectRatio="none" viewBox="0 0 2 100">
        <motion.line
          x1="1" y1="0" x2="1" y2="100"
          stroke="#4f46e5"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          style={reduce ? { pathLength: 1 } : { pathLength: scrollYProgress }}
        />
      </svg>

      <ol className="flex flex-col">
        {steps.map((s, i) => (
          <StepItem
            key={s.title}
            index={i}
            total={steps.length}
            progress={scrollYProgress}
            title={s.title}
            body={s.body}
          />
        ))}
      </ol>
    </div>
  )
}

function StepItem({
  index,
  total,
  progress,
  title,
  body,
}: {
  index: number
  total: number
  progress: MotionValue<number>
  title: string
  body: string
}) {
  const reduce = useReducedMotion()
  // Langkah menyala saat garis mencapainya: rentang proporsional posisi langkah
  const start = Math.max(0, index / total - 0.12)
  const end = Math.min(1, index / total + 0.05)
  const borderColor = useTransform(progress, [start, end], ['#e2e8f0', '#4f46e5'])
  const bg = useTransform(progress, [start, end], ['#ffffff', '#4f46e5'])
  const color = useTransform(progress, [start, end], ['#94a3b8', '#ffffff'])

  return (
    <motion.li
      className="relative flex gap-5 pb-10 last:pb-0"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <motion.span
        aria-hidden="true"
        className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold"
        style={reduce ? { borderColor: '#4f46e5', backgroundColor: '#4f46e5', color: '#ffffff' } : { borderColor, backgroundColor: bg, color }}
      >
        {index + 1}
      </motion.span>
      <div className="pt-2">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1 max-w-[65ch] text-sm leading-relaxed text-slate-600">{body}</p>
      </div>
    </motion.li>
  )
}

/* ---------- SPOTLIGHT BORDER: menyala mengikuti kursor, hanya pointer halus ---------- */

export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const bg = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(240px circle at ${x}px ${y}px, rgba(79,70,229,0.10), transparent 70%)`
  )

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}
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
      {children}
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
        className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:scale-[0.98] ${className}`}
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
          <span key={it} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200">{it}</span>
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
            className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200"
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
            'radial-gradient(600px circle at 30% 30%, rgba(79,70,229,0.08), transparent 60%), radial-gradient(600px circle at 70% 70%, rgba(79,70,229,0.06), transparent 60%)',
        }}
        animate={reduce ? undefined : { rotate: [0, 8, 0], scale: [1, 1.05, 1] }}
        transition={reduce ? undefined : { duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export { motion, fadeUp, fadeIn, scaleIn, staggerContainer, VIEWPORT_ONCE }
