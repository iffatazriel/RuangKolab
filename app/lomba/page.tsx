import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import Link from 'next/link'
import { CalendarDots, Tag, Wallet } from '@phosphor-icons/react/dist/ssr'
import { LombaFilter } from './LombaFilter'
import { PageContainer, PageHeader, PrimaryLink, EmptyState } from '@/components/ui/Page'
import { AnimateGrid, GridItem } from '@/components/motion/AppMotion'

interface SearchParams { q?: string; kategori?: string; tingkat?: string; biaya?: string; deadline?: string }

function deadlineLabel(iso: string) {
  const diffMs = new Date(iso).getTime() - Date.now()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Hari ini'
  if (days === 1) return '1 hari lagi'
  if (days <= 14) return `${days} hari lagi`
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
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
    .order('deadline', { ascending: true })

  if (sp.q) query = query.ilike('judul', `%${sp.q}%`)
  if (sp.kategori) query = query.eq('kategori', sp.kategori)
  if (sp.tingkat) query = query.eq('tingkat', sp.tingkat)
  if (sp.biaya === 'gratis') query = query.eq('biaya', 0)
  if (sp.biaya === 'berbayar') query = query.gt('biaya', 0)
  const days = sp.deadline ? parseInt(sp.deadline, 10) : NaN
  if (!Number.isNaN(days) && days > 0) {
    const until = new Date(new Date(now).getTime() + days * 24 * 60 * 60 * 1000).toISOString()
    query = query.lte('deadline', until)
  }

  const { data: competitions } = await query.limit(50)

  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
  }

  const action = isAdmin ? (
    <PrimaryLink href="/lomba/baru">+ Tambah Lomba</PrimaryLink>
  ) : user ? (
    <PrimaryLink href="/lomba/usul" variant="outline">+ Usulkan Lomba</PrimaryLink>
  ) : null

  const hasFilter = !!(sp.q || sp.kategori || sp.tingkat || sp.biaya || sp.deadline)

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Lomba"
        description="Lomba kampus yang masih membuka pendaftaran, urut dari deadline terdekat."
        action={action}
      />

      <Suspense>
        <LombaFilter />
      </Suspense>

      {!competitions || competitions.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={hasFilter ? 'Tidak ada lomba yang cocok' : 'Belum ada lomba aktif'}
            description={
              hasFilter
                ? 'Coba ubah filter atau kata kunci pencarian.'
                : 'Ketahui lomba yang belum terdaftar di sini? Usulkan agar temanmu ikut serta.'
            }
            action={
              hasFilter ? undefined : (
                <PrimaryLink href="/lomba/usul" variant="outline">+ Usulkan Lomba</PrimaryLink>
              )
            }
          />
        </div>
      ) : (
        <div className="mt-6">
          <AnimateGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((c) => (
              <GridItem key={c.id}>
                <Link
                  href={`/lomba/${c.id}`}
                  className="surface-card group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                >
                  <div className="aspect-[2/1] overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.poster_url ?? `https://picsum.photos/seed/${encodeURIComponent(c.judul)}/800/500`}
                      alt={c.judul}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        <Tag size={12} weight="bold" />
                        {c.kategori ?? 'Umum'}
                      </span>
                      <span className="text-xs font-semibold text-rose-600">{deadlineLabel(c.deadline)}</span>
                    </div>
                    <h2 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600">
                      {c.judul}
                    </h2>
                    {c.penyelenggara && <p className="mt-1 line-clamp-1 text-xs text-slate-500">{c.penyelenggara}</p>}
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDots size={14} />
                        {new Date(c.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`inline-flex items-center gap-1 font-semibold ${c.biaya === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        <Wallet size={14} />
                        {c.biaya === 0 ? 'Gratis' : `Rp ${c.biaya.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  </div>
                </Link>
              </GridItem>
            ))}
          </AnimateGrid>
        </div>
      )}
    </PageContainer>
  )
}
