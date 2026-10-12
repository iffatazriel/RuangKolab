import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowSquareOut, UsersThree } from '@phosphor-icons/react/dist/ssr'
import { ReportButton } from '@/components/ui/ReportButton'
import { FavoriteButton } from './FavoriteButton'
import { DeleteCompetitionButton } from './DeleteCompetitionButton'
import { SlotBar } from '@/components/ui/SlotBar'
import { PageContainer, StatusPill } from '@/components/ui/Page'
import { PosterFallback } from '@/components/ui/CompetitionCard'
import { getDeadlineTone } from '@/lib/deadline'

export default async function LombaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: comp } = await supabase
    .from('competitions')
    .select('*')
    .eq('id', id)
    .single()

  const { data: { user } } = await supabase.auth.getUser()

  if (!comp) return notFound()
  let isModerator = false
  if (user) {
    const { data: p } = await supabase.from('users').select('role').eq('id', user.id).single()
    isModerator = p?.role === 'admin' || p?.role === 'moderator'
  }
  if (comp.publish_status !== 'published' && !isModerator && comp.created_by !== user?.id) {
    return notFound()
  }

  const { data: posts } = await supabase
    .from('team_posts')
    .select('id, judul, slot_total, slot_terisi, status, owner_id, users(nama)')
    .eq('competition_id', id)
    .in('status', ['open', 'full'])
    .order('created_at', { ascending: false })

  let isSaved = false
  if (user) {
    const { data: fav } = await supabase
      .from('competition_favorites')
      .select('competition_id')
      .eq('user_id', user.id)
      .eq('competition_id', id)
      .maybeSingle()
    isSaved = !!fav
  }

  const isExpired = new Date(comp.deadline) < new Date()
  const dl = getDeadlineTone(comp.deadline)
  const poster = comp.poster_url

  return (
    <PageContainer width="wide">
      <nav aria-label="Jejak navigasi" className="mb-5 text-sm text-stone-500 dark:text-stone-400">
        <Link href="/lomba" className="inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-brand-700 dark:hover:text-brand-300">
          <ArrowLeft size={16} />
          Semua lomba
        </Link>
      </nav>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* KIRI: poster sticky, tanpa kotak statistik (fakta pindah ke kanan) */}
        <aside className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 bg-[var(--card-bg)] lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-800">
              {poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={poster}
                  alt={`Poster ${comp.judul}`}
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              ) : (
                <PosterFallback kategori={comp.kategori} />
              )}
            </div>
          </div>
        </aside>

        {/* KANAN: fakta sebagai baris teks, bukan kartu */}
        <div className="lg:col-span-7">
          <article>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-stone-500 dark:text-stone-400">
                  {comp.kategori ?? 'Umum'} Â· {comp.tingkat ?? 'Umum'}
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl">
                  {comp.judul}
                </h1>
                {comp.penyelenggara && (
                  <p className="mt-1.5 text-sm text-stone-700 dark:text-stone-300">
                    Diselenggarakan oleh {comp.penyelenggara}
                  </p>
                )}
              </div>
              {user && comp.publish_status === 'published' && <ReportButton targetType="competition" targetId={comp.id} />}
            </div>

            {/* Status: hanya bila luar biasa (pending/draft/kedaluwarsa) */}
            {(comp.publish_status !== 'published' || isExpired) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {comp.publish_status === 'pending' && <StatusPill tone="yellow">Menunggu persetujuan</StatusPill>}
                {comp.publish_status === 'draft' && <StatusPill tone="gray">Draft</StatusPill>}
                {isExpired && <StatusPill tone="red">Deadline lewat</StatusPill>}
              </div>
            )}

            {/* Fakta kunci: tiga baris teks, mono untuk angka */}
            <dl className="mt-6 flex flex-col divide-y divide-stone-100 dark:divide-stone-800 border-y border-stone-100 dark:border-stone-800 text-sm">
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-stone-500 dark:text-stone-400">Deadline</dt>
                <dd className="text-right">
                  <span className={`font-mono font-semibold tabular-nums ${dl.tone === 'kuat' ? 'text-rose-700 dark:text-rose-400' : 'text-stone-900 dark:text-stone-100'}`}>
                    {dl.pendek}
                  </span>
                  <span className="block text-xs text-stone-500 dark:text-stone-400">{dl.panjang}</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-stone-500 dark:text-stone-400">Biaya pendaftaran</dt>
                <dd className={`font-mono font-semibold tabular-nums ${comp.biaya === 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-900 dark:text-stone-100'}`}>
                  {comp.biaya === 0 ? 'Gratis' : `Rp ${comp.biaya.toLocaleString('id-ID')}`}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-stone-500 dark:text-stone-400">Tingkat</dt>
                <dd className="font-medium text-stone-900 dark:text-stone-100">{comp.tingkat ?? 'Umum'}</dd>
              </div>
            </dl>

            {comp.deskripsi && (
              <div className="mt-6">
                <p className="whitespace-pre-line text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                  {comp.deskripsi}
                </p>
              </div>
            )}

            {/* CTA utama */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={comp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[10px] bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]"
              >
                Buka Halaman Resmi
                <ArrowSquareOut size={18} weight="bold" />
              </a>
              {user && comp.publish_status === 'published' && (
                <FavoriteButton competitionId={comp.id} initiallySaved={isSaved} judul={comp.judul} />
              )}
              {user && !isExpired && comp.publish_status === 'published' && (
                <Link
                  href={`/tim/baru?lomba=${comp.id}`}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-[10px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-700 dark:text-stone-300 transition hover:bg-stone-50 dark:hover:bg-stone-900 active:scale-[0.98]"
                >
                  Buka Rekrutmen Tim
                </Link>
              )}
            </div>
            {isModerator && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/lomba/${comp.id}/edit`}
                  className="inline-flex min-h-[44px] items-center rounded-[10px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-300 transition hover:bg-stone-50 dark:hover:bg-stone-900 active:scale-[0.98]"
                >
                  Edit lomba
                </Link>
                <DeleteCompetitionButton competitionId={comp.id} judul={comp.judul} />
              </div>
            )}
          </article>

          {/* Tim terkait */}
          <section aria-labelledby="tim-terkait" className="mt-12">
            <h2 id="tim-terkait" className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Tim yang mencari anggota
            </h2>
            {posts && posts.length > 0 ? (
              <ul className="mt-4 flex flex-col divide-y divide-stone-100 dark:divide-stone-800 border-y border-stone-100 dark:border-stone-800">
                {posts.map((p) => {
                  const owner = Array.isArray(p.users) ? p.users[0] : p.users
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/tim/${p.id}`}
                        className="group flex flex-wrap items-center justify-between gap-4 py-4 transition-colors active:scale-[0.99]"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-1 text-[15px] font-semibold text-stone-900 dark:text-stone-100 transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-300">
                            {p.judul}
                          </h3>
                          <p className="mt-0.5 text-[13px] text-stone-500 dark:text-stone-400">
                            oleh {(owner as { nama?: string })?.nama ?? 'Anonim'}
                          </p>
                        </div>
                        <div className="w-full max-w-[200px] shrink-0">
                          <SlotBar terisi={p.slot_terisi} total={p.slot_total} />
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 px-5 py-6">
                <UsersThree size={22} className="shrink-0 text-stone-400" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-300">Belum ada tim untuk lomba ini</p>
                  {!isExpired && (
                    <Link href={`/tim/baru?lomba=${comp.id}`} className="mt-0.5 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-700 dark:text-brand-300 hover:underline">
                      Jadilah yang pertama membuka slot
                    </Link>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  )
}
