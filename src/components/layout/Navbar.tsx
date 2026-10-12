import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from './LogoutButton'
import { NavbarShell } from '@/components/motion/LandingMotion'
import { BadgePop } from '@/components/motion/AppMotion'
import { NavLinks } from './NavLinks'
import { MobileMenu } from './MobileMenu'
import { Avatar } from '@/components/ui/Avatar'
import { Bell } from '@phosphor-icons/react/dist/ssr'

function Logo() {
  return (
    <Link href="/" className="group flex items-center space-x-2.5 font-bold tracking-tight">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm transition-transform group-hover:scale-105 dark:group-hover:bg-brand-500">
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-stone-900 transition-colors group-hover:text-brand-600 dark:group-hover:text-stone-100 dark:group-hover:text-brand-400">
        RuangKolab
      </span>
    </Link>
  )
}

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userName: string | null = null
  let unreadCount = 0
  let isStaff = false
  if (user) {
    const [{ data: profile }, { count }] = await Promise.all([
      supabase.from('users').select('nama, role').eq('id', user.id).single(),
      supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('dibaca', false),
    ])
    userName = profile?.nama ?? user.email ?? null
    unreadCount = count ?? 0
    isStaff = profile?.role === 'admin' || profile?.role === 'moderator'
  }

  return (
    <NavbarShell
      left={
        <div className="flex items-center gap-3 md:gap-8">
          <MobileMenu isLoggedIn={!!user} isStaff={isStaff} />
          <Logo />
          <NavLinks isAdmin={isStaff} />
        </div>
      }
      right={
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                aria-label={`Notifikasi, ${unreadCount} belum dibaca`}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 hover:text-brand-600 dark:hover:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-brand-400"
              >
                <Bell size={22} aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    <BadgePop count={unreadCount} />
                  </span>
                )}
              </Link>
              <Link
                href="/profil"
                aria-label={`Profil ${userName ?? ''}`}
                className="inline-flex items-center gap-2 rounded-full p-1 pr-1 transition-colors hover:bg-stone-100 active:scale-[0.98] dark:hover:bg-stone-800"
              >
                <Avatar nama={userName ?? '?'} size="sm" />
                <span className="hidden max-w-28 truncate text-sm font-medium text-stone-700 lg:inline dark:text-stone-300">
                  {userName || 'Profil'}
                </span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/masuk"
                className="inline-flex min-h-[40px] items-center rounded-full px-4 text-sm font-medium text-stone-700 transition-colors hover:text-brand-600 dark:hover:text-stone-300 dark:hover:text-brand-400"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-brand-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      }
    />
  )
}
