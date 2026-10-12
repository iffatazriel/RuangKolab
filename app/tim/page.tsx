import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import { TimFilter } from './TimFilter'
import { PageContainer, PageHeader, PrimaryLink, EmptyState, StatusPill } from '@/components/ui/Page'

interface SearchParams { keahlian?: string; q?: string }

export default async function TimPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const supabase = await createClient()

  // Filter keahlian (F-21): ambil post_id yang punya skill terpilih lebih dulu
  let postIdFilter: string[] | null = null
  if (sp.keahlian) {
    const { data: matched } = await supabase
      .from('post_skills')
      .select('post_id')
      .eq('skill_id', sp.keahlian)
    postIdFilter = (matched ?? []).map((m) => m.post_id)
  }

  let query = supabase
    .from('team_posts')
    .select(`
      id, judul, deskripsi, slot_total, slot_terisi, status, created_at,
      users(id, nama, jurusan),
      competitions(id, judul, kategori, deadline)
    `)
    .eq('tipe', 'competition')
    .in('status', ['open', 'full'])
    .order('created_at', { ascending: false })

  if (sp.q) query = query.ilike('judul', `%${sp.q}%`)
  if (postIdFilter) {
    query = query.in('id', postIdFilter.length > 0 ? postIdFilter : ['00000000-0000-0000-0000-000000000000'])
  }

  const { data: posts } = await query.limit(50)

  const { data: skills } = await supabase.from('skills').select('id, nama').order('nama')
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <PageContainer>
      <PageHeader
        title="Cari Tim Lomba"
        description="Postingan tim yang sedang mencari anggota untuk lomba tertentu."
        action={user ? <PrimaryLink href="/tim/baru">+ Buat Postingan Tim</PrimaryLink> : null}
      />

      <Suspense>
        <TimFilter allSkills={skills ?? []} />
      </Suspense>

      {!posts || posts.length === 0 ? (
        <EmptyState title="Belum ada postingan tim" description="Jadilah yang pertama membuka pencarian tim." />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => {
            const owner = Array.isArray(p.users) ? p.users[0] : p.users
            const comp = Array.isArray(p.competitions) ? p.competitions[0] : p.competitions
            const compTyped = comp as { judul?: string } | null
            return (
              <Link
                key={p.id}
                href={`/tim/${p.id}`}
                className="group flex flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {compTyped?.judul && (
                  <p className="truncate text-[11px] font-semibold tracking-wider text-indigo-600 uppercase">{compTyped.judul}</p>
                )}
                <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold leading-snug text-slate-900 group-hover:text-indigo-600">
                  {p.judul}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.deskripsi}</p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span>oleh <span className="font-medium text-slate-700">{(owner as { nama?: string })?.nama ?? 'Anonim'}</span></span>
                  <span className="flex items-center gap-2">
                    Slot {p.slot_terisi}/{p.slot_total}
                    {p.status === 'full' && <StatusPill tone="red">Penuh</StatusPill>}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
