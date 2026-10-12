import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-12 text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row">
        <div className="max-w-md">
          <Link href="/" className="mb-3 flex items-center space-x-2 font-bold tracking-tight text-slate-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
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
            <span className="text-lg font-bold tracking-tight">RuangKolab</span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-500">
            Platform kolaborasi mahasiswa: temukan lomba kampus, rekrut rekan tim lintas jurusan, dan realisasikan proyek nyata bersama.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs font-medium text-slate-600">
          <Link href="/lomba" className="transition-colors hover:text-indigo-600">Daftar Lomba</Link>
          <Link href="/tim" className="transition-colors hover:text-indigo-600">Cari Rekan Tim</Link>
          <Link href="/proyek" className="transition-colors hover:text-indigo-600">Proyek Kolaborasi</Link>
          <Link href="/dashboard" className="transition-colors hover:text-indigo-600">Dashboard</Link>
          <Link href="/profil" className="transition-colors hover:text-indigo-600">Profil Saya</Link>
          <Link href="/masuk" className="transition-colors hover:text-indigo-600">Masuk Akun</Link>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-slate-100 px-6 pt-6 text-xs text-slate-400">
        (c) {new Date().getFullYear()} RuangKolab. Dibangun untuk ekosistem kolaborasi mahasiswa.
      </div>
    </footer>
  )
}
