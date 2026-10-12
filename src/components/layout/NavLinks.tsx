'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck } from '@phosphor-icons/react'

/**
 * Tautan nav desktop: penanda halaman aktif memakai garis bawah aksen brand.
 * Moderasi ditampilkan netral (penanda role, bukan aksen kedua).
 */
export function NavLinks({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  const items = [
    { href: '/lomba', label: 'Lomba' },
    { href: '/tim', label: 'Cari Tim' },
    { href: '/proyek', label: 'Proyek' },
    { href: '/dashboard', label: 'Dashboard', authOnly: true },
  ]

  return (
    <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex" aria-label="Navigasi utama">
      {items.map((item) => {
        if (item.authOnly && !isAdmin) return null
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`relative flex min-h-[40px] items-center transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              active ? 'text-indigo-700 dark:text-indigo-300' : ''
            }`}
          >
            {item.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600 transition-opacity dark:bg-indigo-400 ${
                active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </Link>
        )
      })}
      {isAdmin && (
        <Link
          href="/moderasi"
          aria-current={pathname.startsWith('/moderasi') ? 'page' : undefined}
          className="inline-flex min-h-[40px] items-center gap-1.5 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ShieldCheck size={16} weight="fill" className="text-slate-400 dark:text-slate-500" aria-hidden="true" />
          Moderasi
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            role
          </span>
        </Link>
      )}
    </nav>
  )
}
