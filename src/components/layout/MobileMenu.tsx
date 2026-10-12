'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { List, X, Sun, Moon } from '@phosphor-icons/react'
import { EASE_OUT, D_COMPONENT } from '@/lib/motion'
import { useTheme } from '@/components/ui/ThemeToggle'

interface Props {
  isLoggedIn: boolean
  isStaff: boolean
}

/** Menu hamburger untuk HP: panel dropdown satu kolom. */
export function MobileMenu({ isLoggedIn, isStaff }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const { theme, toggleTheme } = useTheme()

  const items = [
    { href: '/lomba', label: 'Lomba' },
    { href: '/tim', label: 'Cari Tim' },
    { href: '/proyek', label: 'Proyek' },
    ...(isLoggedIn ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    ...(isLoggedIn ? [{ href: '/profil', label: 'Profil Saya' }] : []),
    ...(isStaff ? [{ href: '/moderasi', label: 'Moderasi' }] : []),
    ...(!isLoggedIn ? [{ href: '/masuk', label: 'Masuk' }] : []),
  ]

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 active:scale-[0.98] dark:active:text-stone-300 dark:hover:bg-stone-800"
      >
        {open ? <X size={24} weight="bold" aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Menu navigasi"
            className="absolute inset-x-4 top-[calc(var(--nav-h)+8px)] z-50 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl dark:border-stone-800 dark:bg-stone-900"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : D_COMPONENT, ease: EASE_OUT }}
          >
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-[48px] items-center rounded-xl px-4 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                      : 'text-stone-700 hover:bg-stone-100 dark:hover:text-stone-300 dark:hover:bg-stone-800'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="mt-1 flex min-h-[48px] items-center justify-between rounded-xl px-4 text-sm font-medium text-stone-700 dark:text-stone-300">
              <span className="flex items-center gap-2">
                {theme === 'dark' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
                Tema {theme === 'dark' ? 'gelap' : 'terang'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label="Ganti tema terang atau gelap"
                onClick={toggleTheme}
                className="relative h-7 w-12 shrink-0 rounded-full bg-stone-200 transition-colors dark:bg-stone-700"
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all dark:bg-stone-950 ${
                    theme === 'dark' ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
