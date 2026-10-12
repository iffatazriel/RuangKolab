import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardView } from './DashboardView'
import { PageContainer } from '@/components/ui/Page'
import type { NotificationItem } from './NotificationList'

type FavComp = { id: string; judul: string; deadline: string; biaya: number; publish_status: string }
type IncomingRow = {
  id: string
  status: string
  pesan: string | null
  created_at: string
  post_id: string
  user_id: string
  team_posts: { id: string; judul: string; tipe: string } | { id: string; judul: string; tipe: string }[] | null
  users: { nama: string; jurusan: string | null } | { nama: string; jurusan: string | null }[] | null
}
type MyRequest = {
  id: string
  status: string
  created_at: string
  pesan: string | null
  team_posts: { id: string; judul: string; tipe: string; status: string; owner_id: string } | { id: string; judul: string; tipe: string; status: string; owner_id: string }[] | null
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/masuk')

  const [{ data: profile }, { data: myPosts }, { data: myRequestsData }, { data: notifData }, { data: favData }, { data: myProposalsData }] =
    await Promise.all([
      supabase.from('users').select('nama, jurusan, angkatan').eq('id', user.id).single(),
      supabase
        .from('team_posts')
        .select('id, tipe, judul, slot_total, slot_terisi, status, created_at')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('join_requests')
        .select(`
          id, status, created_at, pesan,
          team_posts(id, judul, tipe, status, owner_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('notifications')
        .select('id, tipe, payload, link, dibaca, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('competition_favorites')
        .select('competition_id, created_at, competitions(id, judul, deadline, biaya, publish_status)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('competitions')
        .select('id, judul, publish_status')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false }),
    ])

  const notifications = (notifData ?? []) as unknown as NotificationItem[]
  const unreadCount = notifications.filter((n) => !n.dibaca).length

  const favorites = ((favData ?? []) as unknown as { competitions: FavComp | FavComp[] | null }[])
    .map((f) => (Array.isArray(f.competitions) ? f.competitions[0] : f.competitions))
    .filter((c): c is FavComp => !!c && c.publish_status === 'published' && new Date(c.deadline) > new Date())

  const myPostIds = (myPosts ?? []).map((p) => p.id)
  let incoming: IncomingRow[] = []
  if (myPostIds.length > 0) {
    const { data } = await supabase
      .from('join_requests')
      .select(`
        id, status, pesan, created_at, post_id, user_id,
        team_posts(id, judul, tipe),
        users(nama, jurusan)
      `)
      .in('post_id', myPostIds)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    incoming = (data ?? []) as unknown as IncomingRow[]
  }

  const myRequests = (myRequestsData ?? []) as unknown as MyRequest[]

  return (
    <PageContainer width="wide">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl">Dashboard Kolaborasi</h1>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          Pusat kendali aktivitas tim, lamaran, notifikasi, dan arsip kompetisi yang kamu ikuti.
        </p>
      </div>

      <DashboardView
        user={{
          nama: profile?.nama ?? user.email ?? 'Mahasiswa',
          email: user.email ?? '',
          jurusan: profile?.jurusan ?? null,
          angkatan: profile?.angkatan ?? null,
        }}
        notifications={notifications}
        unreadCount={unreadCount}
        incoming={incoming}
        myPosts={myPosts ?? []}
        myRequests={myRequests}
        favorites={favorites}
        myProposals={myProposalsData ?? []}
      />
    </PageContainer>
  )
}
