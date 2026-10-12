import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Trophy, UsersThree, Rocket, ArrowRight, CalendarDots, Users } from '@phosphor-icons/react/dist/ssr'
import { CompetitionCard, PosterFallback, type CompetitionCardData } from '@/components/ui/CompetitionCard'
import { getDeadlineTone } from '@/lib/deadline'
import {
  HeroLines,
  HeroSequence,
  HeroParallax,
  SnapRow,
  SnapCard,
  SpotlightCard,
  MagneticLink,
  Marquee,
  DriftBackdrop,
  HowItWorks,
  RevealGroup,
  RevealItem,
} from '@/components/motion/LandingMotion'

function deadlineLabel(iso: string) {
  // Versi ringkas untuk kartu unggulan hero; daftar memakai getDeadlineTone
  const { pendek } = getDeadlineTone(iso)
  return pendek
}

export default async function Home() {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const [{ data: competitions }, { data: teamPosts }, { count: totalComps }, { count: totalPosts }, { count: totalProjects }, { data: skillsData }] = await Promise.all([
    supabase
      .from('competitions')
      .select('id, judul, penyelenggara, kategori, deadline, biaya, poster_url')
      .eq('publish_status', 'published')
      .gte('deadline', now)
      .order('deadline', { ascending: true })
      .limit(6),
    supabase
      .from('team_posts')
      .select('id, tipe, judul, deskripsi, slot_total, slot_terisi, status')
      .in('status', ['open', 'full'])
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('competitions')
      .select('id', { count: 'exact', head: true })
      .eq('publish_status', 'published')
      .gte('deadline', now),
    supabase
      .from('team_posts')
      .select('id', { count: 'exact', head: true })
      .in('status', ['open', 'full']),
    supabase
      .from('team_posts')
      .select('id', { count: 'exact', head: true })
      .eq('tipe', 'project')
      .in('status', ['open', 'full']),
    supabase.from('skills').select('nama').limit(8),
  ])

  const lombaList = competitions ?? []
  const teamList = (teamPosts ?? []).filter((p) => p.tipe === 'competition').slice(0, 4)
  const proyekList = (teamPosts ?? []).filter((p) => p.tipe === 'project').slice(0, 3)
  const featured = lombaList[0] ?? null

  // Sinyal tim: jumlah rekrutmen terbuka per lomba untuk kartu carousel
  const lombaIds = lombaList.map((c) => c.id)
  const timMap: Record<string, number> = {}
  if (lombaIds.length > 0) {
    const { data: openPosts } = await supabase
      .from('team_posts')
      .select('id, competition_id')
      .eq('tipe', 'competition')
      .eq('status', 'open')
      .in('competition_id', lombaIds)
    for (const p of openPosts ?? []) {
      if (p.competition_id) timMap[p.competition_id] = (timMap[p.competition_id] ?? 0) + 1
    }
  }
  const skillNames = (skillsData ?? []).map((s) => s.nama)

  return (
    <div>
      {/* HERO: stagger per baris mengarahkan mata; kartu unggulan parallax, tanpa fade (LCP) */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-14 sm:px-6 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <HeroLines />
            <HeroSequence>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Hubungkan keahlianmu dengan mahasiswa lintas jurusan untuk kompetisi dan proyek kampus.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/lomba"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
                >
                  Jelajahi Lomba
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <Link
                  href="/tim"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                >
                  Cari Rekan Tim
                </Link>
              </div>
            </HeroSequence>
          </div>

          <div className="lg:col-span-5">
            <HeroParallax>
              <Link href={featured ? `/lomba/${featured.id}` : '/lomba'} className="block surface-card overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                  {featured?.poster_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.poster_url}
                      alt={`Poster ${featured.judul}`}
                      fetchPriority="high"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  ) : (
                    <PosterFallback kategori={featured?.kategori ?? 'Teknologi'} />
                  )}
                </div>
                <div className="px-2 pb-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-600">{featured?.kategori ?? 'Teknologi'}</span>
                    <span className="flex items-center gap-1 font-mono text-slate-500">
                      <CalendarDots size={14} />
                      {featured ? deadlineLabel(featured.deadline) : 'Segera'}
                    </span>
                  </div>
                  <span className="mt-1.5 block text-lg font-bold text-slate-900 transition-colors hover:text-indigo-600 line-clamp-1">
                    {featured?.judul ?? 'Hackathon UI/UX Nasional'}
                  </span>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                    Penyelenggara: {featured?.penyelenggara ?? 'UKM Komputer Mahasiswa'}
                  </p>
                </div>
              </Link>
            </HeroParallax>
          </div>
        </div>
      </section>

      {/* STRIP STATISTIK: angka riil dari database */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3">
            <Trophy size={24} weight="duotone" className="text-indigo-600" />
            <div>
              <p className="font-mono text-xl font-bold tracking-tight text-slate-900">{totalComps ?? 0}</p>
              <p className="text-xs font-medium text-slate-500">Lomba aktif</p>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <UsersThree size={24} weight="duotone" className="text-indigo-600" />
            <div>
              <p className="font-mono text-xl font-bold tracking-tight text-slate-900">{(totalPosts ?? 0) - (totalProjects ?? 0)}</p>
              <p className="text-xs font-medium text-slate-500">Rekrutmen tim</p>
            </div>
          </div>
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />
          <div className="hidden items-center gap-3 sm:flex">
            <Rocket size={24} weight="duotone" className="text-indigo-600" />
            <div>
              <p className="font-mono text-xl font-bold tracking-tight text-slate-900">{totalProjects ?? 0}</p>
              <p className="text-xs font-medium text-slate-500">Proyek terbuka</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEGERA BERAKHIR: carousel scroll-snap, kartu masuk stagger */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Segera berakhir</h2>
            <p className="mt-1 text-xs text-slate-500">Pendaftaran menutup paling cepat pada lomba-lomba ini.</p>
          </div>
          <Link href="/lomba" className="flex min-h-[44px] items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
            Semua lomba
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
        {lombaList.length > 0 ? (
          <SnapRow label="Lomba mendekati deadline">
            {lombaList.map((c, i) => (
              <SnapCard key={c.id}>
                <CompetitionCard
                  comp={c as CompetitionCardData}
                  timMencari={timMap[c.id] ?? 0}
                  priority={i < 3}
                />
              </SnapCard>
            ))}
          </SnapRow>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="font-semibold text-slate-800">Belum ada lomba aktif</p>
            <p className="mt-1 text-sm text-slate-500">Ketahui lomba yang belum terdaftar? Usulkan agar temanmu ikut serta.</p>
            <Link href="/lomba/usul" className="mt-4 inline-flex min-h-[44px] items-center rounded-lg border border-indigo-600 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50">
              Usulkan Lomba
            </Link>
          </div>
        )}
      </section>

      {/* CARA KERJA: garis tergambar mengikuti scroll, alur Temukan, Ajukan, Bentuk tim */}
      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Cara kerjanya</h2>
          <HowItWorks
            steps={[
              { title: 'Temukan', body: 'Telusuri lomba yang masih membuka pendaftaran, urut dari deadline terdekat, lengkap dengan biaya dan tingkatnya.' },
              { title: 'Ajukan', body: 'Kirim pengajuan gabung dengan pesan singkat ke pemilik tim. Kontak WhatsApp terbuka setelah kamu diterima.' },
              { title: 'Bentuk tim', body: 'Slot anggota berkurang otomatis setiap ada yang diterima. Tim siap bertanding atau mengerjakan proyek.' },
            ]}
          />
        </div>
      </section>

      {/* BENTO: 3 sel pas dengan konten, spotlight mengikuti kursor */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <RevealGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <RevealItem className="md:col-span-2">
            <SpotlightCard className="h-full">
              <div className="flex h-full flex-col sm:flex-row">
                <div className="relative min-h-[160px] flex-1 overflow-hidden sm:min-h-[200px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://picsum.photos/seed/ruangkolab-kolaborasi/900/600"
                    alt="Mahasiswa berkolaborasi"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <h3 className="text-lg font-bold text-slate-900">Satu platform, tiga tujuan</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Lomba, rekrutmen tim, dan proyek kolaborasi dalam satu tempat. Tidak perlu lagi menyebar info lewat grup chat.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </RevealItem>
          <RevealItem>
            <SpotlightCard className="flex h-full flex-col justify-between p-6">
              <Trophy size={32} weight="duotone" className="text-indigo-600" />
              <div className="mt-6">
                <p className="font-mono text-3xl font-bold tracking-tight text-slate-900">{totalComps ?? 0}</p>
                <p className="mt-1 text-sm text-slate-600">lomba aktif menunggu pendaftaran</p>
              </div>
            </SpotlightCard>
          </RevealItem>
          <RevealItem className="md:col-span-3">
            <SpotlightCard className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <Users size={32} weight="duotone" className="text-indigo-600" />
                <div>
                  <p className="font-bold text-slate-900">Rekrutmen terbuka</p>
                  <p className="text-sm text-slate-600">
                    <span className="font-mono font-bold">{(totalPosts ?? 0) - (totalProjects ?? 0)}</span> tim lomba dan{' '}
                    <span className="font-mono font-bold">{totalProjects ?? 0}</span> proyek sedang mencari anggota
                  </p>
                </div>
              </div>
              <Link href="/tim" className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]">
                Lihat rekrutmen
                <ArrowRight size={16} weight="bold" />
              </Link>
            </SpotlightCard>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* MARQUEE: satu-satunya, keahlian populer dari database */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-8">
        <Marquee items={skillNames.length > 0 ? skillNames : ['Frontend', 'UI/UX', 'Data', 'Karya Tulis', 'Video', 'IoT']} />
      </section>

      {/* REKRUTMEN TERBARU: baris list ringkas */}
      {teamList.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Baru membuka slot</h2>
            <Link href="/tim" className="flex min-h-[44px] items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
              Semua tim
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {teamList.map((p) => (
              <Link key={p.id} href={`/tim/${p.id}`} className="group flex items-start justify-between gap-4 border-t border-slate-100 py-5 first:border-t-0 md:first:border-t">
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">{p.judul}</h3>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500">{p.deskripsi}</p>
                </div>
                <span className="font-mono shrink-0 text-xs font-medium text-slate-500">{p.slot_terisi}/{p.slot_total}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PROYEK: baris tunggal, ikon kiri */}
      {proyekList.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:pb-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Proyek kolaborasi</h2>
            <Link href="/proyek" className="flex min-h-[44px] items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
              Semua proyek
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {proyekList.map((p) => (
              <Link key={p.id} href={`/proyek/${p.id}`} className="surface-card group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:flex">
                    <Rocket size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">{p.judul}</h3>
                    <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{p.deskripsi}</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs font-medium text-slate-500">Anggota {p.slot_terisi}/{p.slot_total}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA PENUTUP: magnetik, latar aksen bergeser lambat */}
      <DriftBackdrop className="border-t border-slate-100 bg-white">
        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Punya keahlian? Ada tim yang menunggu.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
            Daftar, lengkapi profilmu, dan mulai dari postingan pertama hari ini.
          </p>
          <div className="mt-8">
            <MagneticLink href="/daftar">Daftar Sekarang</MagneticLink>
          </div>
        </section>
      </DriftBackdrop>
    </div>
  )
}
