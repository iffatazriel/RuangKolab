import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Trophy, Rocket, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { CompetitionCard, type CompetitionCardData } from '@/components/ui/CompetitionCard'
import { Avatar } from '@/components/ui/Avatar'
import {
  HeroLines,
  HeroSequence,
  HeroParallax,
  HeroStack,
  SnapRow,
  SnapCard,
  SpotlightCard,
  MagneticLink,
  Marquee,
  DriftBackdrop,
  RevealGroup,
  RevealItem,
  CountUp,
} from '@/components/motion/LandingMotion'
import { TiltCard } from '@/components/motion/TiltCard'
import { HowStickyStack } from '@/components/motion/HowStickyStack'

export default async function Home() {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const [{ data: competitions }, { data: teamPosts }, { count: totalComps }, { count: totalPosts }, { count: totalProjects }, { data: skillsData }, { count: totalUsers }, { count: totalTim }] = await Promise.all([
    supabase
      .from('competitions')
      .select('id, judul, penyelenggara, kategori, deadline, biaya, poster_url')
      .eq('publish_status', 'published')
      .gte('deadline', now)
      .order('deadline', { ascending: true })
      .limit(6),
    supabase
      .from('team_posts')
      .select('id, tipe, judul, deskripsi, slot_total, slot_terisi, status, users(nama)')
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
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('team_posts')
      .select('id', { count: 'exact', head: true })
      .gt('slot_terisi', 0),
  ])

  const lombaList = competitions ?? []
  const teamList = (teamPosts ?? []).filter((p) => p.tipe === 'competition').slice(0, 4)
  const proyekList = (teamPosts ?? []).filter((p) => p.tipe === 'project').slice(0, 3)

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
      {/* HERO: split asimetris, teks kiri + tumpukan kartu 3D kanan, muat viewport */}
      <section className="hero-bg mx-auto w-full px-4 pt-10 pb-14 sm:px-6 lg:pt-16 lg:pb-20">
        <div className="mx-auto grid min-h-[calc(100dvh-var(--nav-h)-7rem)] max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <HeroLines />
            <HeroSequence>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-400">
                Satu tempat untuk lomba kampus, rekrutmen tim, dan proyek kolaborasi mahasiswa.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/lomba"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]"
                >
                  Cari Lomba
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <Link
                  href="/tim"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-stone-300 bg-white px-7 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 active:scale-[0.98] dark:active:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
                >
                  Cari Tim
                </Link>
              </div>
            </HeroSequence>
          </div>

          <div className="lg:col-span-5">
            <HeroParallax>
              <HeroStack
                cards={lombaList.slice(0, 3).map((c, i) => (
                  <CompetitionCard
                    key={c.id}
                    comp={c as CompetitionCardData}
                    timMencari={timMap[c.id] ?? 0}
                    priority={i === 0}
                    overlayGlass
                  />
                ))}
              />
            </HeroParallax>
          </div>
        </div>
      </section>

      {/* KATEGORI POPULER: chips menuju daftar terfilter */}
      <section aria-label="Jelajahi berdasarkan kategori" className="mx-auto max-w-7xl px-4 pt-2 pb-10 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {['Teknologi', 'Desain', 'Bisnis', 'Ilmiah', 'Olahraga'].map((k) => (
            <Link
              key={k}
              href={`/lomba?kategori=${encodeURIComponent(k)}`}
              className="inline-flex min-h-[40px] items-center rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 text-[13px] font-semibold text-stone-700 dark:text-stone-300 transition hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-700 dark:hover:text-brand-300 active:scale-[0.98]"
            >
              {k}
            </Link>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF: section sendiri di bawah hero, bukan di dalam hero.
          Angka lomba/mahasiswa/tim dari database nyata; testimoni contoh. */}
      <section aria-label="Bukti komunitas" className="border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <dl className="grid grid-cols-2 gap-6 text-center sm:grid-cols-3 lg:grid-cols-6">
            <div className="flex flex-col items-center">
              <dd className="font-mono text-3xl font-bold tabular-nums tracking-tight text-stone-900 dark:text-stone-100">
                <CountUp value={totalComps ?? 0} />
              </dd>
              <dt className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">lomba aktif</dt>
            </div>
            <div className="flex flex-col items-center">
              <dd className="font-mono text-3xl font-bold tabular-nums tracking-tight text-stone-900 dark:text-stone-100">
                <CountUp value={totalUsers ?? 0} />
              </dd>
              <dt className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">mahasiswa terdaftar</dt>
            </div>
            <div className="flex flex-col items-center">
              <dd className="font-mono text-3xl font-bold tabular-nums tracking-tight text-stone-900 dark:text-stone-100">
                <CountUp value={totalTim ?? 0} />
              </dd>
              <dt className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">tim sudah beranggota</dt>
            </div>
            <div className="flex flex-col items-center">
              <dd className="font-mono text-3xl font-bold tabular-nums tracking-tight text-stone-900 dark:text-stone-100">
                <CountUp value={1} />
              </dd>
              <dt className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">kampus di Purwokerto</dt>
            </div>
            <div className="flex flex-col items-center">
              <dd className="font-mono text-3xl font-bold tabular-nums tracking-tight text-stone-900 dark:text-stone-100">
                <CountUp value={(totalPosts ?? 0) - (totalProjects ?? 0)} />
              </dd>
              <dt className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">rekrutmen tim</dt>
            </div>
            <div className="flex flex-col items-center">
              <dd className="font-mono text-3xl font-bold tabular-nums tracking-tight text-stone-900 dark:text-stone-100">
                <CountUp value={totalProjects ?? 0} />
              </dd>
              <dt className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">proyek terbuka</dt>
            </div>
          </dl>

          {/* Testimoni berjalan otomatis menyamping seperti marquee skill.
              Berhenti saat hover; statis saat reduced-motion (aturan global). */}
          <div className="group relative mt-10 overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max gap-4 group-hover:[animation-play-state:paused] motion-safe:animate-[rk-marquee_40s_linear_infinite]">
              {[
                { kutip: 'Akhirnya ikut lomba pertama karena ketemu tim yang butuh desainer di sini.', nama: 'Rangga Pratama', meta: 'Desain Komunikasi Visual, UMP' },
                { kutip: 'Posting kebutuhan backend, dua hari kemudian tim kami lengkap berlima.', nama: 'Nadia Setyawan', meta: 'Informatika, Unsoed' },
                { kutip: 'Deadline semua lomba terpantau, tidak ada lagi info yang lewat di grup chat.', nama: 'Bagas Wicaksono', meta: 'Teknik Elektro, UMP' },
                { kutip: 'Akhirnya ikut lomba pertama karena ketemu tim yang butuh desainer di sini.', nama: 'Rangga Pratama', meta: 'Desain Komunikasi Visual, UMP' },
                { kutip: 'Posting kebutuhan backend, dua hari kemudian tim kami lengkap berlima.', nama: 'Nadia Setyawan', meta: 'Informatika, Unsoed' },
                { kutip: 'Deadline semua lomba terpantau, tidak ada lagi info yang lewat di grup chat.', nama: 'Bagas Wicaksono', meta: 'Teknik Elektro, UMP' },
              ].map((t, i) => (
                <figure
                  key={`${t.nama}-${i}`}
                  aria-hidden={i >= 3}
                  className="flex w-[85vw] max-w-[380px] shrink-0 flex-col justify-between rounded-2xl border border-stone-200 dark:border-stone-800 bg-[var(--card-bg)] p-5 sm:w-[380px]"
                >
                  <blockquote className="line-clamp-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                    &ldquo;{t.kutip}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <Avatar nama={t.nama} size="md" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-stone-900 dark:text-stone-100">{t.nama}</p>
                      <p className="truncate text-xs text-stone-500 dark:text-stone-400">{t.meta}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STRIP STATISTIK digabung ke social proof di atas agar tidak duplikat */}

      {/* SEGERA BERAKHIR: carousel scroll-snap, kartu masuk stagger */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Kompetisi</p>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Segera berakhir</h2>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Pendaftaran menutup paling cepat pada lomba-lomba ini.</p>
          </div>
          <Link href="/lomba" className="flex min-h-[44px] items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 transition-colors hover:text-brand-700 dark:hover:text-brand-300">
            Semua lomba
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
        {lombaList.length > 0 ? (
          <SnapRow label="Lomba mendekati deadline">
            {lombaList.map((c, i) => (
              <SnapCard key={c.id}>
                <TiltCard className="h-full">
                  <CompetitionCard
                    comp={c as CompetitionCardData}
                    timMencari={timMap[c.id] ?? 0}
                    priority={i < 3}
                  />
                </TiltCard>
              </SnapCard>
            ))}
          </SnapRow>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-6 py-10 text-center">
            <p className="font-semibold text-stone-800 dark:text-stone-200">Belum ada lomba aktif</p>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Ketahui lomba yang belum terdaftar? Usulkan agar temanmu ikut serta.</p>
            <Link href="/lomba/usul" className="mt-4 inline-flex min-h-[44px] items-center rounded-full border border-brand-600 px-4 py-2.5 text-sm font-semibold text-brand-600 dark:text-brand-400 transition hover:bg-brand-50 dark:hover:bg-brand-950 dark:hover:bg-brand-950">
              Usulkan Lomba
            </Link>
          </div>
        )}
      </section>

      {/* CARA KERJA: sticky-stack, kartu pin dan menumpuk saat scroll */}
      <section className="border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Cara kerjanya</h2>
          <p className="mt-1 max-w-xl text-sm text-stone-600 dark:text-stone-400">
            Tiga langkah dari menemukan lomba sampai tim terbentuk.
          </p>
          <HowStickyStack
            steps={[
              {
                icon: 'Compass',
                title: 'Temukan',
                body: 'Telusuri lomba yang masih membuka pendaftaran, urut dari deadline terdekat, lengkap dengan biaya dan tingkatnya.',
              },
              {
                icon: 'PaperPlaneTilt',
                title: 'Ajukan',
                body: 'Kirim pengajuan gabung dengan pesan singkat ke pemilik tim. Kontak WhatsApp terbuka setelah kamu diterima.',
              },
              {
                icon: 'UsersThree',
                title: 'Bentuk tim',
                body: 'Slot anggota berkurang otomatis setiap ada yang diterima. Tim siap bertanding atau mengerjakan proyek.',
              },
            ]}
          />
        </div>
      </section>

      {/* BENTO: 3 sel pas dengan konten, spotlight mengikuti kursor */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <RevealGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <RevealItem className="md:col-span-2">
            <SpotlightCard lift className="h-full">
              <div className="flex h-full flex-col sm:flex-row">
                <div className="relative min-h-[160px] flex-1 overflow-hidden sm:min-h-[200px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://picsum.photos/seed/mahasiswa-diskusi-kelompok/900/600"
                    alt="Mahasiswa berdiskusi dalam kelompok"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Satu platform, tiga tujuan</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    Lomba, rekrutmen tim, dan proyek kolaborasi dalam satu tempat. Tidak perlu lagi menyebar info lewat grup chat.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </RevealItem>
          <RevealItem>
            <SpotlightCard lift className="flex h-full flex-col justify-between p-6">
              <Trophy size={32} weight="duotone" className="text-brand-600 dark:text-brand-400" />
              <div className="mt-6">
                <p className="font-mono text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">{totalComps ?? 0}</p>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">lomba aktif menunggu pendaftaran</p>
              </div>
            </SpotlightCard>
          </RevealItem>
          <RevealItem className="md:col-span-3">
            <SpotlightCard className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="flex min-w-0 items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://picsum.photos/seed/mahasiswa-belajar-bersama/200/200"
                  alt="Kelompok mahasiswa belajar bersama"
                  loading="lazy"
                  className="hidden h-16 w-16 shrink-0 rounded-xl object-cover sm:block"
                />
                <div>
                  <p className="font-bold text-stone-900 dark:text-stone-100">Rekrutmen terbuka</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    <span className="font-mono font-bold">{(totalPosts ?? 0) - (totalProjects ?? 0)}</span> tim lomba dan{' '}
                    <span className="font-mono font-bold">{totalProjects ?? 0}</span> proyek sedang mencari anggota
                  </p>
                </div>
              </div>
              <Link href="/tim" className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800">
                Lihat rekrutmen
                <ArrowRight size={16} weight="bold" />
              </Link>
            </SpotlightCard>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* MARQUEE: satu-satunya, keahlian populer dari database */}
      <section className="border-y border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 py-8">
        <Marquee items={skillNames.length > 0 ? skillNames : ['Frontend', 'UI/UX', 'Data', 'Karya Tulis', 'Video', 'IoT']} />
      </section>

      {/* REKRUTMEN TERBARU: baris list ringkas */}
      {teamList.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Baru membuka slot</h2>
            <Link href="/tim" className="flex min-h-[44px] items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 transition-colors hover:text-brand-700 dark:hover:text-brand-300">
              Semua tim
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {teamList.map((p) => {
              const rawUsers = (p as unknown as { users?: { nama?: string } | { nama?: string }[] | null }).users
              const nama = (Array.isArray(rawUsers) ? rawUsers[0]?.nama : rawUsers?.nama) ?? 'Anonim'
              return (
                <Link key={p.id} href={`/tim/${p.id}`} className="group flex items-center justify-between gap-4 border-t border-stone-100 py-5 first:border-t-0 md:first:border-t dark:border-stone-800">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar nama={nama} size="md" />
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 text-base font-bold text-stone-900 transition-colors group-hover:text-brand-600 dark:text-stone-100 dark:group-hover:text-brand-400">{p.judul}</h3>
                      <p className="mt-0.5 line-clamp-1 text-sm text-stone-500 dark:text-stone-400">oleh {nama} · Slot {p.slot_terisi}/{p.slot_total}</p>
                    </div>
                  </div>
                  <span className="font-mono shrink-0 text-xs font-medium text-stone-500 dark:text-stone-400">Lihat</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* PROYEK: header tengah, variasi dari section lain */}
      {proyekList.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:pb-16">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Proyek kolaborasi</h2>
            <Link href="/proyek" className="flex min-h-[44px] items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 transition-colors hover:text-brand-700 dark:hover:text-brand-300">
              Semua proyek
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {proyekList.map((p) => (
              <Link key={p.id} href={`/proyek/${p.id}`} className="surface-card group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900 p-5 shadow-sm">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 sm:flex">
                    <Rocket size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="line-clamp-1 text-base font-bold text-stone-900 dark:text-stone-100 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">{p.judul}</h3>
                    <p className="mt-0.5 line-clamp-1 text-sm text-stone-500 dark:text-stone-400">{p.deskripsi}</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs font-medium text-stone-500 dark:text-stone-400">Anggota {p.slot_terisi}/{p.slot_total}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA PENUTUP: magnetik, latar aksen bergeser lambat */}
      {/* TODO: generate/replace ilustrasi flat-style untuk latar hero/CTA yang subtle */}
      <DriftBackdrop className="border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
            Punya keahlian? Ada tim yang menunggu.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-stone-600 dark:text-stone-400">
            Daftar, lengkapi profilmu, dan mulai dari postingan pertama hari ini.
          </p>
          <div className="mt-8">
            <MagneticLink href="/daftar">Daftar</MagneticLink>
          </div>
        </section>
      </DriftBackdrop>
    </div>
  )
}
