'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from '@phosphor-icons/react'
import { useReducedMotion } from 'motion/react'

const EVENT = 'rk-theme-change'

function currentTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function applyTheme(next: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', next === 'dark')
  document.documentElement.classList.toggle('light', next !== 'dark')
  try {
    localStorage.setItem('rk-theme', next)
  } catch {
    /* abaikan */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }))
}

/** Hook untuk membaca dan mengganti tema dari komponen lain (misal switch di menu HP). */
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => currentTheme())

  useEffect(() => {
    const sync = () => setTheme(currentTheme())
    const onCustom = (e: Event) => setTheme((e as CustomEvent<'light' | 'dark'>).detail)
    window.addEventListener(EVENT, onCustom)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, onCustom)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { theme, toggleTheme: () => applyTheme(theme === 'dark' ? 'light' : 'dark') }
}

/** Toggle tema terang/gelap. Default mengikuti sistem, pilihan disimpan.
 *  Semua instance di halaman sinkron otomatis lewat event + storage. */
export function ThemeToggle() {
  const reduce = useReducedMotion()
  const { theme, toggleTheme } = useTheme()

  function toggle() {
    toggleTheme()
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 active:scale-[0.98] dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
    >
      {theme === 'dark' ? (
        <Sun size={20} weight={reduce ? 'regular' : 'duotone'} aria-hidden="true" />
      ) : (
        <Moon size={20} weight={reduce ? 'regular' : 'duotone'} aria-hidden="true" />
      )}
    </button>
  )
}
