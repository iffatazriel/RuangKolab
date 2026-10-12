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
  /** Tampilkan deadline sebagai pill kaca di atas poster (khusus kartu hero). */
  overlayGlass?: boolean
}

/**
 * Fallback poster minimalis: latar polos dengan monogram kategori.
 * Satu aksen, tanpa pola ramai, tanpa SVG ilustrasi.
 */
export function PosterFallback({ kategori }: { kategori: string | null }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-stone-100 dark:bg-stone-800" aria-hidden="true">
      <span className="font-mono text-base font-bold uppercase tracking-widest text-brand-300">
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
export function CompetitionCard({ comp, timMencari = 0, priority = false, overlayGlass = false }: Props) {
  const dl = getDeadlineTone(comp.deadline)
  const poster = comp.poster_url

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 bg-[var(--card-bg)] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-stone-300 dark:hover:border-stone-700 motion-safe:hover:-translate-y-[3px] focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2">
      {/* Poster: rasio tetap, object-top karena judul poster umumnya di atas */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
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
        {/* web glass approximation - bukan Apple Liquid Glass resmi.
           Pill kaca deadline di atas foto, hanya untuk kartu hero. */}
        {overlayGlass && (
          <span className="glass-pill absolute bottom-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 py-1 font-mono text-xs font-semibold tabular-nums text-white backdrop-blur-[12px]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white/80" />
            {dl.pendek}
          </span>
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
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
            {comp.kategori ?? 'Umum'}
          </span>
          <span className={`shrink-0 font-mono text-xs font-semibold tabular-nums ${deadlineToneClass[dl.tone]}`}>
            {dl.pendek}
          </span>
        </div>

        {/* Judul: elemen terbesar setelah poster */}
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900 dark:text-slate-100">
          {comp.judul}
        </h3>

        {/* Badge urgensi penuh: hanya saat deadline 7 hari atau kurang */}
        {dl.tone !== 'netral' && (
          <p
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold tabular-nums ${
              dl.tone === 'kuat'
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dl.tone === 'kuat' ? 'bg-rose-500' : 'bg-amber-500'}`} />
            Pendaftaran tutup {dl.pendek.toLowerCase()}
          </p>
        )}

        {/* Penyelenggara: 13px kontras AA */}
        {comp.penyelenggara && (
          <p className="truncate text-xs leading-snug text-stone-700 dark:text-stone-300">
            {comp.penyelenggara}
          </p>
        )}

        {/* Sinyal tim: hanya jika ada yang membuka */}
        {timMencari > 0 && (
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 dark:text-brand-300">
            <UsersThree size={14} weight="fill" aria-hidden="true" />
            {timMencari} tim mencari anggota
          </p>
        )}

        {/* Footer sejajar antar kartu: tanggal lengkap mono, biaya */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800 pt-2.5 text-xs">
          <span className="truncate font-mono tabular-nums text-stone-600 dark:text-stone-400">
            {dl.panjang}
          </span>
          <span
            className={`shrink-0 font-mono font-semibold tabular-nums ${
              comp.biaya === 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-900 dark:text-stone-100'
            }`}
          >
            {comp.biaya === 0 ? 'Gratis' : `Rp ${comp.biaya.toLocaleString('id-ID')}`}
          </span>
        </div>
      </div>
    </article>
  )
}
