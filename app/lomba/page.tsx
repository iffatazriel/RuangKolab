import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import { Trophy } from '@phosphor-icons/react/dist/ssr'
import { LombaFilter } from './LombaFilter'
import { CompetitionCard, type CompetitionCardData } from '@/components/ui/CompetitionCard'
import { CardGridMotion, CardGridItem } from '@/components/motion/AppMotion'
import { TiltCard } from '@/components/motion/TiltCard'
import { PageContainer, PageHeader, PrimaryLink } from '@/components/ui/Page'

interface SearchParams {
  q?: string
  kategori?: string
  tingkat?: string
  biaya?: string
  deadline?: string
  urut?: string
}

export default async function LombaPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const supabase = await createClient()
  const now = new Date().toISOString()

  let query = supabase
    .from('competitions')
    .select('id, judul, penyelenggara, kategori, tingkat, deadline, biaya, poster_url')
    .eq('publish_status', 'published')
    .gte('deadline', now)

  if (sp.q) query = query.ilike('judul', `%${sp.q}%`)
  if (sp.kategori) query = query.eq('kategori', sp.kategori)
  if (sp.tingkat) query = query.eq('tingkat', sp.tingkat)
  if (sp.biaya === 'gratis') query = query.eq('biaya', 0)
  if (sp.biaya === 'berbayar') query = query.gt('biaya', 0)
  const days = sp.deadline ? parseInt(sp.deadline, 10) : NaN
  if (!Number.isNaN(days) && days > 0) {
    const until = new Date(now).getTime() + days * 24 * 60 * 60 * 1000
    query = query.lte('deadline', new Date(until).toISOString())
  }

  // Urutan: deadline terdekat (default) atau terbaru
  query = sp.urut === 'terbaru' ? query.order('created_at', { ascending: false }) : query.order('deadline', { ascending: true })

  const { data: competitions, error } = await query.limit(50)

  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
  }

  // Sinyal tim: jumlah team_posts berstatus open per lomba, dikumpulkan sekali
  const ids = (competitions ?? []).map((c) => c.id)
  const timMap: Record<string, number> = {}
  if (ids.length > 0) {
    const { data: openPosts } = await supabase
      .from('team_posts')
      .select('id, competition_id')
      .eq('tipe', 'competition')
      .eq('status', 'open')
      .in('competition_id', ids)
    for (const p of openPosts ?? []) {
      if (p.competition_id) timMap[p.competition_id] = (timMap[p.competition_id] ?? 0) + 1
    }
  }

  const hasFilter = !!(sp.q || sp.kategori || sp.tingkat || sp.biaya || sp.deadline)
  const list = competitions ?? []

  const action = isAdmin ? (
    <PrimaryLink href="/lomba/baru">+ Tambah Lomba</PrimaryLink>
  ) : user ? (
    <PrimaryLink href="/lomba/usul" variant="outline">+ Usulkan Lomba</PrimaryLink>
  ) : null

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Lomba"
        description="Lomba kampus yang masih membuka pendaftaran, urut dari deadline terdekat."
        action={action}
      />

      <Suspense>
        <LombaFilter resultCount={list.length} />
      </Suspense>

      {/* STATE ERROR: inline dengan coba lagi */}
      {error && (
        <div role="alert" className="mt-6 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-6 text-center">
          <p className="font-semibold text-rose-800 dark:text-rose-400">Gagal memuat daftar lomba</p>
          <p className="mt-1 text-sm text-rose-700 dark:text-rose-400">Periksa koneksimu lalu coba lagi.</p>
          <Link href="/lomba" className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98]">
            Coba lagi
          </Link>
        </div>
      )}

      {/* STATE KOSONG */}
      {!error && list.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-[var(--card-bg)] px-6 py-12 text-center">
          {/* TODO: generate/replace ilustrasi flat-style untuk empty state "belum ada lomba" */}
          <div aria-hidden="true" className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
            <Trophy size={48} weight="duotone" aria-hidden="true" />
          </div>
          <p className="font-semibold text-stone-800 dark:text-stone-200">
            {hasFilter ? 'Belum ada lomba yang cocok dengan filter ini.' : 'Belum ada lomba aktif.'}
          </p>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {hasFilter ? 'Coba longgarkan kata kunci atau rentang waktunya.' : 'Ketahui lomba yang belum terdaftar? Usulkan agar temanmu ikut serta.'}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {hasFilter ? (
              <Link href="/lomba" className="inline-flex min-h-[44px] items-center rounded-[10px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-2.5 text-sm font-semibold text-stone-700 dark:text-stone-300 transition hover:bg-stone-50 dark:hover:bg-stone-900 active:scale-[0.98]">
                Hapus filter
              </Link>
            ) : null}
            {!user ? null : hasFilter ? null : (
              <Link href="/lomba/usul" className="inline-flex min-h-[44px] items-center rounded-[10px] border border-brand-600 px-4 py-2.5 text-sm font-semibold text-brand-600 dark:text-brand-400 transition hover:bg-brand-50 dark:hover:bg-brand-950 dark:hover:bg-brand-950 active:scale-[0.98]">
                Usulkan Lomba
              </Link>
            )}
          </div>
        </div>
      )}

      {/* DAFTAR */}
      {!error && list.length > 0 && (
        <CardGridMotion className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => (
            <CardGridItem key={c.id}>
              <TiltCard className="h-full">
                <CompetitionCard
                  comp={c as CompetitionCardData}
                  timMencari={timMap[c.id] ?? 0}
                  priority={i < 3}
                />
              </TiltCard>
            </CardGridItem>
          ))}
        </CardGridMotion>
      )}
    </PageContainer>
  )
}
