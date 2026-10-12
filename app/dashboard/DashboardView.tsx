'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NotificationList, type NotificationItem } from './NotificationList'
import { IncomingRequestButtons, CancelRequestButton } from './DashboardActions'
import { Card, EmptyState, StatusPill, PrimaryLink } from '@/components/ui/Page'

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
type MyPost = {
  id: string
  tipe: string
  judul: string
  slot_total: number
  slot_terisi: number
  status: string
  created_at: string
}
type MyRequest = {
  id: string
  status: string
  created_at: string
  pesan: string | null
  team_posts: { id: string; judul: string; tipe: string; status: string; owner_id: string } | { id: string; judul: string; tipe: string; status: string; owner_id: string }[] | null
}
type MyProposal = {
  id: string
  judul: string
  publish_status: string
}

interface Props {
  user: {
    nama: string
    email: string
    jurusan?: string | null
    angkatan?: number | null
  }
  notifications: NotificationItem[]
  unreadCount: number
  incoming: IncomingRow[]
  myPosts: MyPost[]
  myRequests: MyRequest[]
  favorites: FavComp[]
  myProposals: MyProposal[]
}

function postHref(tipe: string, id: string) {
  return tipe === 'competition' ? `/tim/${id}` : `/proyek/${id}`
}

function requestTone(status: string): 'green' | 'yellow' | 'red' | 'gray' {
  if (status === 'accepted') return 'green'
  if (status === 'pending') return 'yellow'
  if (status === 'rejected') return 'red'
  return 'gray'
}

type TabKey = 'semua' | 'notifikasi' | 'pengajuan_masuk' | 'postingan' | 'lamaran' | 'minat'

export function DashboardView({
  user,
  notifications,
  unreadCount,
  incoming,
  myPosts,
  myRequests,
  favorites,
  myProposals,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('semua')

  const navItems = [
    { key: 'semua' as const, label: 'Ringkasan', badge: null },
    { key: 'notifikasi' as const, label: 'Notifikasi', badge: unreadCount > 0 ? unreadCount : null, badgeColor: 'bg-rose-500' },
    { key: 'pengajuan_masuk' as const, label: 'Pengajuan Masuk', badge: incoming.length > 0 ? incoming.length : null, badgeColor: 'bg-amber-500' },
    { key: 'postingan' as const, label: 'Postingan Saya', badge: myPosts.length > 0 ? myPosts.length : null, badgeColor: 'bg-slate-200 text-slate-700' },
    { key: 'lamaran' as const, label: 'Status Lamaran Tim', badge: myRequests.length > 0 ? myRequests.length : null, badgeColor: 'bg-slate-200 text-slate-700' },
    { key: 'minat' as const, label: 'Minat & Usulan Lomba', badge: favorites.length + myProposals.length > 0 ? favorites.length + myProposals.length : null, badgeColor: 'bg-slate-200 text-slate-700' },
  ]

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
      {/* SIDEBAR NAVIGATION */}
      <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
        {/* User Mini Profile Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700">
              {user.nama.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-bold text-sm text-slate-900">{user.nama}</h2>
              <p className="truncate text-xs text-slate-500">
                {user.jurusan ? `${user.jurusan}${user.angkatan ? ` (${user.angkatan})` : ''}` : user.email}
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <Link
              href="/profil"
              className="block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Kelola Profil
            </Link>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-sm flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor ?? 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Quick Action Buttons */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Aksi Cepat</p>
          <PrimaryLink href="/tim/baru">+ Buka Cari Tim</PrimaryLink>
          <div className="pt-1">
            <PrimaryLink href="/proyek/baru" variant="outline">+ Inisiasi Proyek</PrimaryLink>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="lg:col-span-9 space-y-8">
        {/* SECTION: NOTIFIKASI */}
        {(activeTab === 'semua' || activeTab === 'notifikasi') && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                Notifikasi
                {unreadCount > 0 && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount} baru
                  </span>
                )}
              </h2>
            </div>
            <Card>
              <NotificationList items={notifications} />
            </Card>
          </section>
        )}

        {/* SECTION: PENGAJUAN MASUK */}
        {(activeTab === 'semua' || activeTab === 'pengajuan_masuk') && (
          <section id="pengajuan">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Pengajuan Masuk {incoming.length > 0 && <span className="text-slate-400">({incoming.length})</span>}
              </h2>
              <p className="text-xs text-slate-500">Mahasiswa yang ingin bergabung dengan timmu</p>
            </div>
            {incoming.length === 0 ? (
              <EmptyState
                title="Tidak ada pengajuan pending"
                description="Ketika ada mahasiswa melamar ke postingan timmu, lamaran akan tampil di sini."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {incoming.map((r) => {
                  const post = Array.isArray(r.team_posts) ? r.team_posts[0] : r.team_posts
                  const applicant = Array.isArray(r.users) ? r.users[0] : r.users
                  return (
                    <Card key={r.id} className="flex flex-wrap items-center justify-between gap-4 border-amber-200 bg-amber-50/40">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">
                          {applicant?.nama ?? 'Anonim'}
                          {applicant?.jurusan && <span className="font-normal text-slate-500"> ({applicant.jurusan})</span>}
                        </p>
                        {post && (
                          <p className="mt-0.5 text-xs text-slate-600">
                            Melamar ke postingan:{' '}
                            <Link href={postHref(post.tipe, post.id)} className="font-semibold text-indigo-600 hover:underline">
                              {post.judul}
                            </Link>
                          </p>
                        )}
                        {r.pesan && <p className="mt-2 text-xs italic text-slate-700 bg-white/70 p-2.5 rounded-lg border border-amber-100">&ldquo;{r.pesan}&rdquo;</p>}
                      </div>
                      <IncomingRequestButtons requestId={r.id} />
                    </Card>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* SECTION: POSTINGAN SAYA */}
        {(activeTab === 'semua' || activeTab === 'postingan') && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Postingan Saya</h2>
              <span className="text-xs text-slate-500">{myPosts.length} postingan</span>
            </div>
            {myPosts.length === 0 ? (
              <EmptyState
                title="Belum ada postingan tim atau proyek"
                description="Buka postingan baru untuk mulai merekrut rekan kolaborasi."
                action={<PrimaryLink href="/tim/baru">+ Buka Cari Tim</PrimaryLink>}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myPosts.map((p) => (
                  <Link
                    key={p.id}
                    href={postHref(p.tipe, p.id)}
                    className="surface-card flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <StatusPill tone={p.tipe === 'competition' ? 'indigo' : 'gray'}>
                          {p.tipe === 'competition' ? 'Lomba' : 'Proyek'}
                        </StatusPill>
                        <StatusPill tone={p.status === 'open' ? 'green' : p.status === 'full' ? 'red' : 'gray'}>
                          {p.status === 'open' ? 'Membuka' : p.status === 'full' ? 'Penuh' : 'Ditutup'}
                        </StatusPill>
                      </div>
                      <h3 className="mt-3 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-indigo-600">{p.judul}</h3>
                    </div>
                    <p className="mt-4 border-t border-slate-100 pt-2 text-xs text-slate-500 font-medium">
                      Slot terisi: {p.slot_terisi} / {p.slot_total} orang
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION: STATUS LAMARAN SAYA */}
        {(activeTab === 'semua' || activeTab === 'lamaran') && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Status Lamaran Bergabung</h2>
              <span className="text-xs text-slate-500">{myRequests.length} diajukan</span>
            </div>
            {myRequests.length === 0 ? (
              <EmptyState
                title="Belum ada lamaran terkirim"
                description="Temukan tim yang cocok di katalog Lomba atau Proyek dan ajukan bergabung."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {myRequests.map((r) => {
                  const post = Array.isArray(r.team_posts) ? r.team_posts[0] : r.team_posts
                  const pTyped = post as { id: string; judul: string; tipe: string } | null
                  return (
                    <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div className="min-w-0 flex-1">
                        {pTyped && (
                          <Link href={postHref(pTyped.tipe, pTyped.id)} className="font-semibold text-sm text-slate-900 hover:text-indigo-600">
                            {pTyped.judul}
                          </Link>
                        )}
                        {r.pesan && <p className="mt-1 text-xs text-slate-500">&ldquo;{r.pesan}&rdquo;</p>}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <StatusPill tone={requestTone(r.status)}>
                          {r.status === 'accepted' ? 'Diterima' : r.status === 'pending' ? 'Menunggu' : r.status === 'rejected' ? 'Ditolak' : 'Dibatalkan'}
                        </StatusPill>
                        {r.status === 'pending' && <CancelRequestButton requestId={r.id} />}
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* SECTION: MINAT & USULAN */}
        {(activeTab === 'semua' || activeTab === 'minat') && (
          <section className="space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Minat Lomba Tersimpan</h2>
                <span className="text-xs text-slate-500">{favorites.length} tersimpan</span>
              </div>
              {favorites.length === 0 ? (
                <EmptyState
                  title="Belum ada lomba yang disimpan"
                  description="Buka katalog lomba dan klik Simpan ke Minat Saya untuk memantau deadline."
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {favorites.map((c) => (
                    <Link
                      key={c.id}
                      href={`/lomba/${c.id}`}
                      className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
                    >
                      <p className="line-clamp-2 text-sm font-bold text-slate-900">{c.judul}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        Batas: {new Date(c.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}
                        {c.biaya === 0 ? 'Gratis' : `Rp ${c.biaya.toLocaleString('id-ID')}`}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {myProposals.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Usulan Lomba Saya ({myProposals.length})</h3>
                <ul className="flex flex-col gap-2">
                  {myProposals.map((c) => (
                    <li key={c.id}>
                      <Card className="flex items-center justify-between p-3.5">
                        <Link href={`/lomba/${c.id}`} className="font-semibold text-xs text-slate-900 hover:text-indigo-600">
                          {c.judul}
                        </Link>
                        <StatusPill tone={c.publish_status === 'published' ? 'green' : c.publish_status === 'pending' ? 'yellow' : 'gray'}>
                          {c.publish_status === 'published' ? 'Terbit' : c.publish_status === 'pending' ? 'Menunggu Review' : 'Tidak Diterbitkan'}
                        </StatusPill>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
