'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Trophy, UsersThree, Rocket, SquaresFour } from '@phosphor-icons/react'

const items = [
  { href: '/lomba', label: 'Lomba', icon: Trophy },
  { href: '/tim', label: 'Tim', icon: UsersThree },
  { href: '/proyek', label: 'Proyek', icon: Rocket },
  { href: '/dashboard', label: 'Dashboard', icon: SquaresFour },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden"
    >
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                active ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <Icon size={22} weight={active ? 'fill' : 'regular'} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
