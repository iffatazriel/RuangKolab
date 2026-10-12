import type { ReactNode } from 'react'
import Link from 'next/link'

/** Kontainer halaman standar: lebar dan padding sama di semua halaman. */
export function PageContainer({ children, width = 'wide' }: { children: ReactNode; width?: 'narrow' | 'medium' | 'wide' }) {
  const max = width === 'narrow' ? 'max-w-2xl' : width === 'medium' ? 'max-w-4xl' : 'max-w-6xl'
  return <div className={`mx-auto ${max} px-4 py-10 sm:px-6`}>{children}</div>
}

/** Judul halaman + deskripsi singkat + aksi opsional (tombol). */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/** Tombol aksi utama yang sama di semua halaman. */
export function PrimaryLink({ href, children, variant = 'solid' }: { href: string; children: ReactNode; variant?: 'solid' | 'outline' }) {
  const cls =
    variant === 'solid'
      ? 'bg-brand-600 text-white shadow-sm hover:bg-brand-700'
      : 'border border-brand-600 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 dark:hover:bg-brand-950'
  return (
    <Link href={href} className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${cls}`}>
      {children}
    </Link>
  )
}

/** Kartu standar dengan radius, border, dan bayangan yang sama. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-stone-200 dark:border-stone-800/70 bg-white dark:bg-stone-900 p-5 shadow-sm ${className}`}>{children}</div>
  )
}

/** Tampilan kosong yang konsisten (daftar kosong, belum ada data). */
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-6 py-10 text-center">
      <p className="font-semibold text-stone-800 dark:text-stone-200">{title}</p>
      {description && <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

const TONE: Record<string, string> = {
  green: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-800',
  yellow: 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 ring-amber-200',
  red: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 ring-rose-200',
  indigo: 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 ring-brand-200',
  gray: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 ring-stone-200 dark:ring-stone-700',
}

/** Pill status bergaya seragam. */
export function StatusPill({ tone = 'gray', children }: { tone?: keyof typeof TONE; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE[tone]}`}>
      {children}
    </span>
  )
}
