'use client'

import { useState } from 'react'
import { Sun, Moon } from '@phosphor-icons/react'
import { useReducedMotion } from 'motion/react'

/** Toggle tema terang/gelap. Default mengikuti sistem, pilihan disimpan. */
export function ThemeToggle() {
  const reduce = useReducedMotion()
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    document.documentElement.classList.toggle('light', next !== 'dark')
    try {
      localStorage.setItem('rk-theme', next)
    } catch {
      /* abaikan */
    }
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 active:scale-[0.98] dark:active:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
    >
      {theme === 'dark' ? (
        <Sun size={20} weight={reduce ? 'regular' : 'duotone'} aria-hidden="true" />
      ) : (
        <Moon size={20} weight={reduce ? 'regular' : 'duotone'} aria-hidden="true" />
      )}
    </button>
  )
}
