import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CalendarDots, Tag, Wallet, ArrowLeft, ArrowSquareOut, UsersThree } from '@phosphor-icons/react/dist/ssr'
import { ReportButton } from '@/components/ui/ReportButton'
import { FavoriteButton } from './FavoriteButton'
import { DeleteCompetitionButton } from './DeleteCompetitionButton'
import { SlotBar } from '@/components/ui/SlotBar'
import { PageContainer, StatusPill } from '@/components/ui/Page'

function sisaHari(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days <= 0) return { label: 'Hari ini', utama: true }
  if (days === 1) return { label: '1 hari', utama: true }
  return { label: `${days} hari`, utama: days <= 7 }
}

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
  const sisa = sisaHari(comp.deadline)
  const poster = comp.poster_url ?? `https://picsum.photos/seed/${encodeURIComponent(comp.judul)}/960/720`

  return (
    <PageContainer width="wide">
      {/* Breadcrumb */}
      <nav aria-label="Jejak navigasi" className="mb-4 text-sm text-slate-500">
        <Link href="/lomba" className="inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-indigo-600">
          <ArrowLeft size={16} />
          Semua lomba
        </Link>
      </nav>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* KOLOM KIRI: poster sticky di desktop */}
        <aside className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:sticky lg:top-24">
            <div className="aspect-[4/3] bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster}
                alt={`Poster ${comp.judul}`}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Bar status di bawah poster: deadline mono + biaya */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 text-sm">
              <div className="p-4">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <CalendarDots size={14} />
                  Deadline
                </p>
                <p className={`mt-1 font-mono text-lg font-bold ${sisa.utama ? 'text-rose-600' : 'text-slate-900'}`}>
                  {sisa.label}
                </p>
                <p className="text-[11px] text-slate-500">
                  {new Date(comp.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="p-4">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Wallet size={14} />
                  Biaya
                </p>
                <p className={`mt-1 font-mono text-lg font-bold ${comp.biaya === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {comp.biaya === 0 ? 'Gratis' : `${Math.round(comp.biaya / 1000)}rb`}
                </p>
                <p className="text-[11px] text-slate-500">
                  {comp.biaya === 0 ? 'tanpa pendaftaran' : `Rp ${comp.biaya.toLocaleString('id-ID')}`}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* KOLOM KANAN: konten utama */}
        <div className="space-y-6 lg:col-span-7">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {comp.kategori && (
                    <StatusPill tone="indigo">
                      <Tag size={12} weight="bold" className="mr-0.5" />
                      {comp.kategori}
                    </StatusPill>
                  )}
                  {comp.tingkat && <StatusPill tone="gray">{comp.tingkat}</StatusPill>}
                  {comp.publish_status === 'pending' && <StatusPill tone="yellow">Menunggu persetujuan</StatusPill>}
                  {comp.publish_status === 'draft' && <StatusPill tone="gray">Draft</StatusPill>}
                  {isExpired ? (
                    <StatusPill tone="red">Deadline lewat</StatusPill>
                  ) : (
                    <StatusPill tone="green">Pendaftaran aktif</StatusPill>
                  )}
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {comp.judul}
                </h1>
                {comp.penyelenggara && (
                  <p className="mt-1.5 text-sm font-medium text-slate-600">
                    Diselenggarakan oleh {comp.penyelenggara}
                  </p>
                )}
              </div>
              {user && comp.publish_status === 'published' && <ReportButton targetType="competition" targetId={comp.id} />}
            </div>

            {comp.deskripsi && (
              <div className="mt-6 border-t border-slate-100 pt-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Deskripsi</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {comp.deskripsi}
                </p>
              </div>
            )}

            {/* Aksi utama */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
              <a
                href={comp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
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
                  className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                >
                  Buka Rekrutmen Tim
                </Link>
              )}
            </div>
            {isModerator && (
              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                <Link
                  href={`/lomba/${comp.id}/edit`}
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                >
                  Edit lomba
                </Link>
                <DeleteCompetitionButton competitionId={comp.id} judul={comp.judul} />
              </div>
            )}
          </article>

          {/* Tim terkait */}
          <section aria-labelledby="tim-terkait">
            <h2 id="tim-terkait" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
              <UsersThree size={20} weight="duotone" className="text-indigo-600" />
              Tim yang mencari anggota
            </h2>
            {posts && posts.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3">
                {posts.map((p) => {
                  const owner = Array.isArray(p.users) ? p.users[0] : p.users
                  return (
                    <Link
                      key={p.id}
                      href={`/tim/${p.id}`}
                      className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-1 text-base font-bold text-slate-900">{p.judul}</h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                          oleh {(owner as { nama?: string })?.nama ?? 'Anonim'}
                        </p>
                      </div>
                      <div className="w-full max-w-[200px] shrink-0">
                        <SlotBar terisi={p.slot_terisi} total={p.slot_total} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center">
                <p className="text-sm font-semibold text-slate-800">Belum ada tim untuk lomba ini</p>
                <p className="mt-1 text-xs text-slate-500">Jadilah yang pertama membuka slot anggota.</p>
                {!isExpired && (
                  <Link href={`/tim/baru?lomba=${comp.id}`} className="mt-4 inline-flex min-h-[44px] items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                    Buka rekrutmen
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  )
}
