import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import { ProyekFilter } from './ProyekFilter'
import { PageContainer, PageHeader, PrimaryLink, EmptyState, StatusPill } from '@/components/ui/Page'
import { AnimateGrid, GridItem } from '@/components/motion/AppMotion'

interface SearchParams { keahlian?: string; q?: string }

export default async function ProyekPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const supabase = await createClient()

  // Filter keahlian (F-32): ambil post_id yang punya skill tersebut lebih dulu
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
      users(nama, jurusan)
    `)
    .eq('tipe', 'project')
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
        title="Proyek Kolaborasi"
        description="Proyek mahasiswa yang mencari kolaborator, tidak terikat lomba tertentu."
        action={user ? <PrimaryLink href="/proyek/baru">+ Buat Proyek</PrimaryLink> : null}
      />

      <Suspense>
        <ProyekFilter allSkills={skills ?? []} />
      </Suspense>

      {!posts || posts.length === 0 ? (
        <EmptyState title="Belum ada proyek kolaborasi" description="Mulai proyekmu dan cari kolaborator yang tepat." />
      ) : (
        <div className="mt-6">
          <AnimateGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => {
              const owner = Array.isArray(p.users) ? p.users[0] : p.users
              return (
                <GridItem key={p.id}>
                  <Link
                    href={`/proyek/${p.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-indigo-600">
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
                </GridItem>
              )
            })}
          </AnimateGrid>
        </div>
      )}
    </PageContainer>
  )
}
