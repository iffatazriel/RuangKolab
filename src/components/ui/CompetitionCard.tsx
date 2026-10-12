import { getDeadlineTone, deadlineToneClass } from '@/lib/deadline'
import { UsersThree } from '@phosphor-icons/react/dist/ssr'

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
 * Fallback poster minimalis: latar polos dengan monogram kategori.
 * Satu aksen, tanpa pola ramai, tanpa SVG ilustrasi.
 */
export function PosterFallback({ kategori }: { kategori: string | null }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-100" aria-hidden="true">
      <span className="font-mono text-base font-bold uppercase tracking-widest text-indigo-300">
        {(kategori ?? 'Umum').slice(0, 2)}
      </span>
    </div>
  )
}

/**
 * Kartu lomba minimalis: whitespace sebagai pemisah utama, border tipis,
 * tanpa shadow saat diam (hanya hover halus), tanpa pill di atas gambar.
 * Seluruh kartu satu tautan (stretched link) ke detail.
 */
export function CompetitionCard({ comp, timMencari = 0, priority = false }: Props) {
  const dl = getDeadlineTone(comp.deadline)
  const poster = comp.poster_url

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[var(--card-bg)] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-slate-300 motion-safe:hover:-translate-y-[3px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
      {/* Poster: rasio tetap, object-top karena judul poster umumnya di atas */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={`Poster ${comp.judul}`}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="absolute inset-0 h-full w-full object-cover object-top motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.02]"
          />
        ) : (
          <PosterFallback kategori={comp.kategori} />
        )}
      </div>

      {/* Stretched link: seluruh kartu satu tautan */}
      <a
        href={`/lomba/${comp.id}`}
        className="absolute inset-0 z-10 rounded-2xl outline-none"
        aria-label={`${comp.judul}. ${comp.kategori ?? 'Umum'}. Deadline ${dl.pendek}.`}
      >
        <span className="sr-only">Buka detail lomba</span>
      </a>

      <div className="relative z-0 flex flex-1 flex-col gap-1.5 p-4">
        {/* Baris atas: kategori kiri, deadline kanan (semantik, bukan aksen) */}
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-medium text-slate-500">
            {comp.kategori ?? 'Umum'}
          </span>
          <span className={`shrink-0 font-mono text-xs font-semibold tabular-nums ${deadlineToneClass[dl.tone]}`}>
            {dl.pendek}
          </span>
        </div>

        {/* Judul: elemen terbesar setelah poster */}
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">
          {comp.judul}
        </h3>

        {/* Penyelenggara: 13px kontras AA */}
        {comp.penyelenggara && (
          <p className="truncate text-xs leading-snug text-slate-700">
            {comp.penyelenggara}
          </p>
        )}

        {/* Sinyal tim: hanya jika ada yang membuka */}
        {timMencari > 0 && (
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700">
            <UsersThree size={14} weight="fill" aria-hidden="true" />
            {timMencari} tim mencari anggota
          </p>
        )}

        {/* Footer sejajar antar kartu: tanggal lengkap mono, biaya */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5 text-xs">
          <span className="truncate font-mono tabular-nums text-slate-600">
            {dl.panjang}
          </span>
          <span
            className={`shrink-0 font-mono font-semibold tabular-nums ${
              comp.biaya === 0 ? 'text-emerald-700' : 'text-slate-900'
            }`}
          >
            {comp.biaya === 0 ? 'Gratis' : `Rp ${comp.biaya.toLocaleString('id-ID')}`}
          </span>
        </div>
      </div>
    </article>
  )
}
