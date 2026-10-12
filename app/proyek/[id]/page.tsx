import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ReportButton } from '@/components/ui/ReportButton'
import { DeletePostButton } from '@/components/ui/DeletePostButton'
import { AjukanGabungForm } from '@/app/tim/[id]/AjukanGabungForm'
import { ManageRequests } from '@/app/tim/[id]/ManageRequests'
import { PageContainer, StatusPill } from '@/components/ui/Page'

export default async function ProyekDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('team_posts')
    .select(`
      id, tipe, judul, deskripsi, slot_total, slot_terisi, status, owner_id, created_at,
      komitmen, repo_url,
      users(id, nama, jurusan, angkatan, bio)
    `)
    .eq('id', id)
    .eq('tipe', 'project')
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
  type RequestRow = { id: string; user_id: string; status: string; pesan: string | null; nama: string; jurusan: string; whatsapp?: string }
  let allRequests: RequestRow[] = []

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
        .select(`id, status, pesan, created_at, user_id, users(nama, jurusan)`)
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

      allRequests = (reqs ?? []).map((r) => {
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
      })
    }
  }

  const owner = Array.isArray(post.users) ? post.users[0] : post.users
  const ownerTyped = owner as { nama: string; jurusan?: string; angkatan?: number } | null

  return (
    <PageContainer width="medium">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="indigo">Proyek Kolaborasi</StatusPill>
              <StatusPill tone={post.status === 'open' ? 'green' : post.status === 'full' ? 'red' : 'gray'}>
                {post.status === 'open' ? 'Membuka Kolaborator' : post.status === 'full' ? 'Slot Penuh' : 'Ditutup'}
              </StatusPill>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {post.judul}
            </h1>
          </div>
          {user && !isOwner && <ReportButton targetType="post" targetId={post.id} />}
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Deskripsi Proyek</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
            {post.deskripsi}
          </p>
        </div>

        {requiredSkills.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Keahlian yang Dibutuhkan</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {requiredSkills.map((s) => (
                <span key={s.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {s.nama}
                </span>
              ))}
            </div>
          </div>
        )}

        {(post.komitmen || post.repo_url) && (
          <div className="mt-6 grid gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-2 text-sm">
            {post.komitmen && (
              <div>
                <p className="text-xs font-medium text-slate-500">Estimasi Komitmen Waktu</p>
                <p className="mt-1 font-semibold text-slate-900">{post.komitmen}</p>
              </div>
            )}
            {post.repo_url && (
              <div>
                <p className="text-xs font-medium text-slate-500">Repositori / Tautan Dokumen</p>
                <a href={post.repo_url} target="_blank" rel="noopener noreferrer" className="mt-1 block font-semibold text-indigo-600 hover:underline break-all">
                  Buka Tautan Resmi ↗
                </a>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <p>
            Inisiator: <span className="font-semibold text-slate-900">{ownerTyped?.nama}</span>
            {ownerTyped?.jurusan && ` (${ownerTyped.jurusan}${ownerTyped.angkatan ? ` '${ownerTyped.angkatan}` : ''})`}
          </p>
          <p className="mt-1">
            Slot kolaborator: <span className="font-semibold text-slate-900">{post.slot_total - post.slot_terisi}</span> dari {post.slot_total} orang
          </p>
        </div>

        {ownerContact && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <h3 className="font-bold text-emerald-900">Pengajuan Anda Diterima</h3>
            <p className="mt-1 text-sm text-emerald-800">
              Silakan hubungi pemilik proyek melalui WhatsApp:{' '}
              <a
                href={`https://wa.me/${ownerContact.replace(/^0/, '62')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                {ownerContact}
              </a>
            </p>
          </div>
        )}

        {!isOwner && user && post.status === 'open' && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <AjukanGabungForm
              postId={post.id}
              existingStatus={userRequest?.status ?? null}
              requestId={userRequest?.id ?? null}
            />
          </div>
        )}

        {!user && post.status === 'open' && (
          <div className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-600">
            <Link href={`/masuk?redirect=/proyek/${post.id}`} className="font-semibold text-indigo-600 hover:underline">
              Masuk
            </Link>{' '}
            untuk mengajukan bergabung ke proyek ini.
          </div>
        )}

        {isOwner && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <DeletePostButton postId={post.id} redirectTo="/dashboard" />
          </div>
        )}
      </div>

      {isOwner && (
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Kelola Pengajuan Kolaborator</h2>
          <ManageRequests postId={post.id} requests={allRequests} postStatus={post.status} />
        </section>
      )}
    </PageContainer>
  )
}
