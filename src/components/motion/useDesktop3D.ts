'use client'

import { useEffect, useState } from 'react'

/**
 * True hanya di desktop (>=1024px) dengan pointer halus dan tanpa
 * reduced-motion. Default false saat SSR: konten mobile-first statis,
 * efek 3D menyusul setelah mount (aman untuk Safari lama).
 */
export function useDesktop3D(): boolean {
  const [on, setOn] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setOn(mq.matches && !rm.matches)
    update()
    mq.addEventListener?.('change', update)
    rm.addEventListener?.('change', update)
    return () => {
      mq.removeEventListener?.('change', update)
      rm.removeEventListener?.('change', update)
    }
  }, [])

  return on
}
