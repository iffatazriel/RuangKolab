import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const nav = [
  { href: '/lomba', label: 'Lomba' },
  { href: '/tim', label: 'Cari Tim' },
  { href: '/proyek', label: 'Proyek' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/profil', label: 'Profil' },
  { href: '/masuk', label: 'Masuk' },
]

const komunitas = [
  { href: '/lomba/usul', label: 'Usulkan Lomba' },
  { href: '/tim/baru', label: 'Buat Postingan Tim' },
  { href: '/proyek/baru', label: 'Mulai Proyek' },
  { href: '/daftar', label: 'Gabung Sekarang' },
]

export function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-white py-12 text-stone-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row">
        <div className="max-w-md">
          <Link href="/" className="mb-3 flex items-center space-x-2 font-bold tracking-tight text-stone-900 dark:text-stone-100">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-white dark:bg-brand-500">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight">RuangKolab</span>
          </Link>
          <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
            Platform kolaborasi mahasiswa: temukan lomba kampus, rekrut rekan tim lintas jurusan, dan realisasikan proyek nyata bersama.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
            Menemukan konten yang melanggar? Laporkan lewat tombol Laporkan di setiap halaman.
          </p>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
          <nav aria-label="Navigasi footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs font-medium">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[32px] items-center text-stone-600 transition-colors hover:text-brand-600 dark:hover:text-stone-400 dark:hover:text-brand-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Komunitas" className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs font-medium sm:grid-cols-1">
            <p className="col-span-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400 sm:col-span-1">
              Komunitas
            </p>
            {komunitas.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[32px] items-center text-stone-600 transition-colors hover:text-brand-600 dark:hover:text-stone-400 dark:hover:text-brand-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t-2 border-stone-200 px-6 pt-6 text-xs text-stone-400 dark:border-stone-700 dark:text-stone-500">
        © {new Date().getFullYear()} RuangKolab. Dibangun untuk ekosistem kolaborasi mahasiswa.
      </div>
    </footer>
  )
}
