import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const jelajahi = [
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

function FooterNav({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
        {title}
      </p>
      <ul className="mt-3 space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-[32px] items-center text-xs font-medium text-stone-600 transition-colors hover:text-brand-600 dark:text-stone-400 dark:hover:text-brand-400"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-white py-12 text-stone-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
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
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
              Tema
            </span>
            <ThemeToggle />
          </div>
        </div>
        <FooterNav title="Jelajahi" items={jelajahi} />
        <FooterNav title="Komunitas" items={komunitas} />
      </div>
      <div className="mx-auto mt-10 max-w-7xl px-6">
        <div className="border-t border-stone-100 pt-6 text-xs text-stone-400 dark:border-stone-800 dark:text-stone-500">
          © {new Date().getFullYear()} RuangKolab. Dibangun untuk ekosistem kolaborasi mahasiswa.
        </div>
      </div>
    </footer>
  )
}
