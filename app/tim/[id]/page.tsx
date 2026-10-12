import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ReportButton } from '@/components/ui/ReportButton'
import { DeletePostButton } from '@/components/ui/DeletePostButton'
import { AjukanGabungForm } from './AjukanGabungForm'
import { ManageRequests } from './ManageRequests'
import { PageContainer, StatusPill } from '@/components/ui/Page'
import { ContactCard } from '@/components/ui/ContactCard'
import { SlotBar } from '@/components/ui/SlotBar'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

export default async function TimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('team_posts')
    .select(`
      id, tipe, judul, deskripsi, slot_total, slot_terisi, status, created_at, owner_id,
      users(id, nama, jurusan, angkatan, bio),
      competitions(id, judul, kategori, deadline, url)
    `)
    .eq('id', id)
    .single()

  if (!post) return notFound()

  const { data: skillsData } = await supabase
    .from('post_skills')
    .select('skills(id, nama)')
    .eq('post_id', id)

  const requiredSkills = (skillsData ?? [])
    .map((s) => (Array.isArray(s.skills) ? s.skills[0] : s.skills))
    .filter(Boolean) as { id: string; nama: string }[]

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === post.owner_id

  let userRequest: { id: string; status: string } | null = null
  let ownerContact: string | null = null
  let acceptedMembers: { id: string; user_id: string; status: string; pesan: string | null; nama: string; jurusan: string; whatsapp?: string }[] = []

  if (user) {
    const { data: req } = await supabase
      .from('join_requests')
      .select('id, status')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    userRequest = req

    if (req?.status === 'accepted') {
      const { data: c } = await supabase
        .from('user_contacts')
        .select('whatsapp')
        .eq('user_id', post.owner_id)
        .maybeSingle()
      ownerContact = c?.whatsapp ?? null
    }

    if (isOwner) {
      const { data: reqs } = await supabase
        .from('join_requests')
        .select(`
          id, status, pesan, created_at, user_id,
          users(nama, jurusan, angkatan)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: false })

      const acceptedIds = (reqs ?? []).filter((r) => r.status === 'accepted').map((r) => r.user_id)
      let contactsMap: Record<string, string> = {}
      if (acceptedIds.length > 0) {
        const { data: contacts } = await supabase
          .from('user_contacts')
          .select('user_id, whatsapp')
          .in('user_id', acceptedIds)
        contactsMap = (contacts ?? []).reduce((acc, c) => ({ ...acc, [c.user_id]: c.whatsapp }), {})
      }

      acceptedMembers = (reqs ?? []).map((r) => {
        const u = Array.isArray(r.users) ? r.users[0] : r.users
        return {
          id: r.id,
          user_id: r.user_id,
          status: r.status,
          pesan: r.pesan,
          nama: (u as { nama?: string })?.nama ?? 'Anonim',
          jurusan: (u as { jurusan?: string })?.jurusan ?? '',
          whatsapp: contactsMap[r.user_id],
        }
      }) as unknown as typeof acceptedMembers
    }
  }

  const owner = Array.isArray(post.users) ? post.users[0] : post.users
  const ownerTyped = owner as { id: string; nama: string; jurusan?: string; angkatan?: number; bio?: string } | null
  const comp = Array.isArray(post.competitions) ? post.competitions[0] : post.competitions
  const compTyped = comp as { id: string; judul: string; kategori?: string; deadline: string; url: string } | null

  return (
    <PageContainer width="wide">
      <nav aria-label="Jejak navigasi" className="mb-4 text-sm text-slate-500">
        <Link href="/tim" className="inline-flex min-h-[44px] items-center hover:text-indigo-600">Cari Tim</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-slate-700">{post.judul}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* KONTEN UTAMA */}
        <div className="space-y-6 lg:col-span-8">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone="indigo">Tim lomba</StatusPill>
                  <StatusPill tone={post.status === 'open' ? 'green' : post.status === 'full' ? 'red' : 'gray'}>
                    {post.status === 'open' ? 'Membuka rekrutmen' : post.status === 'full' ? 'Slot penuh' : 'Ditutup'}
                  </StatusPill>
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{post.judul}</h1>
              </div>
              {user && !isOwner && <ReportButton targetType="post" targetId={post.id} />}
            </div>

            {compTyped && (
              <Link
                href={`/lomba/${compTyped.id}`}
                className="group mt-5 flex min-h-[44px] items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 transition hover:bg-indigo-50"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">Untuk lomba</p>
                  <p className="truncate text-sm font-semibold text-indigo-800 group-hover:underline">{compTyped.judul}</p>
                </div>
                <ArrowRight size={18} className="shrink-0 text-indigo-700" />
              </Link>
            )}

            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Peran dan kebutuhan</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{post.deskripsi}</p>
            </div>

            {requiredSkills.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Keahlian yang dicari</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {requiredSkills.map((s) => (
                    <li key={s.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {s.nama}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-sm">
              <div>
                <dt className="text-xs font-medium text-slate-500">Inisiator</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {ownerTyped?.nama}
                  {ownerTyped?.jurusan && (
                    <span className="block text-xs font-normal text-slate-500">
                      {ownerTyped.jurusan}{ownerTyped.angkatan ? `, angkatan ${ownerTyped.angkatan}` : ''}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Slot tersedia</dt>
                <dd className="mt-1">
                  <SlotBar terisi={post.slot_terisi} total={post.slot_total} className="max-w-[240px]" />
                </dd>
              </div>
            </dl>
          </article>

          {isOwner && (
            <section aria-labelledby="kelola-pengajuan" className="space-y-4">
              <h2 id="kelola-pengajuan" className="text-lg font-bold tracking-tight text-slate-900">Kelola pengajuan</h2>
              <ManageRequests postId={post.id} requests={acceptedMembers} postStatus={post.status} />
            </section>
          )}
        </div>

        {/* SIDEBAR AKSI: kontak dan ajukan. Di HP turun ke bawah konten. */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:col-span-4">
          {user && !isOwner && (ownerContact || userRequest?.status === 'accepted' || userRequest?.status === 'pending' || post.status === 'open') && (
            <ContactCard whatsapp={userRequest?.status === 'accepted' ? ownerContact : null} ownerName={ownerTyped?.nama ?? 'pemilik postingan'} />
          )}

          {!isOwner && user && post.status === 'open' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <AjukanGabungForm
                postId={post.id}
                existingStatus={userRequest?.status ?? null}
                requestId={userRequest?.id ?? null}
              />
            </div>
          )}

          {!isOwner && user && post.status !== 'open' && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              Postingan ini sudah tidak membuka pendaftaran.
            </div>
          )}

          {!user && post.status === 'open' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Ingin bergabung?</p>
              <p className="mt-1 text-sm text-slate-600">Masuk dulu untuk mengajukan gabung ke tim ini.</p>
              <Link
                href={`/masuk?redirect=/tim/${post.id}`}
                className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]"
              >
                Masuk untuk mengajukan
              </Link>
            </div>
          )}

          {isOwner && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Postingan milikmu</p>
              <p className="mt-1 text-sm text-slate-600">Pengajuan masuk ada di bagian kelola pengajuan.</p>
              <div className="mt-4">
                <DeletePostButton postId={post.id} redirectTo="/dashboard" />
              </div>
            </div>
          )}
        </aside>
      </div>
    </PageContainer>
  )
}