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
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/** Tombol aksi utama yang sama di semua halaman. */
export function PrimaryLink({ href, children, variant = 'solid' }: { href: string; children: ReactNode; variant?: 'solid' | 'outline' }) {
  const cls =
    variant === 'solid'
      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
      : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
  return (
    <Link href={href} className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition ${cls}`}>
      {children}
    </Link>
  )
}

/** Kartu standar dengan radius, border, dan bayangan yang sama. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm ${className}`}>{children}</div>
  )
}

/** Tampilan kosong yang konsisten (daftar kosong, belum ada data). */
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <p className="font-semibold text-slate-800">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

const TONE: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  yellow: 'bg-amber-50 text-amber-800 ring-amber-200',
  red: 'bg-rose-50 text-rose-700 ring-rose-200',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  gray: 'bg-slate-100 text-slate-600 ring-slate-200',
}

/** Pill status bergaya seragam. */
export function StatusPill({ tone = 'gray', children }: { tone?: keyof typeof TONE; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE[tone]}`}>
      {children}
    </span>
  )
}
