'use client'

/* ---------- CARA KERJA: sticky-stack GSAP (kartu pin dan menumpuk saat scroll) ----------
   Canonical pattern skill Section 5.A: pin tiap kartu kecuali terakhir di
   "top top", kartu sebelumnya mengecil (scale 0.92, opacity 0.55) saat kartu
   berikutnya tiba. Tanpa reduced-motion: render daftar biasa. */

import { useRef, useEffect, useId } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'
import { Compass, PaperPlaneTilt, UsersThree } from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

export interface HowStep {
  icon: 'Compass' | 'PaperPlaneTilt' | 'UsersThree'
  title: string
  body: string
}

const ICONS = {
  Compass: Compass,
  PaperPlaneTilt: PaperPlaneTilt,
  UsersThree: UsersThree,
}

export function HowStickyStack({ steps }: { steps: HowStep[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const instanceId = useId().replace(/:/g, '')
  const cardClass = `how-card-${instanceId}`
  const innerClass = `how-card-inner-${instanceId}`

  useEffect(() => {
    if (reduce || !ref.current || steps.length <= 1) return
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(`.${cardClass}`)
      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          endTrigger: cardEls[cardEls.length - 1],
          end: 'top top',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        })
        const inner = card.querySelector(`.${innerClass}`)
        if (!inner) return
        gsap.to(inner, {
          scale: 0.92,
          opacity: 0.55,
          ease: 'none',
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [reduce, steps.length, cardClass, innerClass])

  return (
    <div ref={ref} className="relative mt-8">
      <ol className="flex flex-col gap-4">
        {steps.map((s, i) => {
          const Icon = ICONS[s.icon]
          return (
            <li
              key={s.title}
              style={{ zIndex: i + 1 }}
              className={`${cardClass} relative flex min-h-[60dvh] items-center justify-center`}
            >
              <div className={`${innerClass} w-full max-w-xl will-change-transform`}>
                <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-[var(--card-bg)] p-8 shadow-sm sm:p-10">
                  <div aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                    <Icon size={48} weight="duotone" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">{s.title}</h3>
                  <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-stone-600 dark:text-stone-400">{s.body}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
