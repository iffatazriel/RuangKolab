import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

function deadlineLabel(iso: string) {
  const diffMs = new Date(iso).getTime() - Date.now()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Hari ini'
  if (days === 1) return '1 hari lagi'
  if (days <= 14) return `${days} hari lagi`
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

function formatFee(biaya: number) {
  return biaya === 0 ? 'Gratis' : `Rp ${biaya.toLocaleString('id-ID')}`
}

export default async function Home() {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const [{ data: competitions }, { data: teamPosts }, { count: totalComps }, { count: totalPosts }] = await Promise.all([
    supabase
      .from('competitions')
      .select('id, judul, penyelenggara, kategori, deadline, biaya, poster_url')
      .eq('publish_status', 'published')
      .gte('deadline', now)
      .order('deadline', { ascending: true })
      .limit(3),
    supabase
      .from('team_posts')
      .select('id, tipe, judul, deskripsi, slot_total, slot_terisi, status')
      .in('status', ['open', 'full'])
      .order('created_at', { ascending: false })
      .limit(7),
    supabase
      .from('competitions')
      .select('id', { count: 'exact', head: true })
      .eq('publish_status', 'published')
      .gte('deadline', now),
    supabase
      .from('team_posts')
      .select('id', { count: 'exact', head: true })
      .in('status', ['open', 'full']),
  ])

  const lombaList = competitions ?? []
  const teamList = (teamPosts ?? []).filter((p) => p.tipe === 'competition').slice(0, 4)
  const proyekList = (teamPosts ?? []).filter((p) => p.tipe === 'project').slice(0, 3)
  const featured = lombaList[0] ?? null

  const postIds = [...teamList, ...proyekList].map((p) => p.id)
  const skillsMap: Record<string, string[]> = {}
  if (postIds.length > 0) {
    const { data: ps } = await supabase
      .from('post_skills')
      .select('post_id, skills(nama)')
      .in('post_id', postIds)
    for (const row of ps ?? []) {
      const s = Array.isArray(row.skills) ? row.skills[0] : row.skills
      const nama = (s as { nama?: string } | null)?.nama
      if (nama) {
        skillsMap[row.post_id] = [...(skillsMap[row.post_id] ?? []), nama]
      }
    }
  }

  return (
    <div className="bg-[#fcfcfd]">
      {/* HERO SECTION: Fits in initial viewport, no artificial padding bloating */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Focused Copywriting & Action */}
          <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-1 text-xs font-semibold text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
              Platform Kolaborasi Kampus
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.12]">
              Temukan Lomba, Bentuk Tim, Wujudkan Proyek.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Hubungkan keahlianmu dengan mahasiswa lintas jurusan. Ikuti kompetisi dan mulai inisiatif proyek kampus tanpa batas lingkaran pertemanan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/lomba"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
              >
                Jelajahi Lomba
              </Link>
              <Link
                href="/tim"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]"
              >
                Cari Rekan Tim
              </Link>
            </div>
            <div className="mt-10 flex items-center space-x-8 border-t border-slate-200/60 pt-6">
              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900">{totalComps ?? 30}+</p>
                <p className="text-xs text-slate-500 font-medium">Lomba Aktif</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900">{totalPosts ?? 15}+</p>
                <p className="text-xs text-slate-500 font-medium">Postingan Tim</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Gratis Mahasiswa</p>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Competition Card */}
          <div className="lg:col-span-5">
            <div className="surface-card overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                {featured?.poster_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.poster_url}
                    alt={featured.judul}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col justify-end bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 p-6 text-white">
                    <span className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">Kompetisi Unggulan</span>
                    <h2 className="mt-1 text-xl font-bold text-white line-clamp-2">
                      {featured?.judul ?? 'Hackathon UI/UX Nasional'}
                    </h2>
                  </div>
                )}
              </div>
              <div className="px-2 pb-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-600">{featured?.kategori ?? 'Teknologi'}</span>
                  <span className="text-slate-500">{featured ? deadlineLabel(featured.deadline) : 'Segera Ditutup'}</span>
                </div>
                <Link
                  href={featured ? `/lomba/${featured.id}` : '/lomba'}
                  className="mt-1.5 block text-lg font-bold text-slate-900 transition-colors hover:text-indigo-600 line-clamp-1"
                >
                  {featured?.judul ?? 'Hackathon UI/UX Nasional'}
                </Link>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                  Penyelenggara: {featured?.penyelenggara ?? 'UKM Komputer Mahasiswa'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING DEADLINES */}
      <section className="mx-auto max-w-7xl px-6 py-12 border-t border-slate-100">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Lomba Mendekati Deadline</h2>
            <p className="mt-1 text-xs text-slate-500">Daftar sekarang sebelum masa pendaftaran ditutup.</p>
          </div>
          <Link
            href="/lomba"
            className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
          >
            Lihat Semua -
          </Link>
        </div>
        {lombaList.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {lombaList.map((c) => (
              <Link
                key={c.id}
                href={`/lomba/${c.id}`}
                className="surface-card flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                    {c.kategori ?? 'Umum'}
                  </span>
                  <span className="text-xs font-semibold text-rose-600">
                    {deadlineLabel(c.deadline)}
                  </span>
                </div>
                <h3 className="mt-3 line-clamp-2 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                  {c.judul}
                </h3>
                {c.penyelenggara && (
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">Penyelenggara: {c.penyelenggara}</p>
                )}
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                  <span className={c.biaya === 0 ? 'font-bold text-emerald-600' : 'font-semibold text-slate-700'}>
                    {formatFee(c.biaya)}
                  </span>
                  <span className="font-medium text-indigo-600 hover:underline">Detail -</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Belum ada lomba aktif saat ini.</p>
        )}
      </section>

      {/* TEAM RECRUITMENT */}
      <section className="mx-auto max-w-7xl px-6 py-12 border-t border-slate-100">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Postingan Cari Tim Terbaru</h2>
            <p className="mt-1 text-xs text-slate-500">Kolega yang membutuhkan peran spesifik untuk bergabung.</p>
          </div>
          <Link
            href="/tim"
            className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
          >
            Lihat Semua -
          </Link>
        </div>
        {teamList.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {teamList.map((p) => (
              <Link
                key={p.id}
                href={`/tim/${p.id}`}
                className="surface-card flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                      {p.judul}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.status === 'open' ? 'Membuka' : 'Penuh'}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {p.deskripsi}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {(skillsMap[p.id] ?? []).slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="shrink-0 text-xs font-medium text-slate-500">
                    Slot {p.slot_terisi}/{p.slot_total}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Belum ada postingan cari tim.</p>
        )}
      </section>

      {/* COLLABORATION PROJECTS */}
      <section className="mx-auto max-w-7xl px-6 py-12 mb-12 border-t border-slate-100">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Proyek Kolaborasi</h2>
            <p className="mt-1 text-xs text-slate-500">Inisiatif independen dan proyek riil mahasiswa.</p>
          </div>
          <Link
            href="/proyek"
            className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
          >
            Lihat Semua -
          </Link>
        </div>
        {proyekList.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {proyekList.map((p) => (
              <div
                key={p.id}
                className="surface-card flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                      {p.judul}
                    </h3>
                    <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                      Proyek
                    </span>
                  </div>
                  <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">
                    {p.deskripsi}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="text-slate-500">
                    Anggota: {p.slot_terisi}/{p.slot_total}
                  </span>
                  <Link
                    href={`/proyek/${p.id}`}
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    Lihat Proyek -
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Belum ada proyek kolaborasi.</p>
        )}
      </section>
    </div>
  )
}
