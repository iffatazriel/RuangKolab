import { Tag, CalendarDots, Wallet, UsersThree } from '@phosphor-icons/react/dist/ssr'
import { getDeadlineTone, deadlineToneClass } from '@/lib/deadline'

export interface CompetitionCardData {
  id: string
  judul: string
  penyelenggara: string | null
  kategori: string | null
  tingkat: string | null
  deadline: string
  biaya: number
  poster_url: string | null
}

interface Props {
  comp: CompetitionCardData
  /** Jumlah team_posts berstatus terbuka untuk lomba ini. 0 = tidak tampil. */
  timMencari?: number
  /** 3 kartu pertama halaman: eager + high priority, sisanya lazy. */
  priority?: boolean
}

/**
 * Fallback poster: pola CSS dari token brand, dibedakan per kategori.
 * Tanpa SVG buatan tangan, tanpa foto stok.
 */
const KATEGORI_POLA: Record<string, string> = {
  Ilmiah: 'bg-[radial-gradient(circle_at_1px_1px,rgba(79,70,229,0.25)_1px,transparent_0)] [background-size:14px_14px] bg-slate-50 dark:bg-slate-900',
  Teknologi: 'bg-[linear-gradient(90deg,rgba(79,70,229,0.14)_1px,transparent_1px),linear-gradient(rgba(79,70,229,0.14)_1px,transparent_1px)] [background-size:18px_18px] bg-slate-50 dark:bg-slate-900',
  Bisnis: 'bg-[repeating-linear-gradient(45deg,rgba(79,70,229,0.10)_0_2px,transparent_2px_14px)] bg-slate-50 dark:bg-slate-900',
  Desain: 'bg-[conic-gradient(from_90deg_at_1px_1px,rgba(79,70,229,0.10)_90deg,transparent_0)] [background-size:22px_22px] bg-slate-50 dark:bg-slate-900',
  Olahraga: 'bg-[repeating-linear-gradient(-45deg,rgba(79,70,229,0.10)_0_2px,transparent_2px_16px)] bg-slate-50 dark:bg-slate-900',
  'Seni & Budaya': 'bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.16),transparent_60%)] bg-slate-50 dark:bg-slate-900',
}

function PosterFallback({ kategori }: { kategori: string | null }) {
  const pola = KATEGORI_POLA[kategori ?? ''] ?? KATEGORI_POLA.Ilmiah
  return (
    <div className={`absolute inset-0 flex items-end p-4 ${pola}`} aria-hidden="true">
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100 dark:bg-slate-900/80 dark:text-indigo-300">
        <Tag size={12} weight="bold" />
        {kategori ?? 'Umum'}
      </span>
    </div>
  )
}

export function CompetitionCard({ comp, timMencari = 0, priority = false }: Props) {
  const dl = getDeadlineTone(comp.deadline)
  const poster = comp.poster_url

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[var(--card-bg)] shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-16px_rgba(15,23,42,0.10)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(15,23,42,0.06),0_16px_32px_-16px_rgba(15,23,42,0.18)] active:scale-[0.98] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 dark:border-slate-800 motion-safe:hover:-translate-y-[3px] motion-reduce:hover:translate-y-0">
      {/* Poster: rasio tetap, object-top karena judul poster umumnya di atas */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 dark:bg-slate-900">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={`Poster ${comp.judul}`}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
        ) : (
          <PosterFallback kategori={comp.kategori} />
        )}
      </div>

      {/* Badan kartu: seluruh kartu satu tautan (stretched link) */}
      <a
        href={`/lomba/${comp.id}`}
        className="absolute inset-0 z-10 rounded-2xl outline-none"
        aria-label={`${comp.judul}. ${comp.kategori ?? 'Umum'}. Deadline ${dl.pendek}.`}
      >
        <span className="sr-only">Buka detail lomba</span>
      </a>

      <div className="relative z-0 flex flex-1 flex-col p-5">
        {/* 1. Baris atas: kategori kiri, deadline kanan */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <Tag size={13} weight="bold" />
            {comp.kategori ?? 'Umum'}
          </span>
          <span className={`shrink-0 text-[13px] font-semibold tabular-nums ${deadlineToneClass[dl.tone]}`}>
            {dl.pendek}
          </span>
        </div>

        {/* 2. Judul */}
        <h3 className="mt-3 line-clamp-2 text-[17px] font-semibold leading-snug text-slate-900 dark:text-slate-100">
          {comp.judul}
        </h3>

        {/* 3. Penyelenggara: 13px, kontras AA */}
        {comp.penyelenggara && (
          <p className="mt-1 text-[13px] leading-snug text-slate-700 dark:text-slate-300">
            {comp.penyelenggara}
          </p>
        )}

        {/* 5. Sinyal tim: hanya jika ada yang membuka */}
        {timMencari > 0 && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo-700 dark:text-indigo-300">
            <UsersThree size={15} weight="fill" aria-hidden="true" />
            {timMencari} tim mencari anggota
          </p>
        )}

        {/* 4. Footer sejajar antar kartu: tanggal mono, biaya */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[13px] dark:border-slate-800">
          <span className="inline-flex items-center gap-1.5 tabular-nums text-slate-700 dark:text-slate-300">
            <CalendarDots size={14} aria-hidden="true" />
            <span className="font-mono">{dl.panjang}</span>
          </span>
          <span
            className={`inline-flex items-center gap-1 font-semibold tabular-nums ${
              comp.biaya === 0
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            <Wallet size={14} aria-hidden="true" />
            <span className="font-mono">{comp.biaya === 0 ? 'Gratis' : `Rp ${comp.biaya.toLocaleString('id-ID')}`}</span>
          </span>
        </div>
      </div>
    </article>
  )
}
