import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from './LogoutButton'

function Logo() {
  return (
    <Link href="/" className="group flex items-center space-x-2.5 font-bold tracking-tight">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition-transform group-hover:scale-105">
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
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
      <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
        RuangKolab
      </span>
    </Link>
  )
}

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userRole: string | null = null
  let userName: string | null = null
  let unreadCount = 0
  if (user) {
    const [{ data: profile }, { count }] = await Promise.all([
      supabase.from('users').select('nama, role').eq('id', user.id).single(),
      supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('dibaca', false),
    ])
    userRole = profile?.role ?? null
    userName = profile?.nama ?? user.email ?? null
    unreadCount = count ?? 0
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center space-x-10">
          <Logo />
          <nav className="hidden items-center space-x-7 text-sm font-medium text-slate-600 md:flex">
            <Link href="/lomba" className="transition-colors hover:text-indigo-600">Lomba</Link>
            <Link href="/tim" className="transition-colors hover:text-indigo-600">Cari Tim</Link>
            <Link href="/proyek" className="transition-colors hover:text-indigo-600">Proyek</Link>
            {user && (
              <Link href="/dashboard" className="transition-colors hover:text-indigo-600">Dashboard</Link>
            )}
            {(userRole === 'admin' || userRole === 'moderator') && (
              <Link href="/moderasi" className="font-semibold text-amber-600 transition-colors hover:text-amber-700">Moderasi</Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                aria-label={`Notifikasi, ${unreadCount} belum dibaca`}
                className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3A6 6 0 006 11v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link
                href="/profil"
                className="hidden text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600 sm:inline-block"
              >
                {userName || 'Profil'}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/masuk"
                className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-around border-t border-slate-100 py-2 text-xs font-medium text-slate-600 md:hidden bg-white">
        <Link href="/lomba">Lomba</Link>
        <Link href="/tim">Cari Tim</Link>
        <Link href="/proyek">Proyek</Link>
        {user && <Link href="/dashboard">Dashboard</Link>}
        {user && <Link href="/profil">Profil</Link>}
      </div>
    </header>
  )
}
