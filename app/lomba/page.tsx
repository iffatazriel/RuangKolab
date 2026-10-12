import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import Link from 'next/link'
import { LombaFilter } from './LombaFilter'
import { PageContainer, PageHeader, PrimaryLink, EmptyState, StatusPill } from '@/components/ui/Page'

interface SearchParams { q?: string; kategori?: string; tingkat?: string; biaya?: string; deadline?: string }

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
        <EmptyState title="Belum ada lomba yang cocok" description="Coba ubah filter atau kata kunci pencarian." />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {competitions.map((c) => (
            <Link
              key={c.id}
              href={`/lomba/${c.id}`}
              className="group flex flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-semibold tracking-wider text-indigo-600 uppercase">{c.kategori ?? 'Umum'}</p>
                {c.biaya === 0 ? <StatusPill tone="green">Gratis</StatusPill> : <StatusPill tone="yellow">Berbayar</StatusPill>}
              </div>
              <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold leading-snug text-slate-900 group-hover:text-indigo-600">
                {c.judul}
              </h3>
              {c.penyelenggara && <p className="mt-1 text-xs text-slate-500">{c.penyelenggara}</p>}
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>
                  Deadline{' '}
                  <span className="font-medium text-slate-700">
                    {new Date(c.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </span>
                {c.tingkat && <StatusPill tone="indigo">{c.tingkat}</StatusPill>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
