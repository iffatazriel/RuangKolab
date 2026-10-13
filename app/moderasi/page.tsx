import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ResolveReportButton } from './ResolveReportButton'
import { ProposalButtons } from './ProposalButtons'
import { FadeIn } from '@/components/motion/AppMotion'
import { PageContainer, PageHeader, PrimaryLink, Card, EmptyState, StatusPill } from '@/components/ui/Page'

function reportHref(targetType: string, targetId: string) {
  if (targetType === 'competition') return `/lomba/${targetId}`
  if (targetType === 'user') return `/pengguna/${targetId}`
  return `/tim/${targetId}`
}

export default async function ModerasiPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/masuk')

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'moderator'].includes(profile.role)) redirect('/')

  const { data: reports } = await supabase
    .from('reports')
    .select('id, target_type, target_id, alasan, status, created_at, reporter_id')
    .order('created_at', { ascending: false })
    .limit(100)

  const { data: proposalData } = await supabase
    .from('competitions')
    .select('id, judul, penyelenggara, kategori, tingkat, deadline, url')
    .eq('publish_status', 'pending')
    .order('created_at', { ascending: true })
  const proposals = proposalData ?? []

  const pendingReports = (reports ?? []).filter((r) => r.status === 'pending')
  const resolvedReports = (reports ?? []).filter((r) => r.status !== 'pending')

  return (
    <PageContainer>
      <PageHeader
        title="Panel Moderasi"
        description="Tinjau usulan lomba dan laporan dari pengguna."
        action={profile.role === 'admin' ? <PrimaryLink href="/lomba/baru">+ Tambah Lomba</PrimaryLink> : null}
      />

      {/* Usulan Lomba */}
      <section>
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          Usulan Lomba <span className="text-stone-400">({proposals.length})</span>
        </h2>
        {proposals.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Tidak ada usulan yang menunggu" />
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {proposals.map((c) => (
              <FadeIn key={c.id}>
                <Card className="flex flex-wrap items-start justify-between gap-4 border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/40">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {c.kategori && <StatusPill tone="indigo">{c.kategori}</StatusPill>}
                      {c.tingkat && <StatusPill>{c.tingkat}</StatusPill>}
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        Deadline {new Date(c.deadline).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-stone-900 dark:text-stone-100">{c.judul}</p>
                    {c.penyelenggara && <p className="text-xs text-stone-500 dark:text-stone-400">{c.penyelenggara}</p>}
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-[44px] items-center text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
                      Cek tautan resmi →
                    </a>
                  </div>
                  <ProposalButtons competitionId={c.id} />
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      {/* Laporan Pending */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          Laporan Menunggu <span className="text-stone-400">({pendingReports.length})</span>
        </h2>
        {pendingReports.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Tidak ada laporan yang perlu ditinjau" />
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {pendingReports.map((r) => (
              <Card key={r.id} className="flex flex-wrap items-start justify-between gap-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusPill tone="yellow">{r.target_type}</StatusPill>
                    <span className="text-xs text-stone-500 dark:text-stone-400">{new Date(r.created_at).toLocaleString('id-ID')}</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-800 dark:text-stone-200">{r.alasan}</p>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    Target:{' '}
                    <Link href={reportHref(r.target_type, r.target_id)} className="font-medium text-brand-600 dark:text-brand-400 hover:underline">
                      {r.target_id.slice(0, 8)}…
                    </Link>
                  </p>
                </div>
                <ResolveReportButton reportId={r.id} targetType={r.target_type} targetId={r.target_id} />
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Riwayat */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Riwayat Laporan</h2>
        {resolvedReports.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Belum ada laporan selesai" />
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {resolvedReports.map((r) => (
              <Card key={r.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                <span className="line-clamp-1 text-stone-700 dark:text-stone-300">{r.alasan}</span>
                <StatusPill tone={r.status === 'resolved' ? 'green' : 'gray'}>
                  {r.status === 'resolved' ? 'Selesai' : 'Ditinjau'}
                </StatusPill>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  )
}
