import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ReportButton } from '@/components/ui/ReportButton'
import { FavoriteButton } from './FavoriteButton'
import { DeleteCompetitionButton } from './DeleteCompetitionButton'
import { PageContainer, StatusPill } from '@/components/ui/Page'

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

  return (
    <PageContainer width="medium">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {comp.kategori && <StatusPill tone="indigo">{comp.kategori}</StatusPill>}
              {comp.tingkat && <StatusPill tone="gray">{comp.tingkat}</StatusPill>}
              {comp.publish_status === 'pending' && <StatusPill tone="yellow">Menunggu Persetujuan</StatusPill>}
              {comp.publish_status === 'draft' && <StatusPill tone="gray">Draft</StatusPill>}
              {isExpired ? (
                <StatusPill tone="red">Deadline Lewat</StatusPill>
              ) : (
                <StatusPill tone="green">Pendaftaran Aktif</StatusPill>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {comp.judul}
            </h1>
            {comp.penyelenggara && (
              <p className="mt-1 text-sm font-medium text-slate-600">
                Diselenggarakan oleh {comp.penyelenggara}
              </p>
            )}
          </div>
          {user && comp.publish_status === 'published' && <ReportButton targetType="competition" targetId={comp.id} />}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-xs font-medium text-slate-500">Batas Deadline</p>
            <p className="mt-1 font-semibold text-slate-900">
              {new Date(comp.deadline).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Biaya Pendaftaran</p>
            <p className="mt-1 font-semibold text-slate-900">
              {comp.biaya === 0 ? 'Gratis' : `Rp ${comp.biaya.toLocaleString('id-ID')}`}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Tingkat Lomba</p>
            <p className="mt-1 font-semibold text-slate-900">{comp.tingkat ?? 'Umum'}</p>
          </div>
        </div>

        {comp.deskripsi && (
          <div className="mt-8">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Deskripsi Lomba</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
              {comp.deskripsi}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
          <a
            href={comp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            Buka Halaman Resmi
          </a>
          {user && comp.publish_status === 'published' && (
            <FavoriteButton competitionId={comp.id} initiallySaved={isSaved} judul={comp.judul} />
          )}
          {user && !isExpired && comp.publish_status === 'published' && (
            <Link
              href={`/tim/baru?lomba=${comp.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
            >
              + Buka Tim Lomba
            </Link>
          )}
          {isModerator && (
            <Link
              href={`/lomba/${comp.id}/edit`}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
            >
              Edit
            </Link>
          )}
          {isModerator && (
            <DeleteCompetitionButton competitionId={comp.id} judul={comp.judul} />
          )}
        </div>
      </div>

      {/* Team posts under this competition */}
      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Postingan Tim untuk Lomba Ini</h2>
        {posts && posts.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {posts.map((p) => {
              const owner = Array.isArray(p.users) ? p.users[0] : p.users
              return (
                <Link
                  key={p.id}
                  href={`/tim/${p.id}`}
                  className="surface-card flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
                >
                  <h3 className="line-clamp-2 text-base font-bold text-slate-900">{p.judul}</h3>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span>oleh {(owner as { nama?: string })?.nama ?? 'Anonim'}</span>
                    <span className="font-semibold text-slate-700">Slot {p.slot_terisi}/{p.slot_total}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Belum ada mahasiswa yang membuka pencarian tim untuk lomba ini.</p>
        )}
      </section>
    </PageContainer>
  )
}
