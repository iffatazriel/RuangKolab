import Link from 'next/link'

interface Props {
  /** Teks tombol utama */
  label: string
  /** Tujuan anchor atau rute */
  href: string
  /** true jika href adalah URL eksternal (dibuka di tab baru) */
  external?: boolean
  /** Tombol sekunder opsional (mis. bagikan) */
  secondary?: React.ReactNode
}

/**
 * Bar aksi menempel di bawah layar HP pada halaman detail.
 * Selalu tampil di <md agar CTA utama tidak tenggelam di bawah konten panjang.
 */
export function StickyCta({ label, href, external = false, secondary }: Props) {
  const cls =
    'inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]'
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden dark:border-stone-800 dark:bg-stone-950/95">
      <div className="flex items-center gap-2">
        {external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
            {label}
          </a>
        ) : (
          <Link href={href} className={cls}>
            {label}
          </Link>
        )}
        {secondary}
      </div>
    </div>
  )
}
