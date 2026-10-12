/**
 * Seed data contoh untuk fase uji pilot.
 * 4 kampus di Purwokerto + 30 lomba aktif (deadline relatif ke tanggal run,
 * jadi selalu di masa depan saat dijalankan) + user demo + postingan tim/proyek
 * + backfill poster.
 *
 * Catatan jujur: ini data contoh, bukan lomba sungguhan. Tautan memakai
 * example.com (domain RFC reserved) agar tidak menipu pengguna. Akun demo
 * memakai email @contoh.id dan bio bertanda [AKUN DEMO].
 *
 * Jalankan: node scripts/seed.mjs        (idempoten: skip bila sudah >= 30 lomba)
 *           node scripts/seed.mjs --force (tambahkan ulang 30 lomba contoh)
 */
import 'dotenv/config'
import { createRequire } from 'module'
const require = createRequire(new URL('.', import.meta.url))
const { createClient } = require('@supabase/supabase-js')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('Env belum lengkap: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib ada di .env.local')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

// --- Kampus (UMP sudah dibuat oleh migrasi 001, sisanya untuk ekspansi) ---
const CAMPUSES = [
  { id: 'a0000000-0000-0000-0000-000000000001', nama: 'Universitas Muhammadiyah Purwokerto', kota: 'Purwokerto' },
  { id: 'a0000000-0000-0000-0000-000000000002', nama: 'Universitas Purwokerto', kota: 'Purwokerto' },
  { id: 'a0000000-0000-0000-0000-000000000003', nama: 'Institut Teknologi dan Bisnis Asia Malang', kota: 'Malang' },
  { id: 'a0000000-0000-0000-0000-000000000004', nama: 'Politeknik Harapan Bangsa', kota: 'Purwokerto' },
]

const UMP_ID = CAMPUSES[0].id

// 30 lomba contoh. Deadline dihitung dari "hari ini + n hari" agar selalu aktif.
const hari = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString()

const LOMBA = [
  { judul: 'TEMA Nasional 2026: Karya Tulis Ilmiah Kesehatan', penyelenggara: 'BEM FK Universitas Jember', kategori: 'Ilmiah', tingkat: 'Nasional', d: 6, biaya: 75000, url: 'https://example.com/tema-nasional-2026', deskripsi: 'Tren Penelitian Mahasiswa. Dua tahap: ringkasan 1500 kata, lalu full paper bagi yang lolos. Tim 1-3 orang.' },
  { judul: 'Lomba Esai Ilmiah Mahasiswa Kesehatan', penyelenggara: 'IMSSA UNJANI', kategori: 'Ilmiah', tingkat: 'Nasional', d: 9, biaya: 50000, url: 'https://example.com/esai-ilmiah-kesehatan', deskripsi: 'Tema kesehatan masyarakat. Esai 2000 kata, individu, pendaftaran via form resmi.' },
  { judul: 'Poster Ilmiah Nasional: Riset Terapan', penyelenggara: 'Himpunan Mahasiswa Teknik ITS', kategori: 'Ilmiah', tingkat: 'Nasional', d: 12, biaya: 60000, url: 'https://example.com/poster-ilmiah', deskripsi: 'Satu poster A1 dari penelitian mahasiswa, kolom sains terapan. Penjurian online.' },
  { judul: 'Infografis Penelitian Nasional', penyelenggara: 'UKM Jurnalistik Universitas Brawijaya', kategori: 'Ilmiah', tingkat: 'Nasional', d: 15, biaya: 45000, url: 'https://example.com/infografis-nasional', deskripsi: 'Data penelitian disajikan sebagai infografis tunggal. Format PNG, maksimal 5 MB.' },
  { judul: 'Konferensi Penelitian Mahasiswa Purwokerto', penyelenggara: 'LPPM Universitas Muhammadiyah Purwokerto', kategori: 'Ilmiah', tingkat: 'Internal Kampus', d: 21, biaya: 0, url: 'https://example.com/kpm-ump-2026', deskripsi: 'Presentasi riset mahasiswa lintas fakultas. Terbaik didampingi ke kompetisi nasional.' },
  { judul: 'Olimpiade Sains Terapan Mahasiswa', penyelenggara: 'Senat Mahasiswa Universitas Negeri Yogyakarta', kategori: 'Ilmiah', tingkat: 'Nasional', d: 24, biaya: 100000, url: 'https://example.com/olimpiade-sains', deskripsi: 'Kuis sains terapan online, dua putaran. Peserta individu dari semua jurusan.' },
  { judul: 'Hackathon Kampus Purwokerto', penyelenggara: 'UKM Robotik dan Pemrograman UMP', kategori: 'Teknologi', tingkat: 'Internal Kampus', d: 8, biaya: 0, url: 'https://example.com/hackathon-ump', deskripsi: 'Bangun prototipe dalam 24 jam. Tim 3-4 orang, satu laptop per orang, tema diumumkan saat pembukaan.' },
  { judul: 'UI/UX Design Challenge Nasional', penyelenggara: 'Komunitas Designer Jogja', kategori: 'Teknologi', tingkat: 'Nasional', d: 11, biaya: 50000, url: 'https://example.com/uiux-challenge-2026', deskripsi: 'Rancang ulang alur aplikasi layanan publik. Kirim file Figma beserta catatan keputusan desain.' },
  { judul: 'Mobile App Innovation Cup', penyelenggara: 'Google Developer Student Clubs Regionals', kategori: 'Teknologi', tingkat: 'Nasional', d: 14, biaya: 0, url: 'https://example.com/mobile-app-cup', deskripsi: 'Aplikasi mobile dengan dampak sosial terukur. Prototipe boleh berupa demo yang jalan.' },
  { judul: 'Cyber Security Capture The Flag', penyelenggara: 'Komunitas Keamanan Siber Universitas Telkom', kategori: 'Teknologi', tingkat: 'Nasional', d: 17, biaya: 125000, url: 'https://example.com/ctf-cyber-2026', deskripsi: 'Jeopardy-style: web exploitation, crypto, forensik. Tim 2-4 orang, 8 jam nonstop.' },
  { judul: 'IoT Smart Campus Challenge', penyelenggara: 'Institute of Engineers Indonesia Cabang', kategori: 'Teknologi', tingkat: 'Nasional', d: 20, biaya: 150000, url: 'https://example.com/iot-smart-campus', deskripsi: 'Perangkat IoT untuk manajemen energi kampus. Wajib dokumentasi skema rangkaian.' },
  { judul: 'Data Science Competition Nasional', penyelenggara: 'Statistika Universitas Padjadjaran', kategori: 'Teknologi', tingkat: 'Nasional', d: 26, biaya: 100000, url: 'https://example.com/data-science-2026', deskripsi: 'Prediksi pada dataset publik. Nilai dari akurasi dan kejelasan analisis, bukan hanya model.' },
  { judul: 'Web Development Cup Regional', penyelenggara: 'BEM FMIPA Universitas Sebelas Maret', kategori: 'Teknologi', tingkat: 'Regional', d: 30, biaya: 75000, url: 'https://example.com/webdev-cup', deskripsi: 'Bangun web dalam 12 jam sesuai brief. Regional Jawa Tengah dan DIY.' },
  { judul: 'AI & Machine Learning Hackathon', penyelenggara: 'Machine Learning ID Purwokerto', kategori: 'Teknologi', tingkat: 'Regional', d: 34, biaya: 60000, url: 'https://example.com/ai-ml-hackathon', deskripsi: 'Terapkan model ML pada kasus UMKM lokal. Wajib etika data dan penjelasan keterbatasan model.' },
  { judul: 'Game Jam Mahasiswa', penyelenggara: 'UKM Game Development UMP', kategori: 'Teknologi', tingkat: 'Internal Kampus', d: 40, biaya: 0, url: 'https://example.com/game-jam-ump', deskripsi: 'Buat game mini sesuai tema dalam 48 jam. Engine bebas, hasil dipamerkan di akhir pekan.' },
  { judul: 'Business Plan Competition Nasional', penyelenggara: 'Ekonomi Islam Universitas Airlangga', kategori: 'Bisnis', tingkat: 'Nasional', d: 10, biaya: 150000, url: 'https://example.com/bpc-nasional', deskripsi: 'Rencana bisnis lengkap dengan proyeksi 3 tahun. Pitching final luring di Surabaya.' },
  { judul: 'Marketing Campaign Challenge', penyelenggara: 'Himpunan Mahasiswa Manajemen UB', kategori: 'Bisnis', tingkat: 'Nasional', d: 13, biaya: 75000, url: 'https://example.com/marketing-challenge', deskripsi: 'Rancang kampanye pemasaran untuk produk UMKM mitra. Dinilai dari strategi dan anggaran.' },
  { judul: 'Startup Pitching Purwokerto', penyelenggara: 'Pusat Inovasi dan Inkubator UMP', kategori: 'Bisnis', tingkat: 'Internal Kampus', d: 18, biaya: 0, url: 'https://example.com/startup-pitching-ump', deskripsi: 'Pitch 7 menit plus 5 menit tanya jawab. Dua tim terbaik didampingi menuju kompetisi nasional.' },
  { judul: 'Business Model Canvas Contest', penyelenggara: 'FE Universitas Sultan Ageng Tirtayasa', kategori: 'Bisnis', tingkat: 'Nasional', d: 23, biaya: 50000, url: 'https://example.com/bmc-contest', deskripsi: 'Satu lembar BMC plus video 3 menit. Untuk ide bisnis yang belum berjalan.' },
  { judul: 'Olimpiade Literasi Keuangan Mahasiswa', penyelenggara: 'FEB Universitas Diponegoro', kategori: 'Bisnis', tingkat: 'Nasional', d: 28, biaya: 65000, url: 'https://example.com/literasi-keuangan', deskripsi: 'Dua putaran kuis literasi keuangan dan manajemen risiko pribadi.' },
  { judul: 'Poster Digital Design Award', penyelenggara: 'DKV Institut Teknologi Bandung', kategori: 'Desain', tingkat: 'Nasional', d: 7, biaya: 55000, url: 'https://example.com/poster-digital-award', deskripsi: 'Poster kampanye sosial. Satu karya per peserta, wajib menyertakan proses berpikir.' },
  { judul: 'Motion Graphics Challenge', penyelenggara: 'Animasi Universitas Multimedia Nusantara', kategori: 'Desain', tingkat: 'Nasional', d: 16, biaya: 90000, url: 'https://example.com/motion-graphics', deskripsi: 'Animasi 15-30 detik dengan tema bebas. Codec dan resolusi mengikuti ketentuan penyelenggara.' },
  { judul: 'Photography Contest: Sisi Kota Kita', penyelenggara: 'UKM Fotografi UMP', kategori: 'Desain', tingkat: 'Internal Kampus', d: 22, biaya: 20000, url: 'https://example.com/foto-sisi-kota', deskripsi: 'Tiga foto berurutan dengan narasi singkat. Kamera apa pun, termasuk ponsel.' },
  { judul: 'Logo Design Competition UMKM', penyelenggara: 'Dinas Koperasi dan UKM Purwokerto', kategori: 'Desain', tingkat: 'Regional', d: 27, biaya: 0, url: 'https://example.com/logo-umkm', deskripsi: 'Desain identitas untuk 5 UMKM binaan. Karya terpilih dipakai dengan kontrak sederhana.' },
  { judul: 'Lomba Karya Tulis Keislaman', penyelenggara: 'Pimpinan Daerah IMM Purwokerto', kategori: 'Lainnya', tingkat: 'Regional', d: 19, biaya: 25000, url: 'https://example.com/ktk-imm-2026', deskripsi: 'Esai keislaman aktual 2500 kata. Terbuka untuk mahasiswa seluruh Purwokerto.' },
  { judul: 'Lomba Debat Bahasa Inggris', penyelenggara: 'English Club Universitas Jenderal Soedirman', kategori: 'Lainnya', tingkat: 'Nasional', d: 25, biaya: 200000, url: 'https://example.com/english-debate', deskripsi: 'Format Asian Parliamentary. Tim dua orang, seluruh ronde menggunakan bahasa Inggris.' },
  { judul: 'English Speech Contest Nasional', penyelenggara: 'Sastra Inggris Universitas Gadjah Mada', kategori: 'Lainnya', tingkat: 'Nasional', d: 32, biaya: 80000, url: 'https://example.com/speech-contest-2026', deskripsi: 'Pidato 5 menit, materi dibagikan H-3. Putaran final dilaksanakan luring.' },
  { judul: 'Futsal Cup Antar Fakultas', penyelenggara: 'UKM Olahraga UMP', kategori: 'Olahraga', tingkat: 'Internal Kampus', d: 35, biaya: 150000, url: 'https://example.com/futsal-ump-cup', deskripsi: 'Skuad maksimal 12 orang, minimal dua pertandingan per tim. Format piala.' },
  { judul: 'Badminton Open Tournament', penyelenggara: 'PB Djarum Muda Purwokerto', kategori: 'Olahraga', tingkat: 'Regional', d: 45, biaya: 100000, url: 'https://example.com/badminton-open', deskripsi: 'Kelas ganda putra, ganda putri, dan campuran. Sistem poin rally 21.' },
  { judul: 'Lomba Film Pendek Nasional', penyelenggara: 'UKM Sinematografi Universitas Hasanuddin', kategori: 'Seni & Budaya', tingkat: 'Nasional', d: 33, biaya: 120000, url: 'https://example.com/film-pendek-2026', deskripsi: 'Durasi 5-12 menit, satu tema nasional. Wajib lampiran naskah dan daftar peralatan.' },
  { judul: 'Festival Paduan Suara Mahasiswa', penyelenggara: 'Paduan Suara Mahasiswa Universitas Indonesia', kategori: 'Seni & Budaya', tingkat: 'Nasional', d: 38, biaya: 250000, url: 'https://example.com/psm-festival', deskripsi: 'Repertoar wajib dan pilihan, 12 menit panggung. Minimal 16 penyanyi per paduan suara.' },
  { judul: 'Lomba Tari Tradisional Nusantara', penyelenggara: 'UKM Seni Tari Universitas Negeri Semarang', kategori: 'Seni & Budaya', tingkat: 'Nasional', d: 42, biaya: 175000, url: 'https://example.com/tari-nusantara', deskripsi: 'Durasi 6-10 menit, satu daerah per tim. Penilaian dari gerak, musik, dan kostum.' },
]

const FORCE = process.argv.includes('--force')

async function main() {
  // 1. Kampus: upsert agar id tetap konsisten
  const { error: campusErr } = await supabase
    .from('campuses')
    .upsert(CAMPUSES, { onConflict: 'id' })
  if (campusErr) {
    console.error('Gagal seed kampus:', campusErr.message)
    process.exit(1)
  }
  console.log(`Kampus siap: ${CAMPUSES.length}`)

  // 2. Lomba: cek jumlah yang sudah ada
  const { count, error: countErr } = await supabase
    .from('competitions')
    .select('id', { count: 'exact', head: true })
  if (countErr) {
    console.error('Gagal menghitung lomba:', countErr.message)
    process.exit(1)
  }

  if (count >= 30 && !FORCE) {
    console.log(`Sudah ada ${count} lomba. Lewati seed lomba (pakai --force untuk menambah ulang).`)
  } else {
    const rows = LOMBA.map((l) => ({
      campus_id: UMP_ID,
      judul: l.judul,
      penyelenggara: l.penyelenggara,
      kategori: l.kategori,
      tingkat: l.tingkat,
      deadline: hari(l.d),
      biaya: l.biaya,
      url: l.url,
      deskripsi: l.deskripsi,
      publish_status: 'published',
    }))

    const { error: insErr } = await supabase.from('competitions').insert(rows)
    if (insErr) {
      console.error('Gagal seed lomba:', insErr.message)
      process.exit(1)
    }
    console.log(`Lomba terseed: ${rows.length}`)
    console.log('Selesai. Data ini contoh untuk fase uji, bukan lomba sungguhan.')
  }

  await seedPosterDanTim()
}

// --- Poster: picsum stabil per judul (konteks netral, andal, tanpa API key) ---
function posterUntuk(judul) {
  const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
  return `https://picsum.photos/seed/${slug}/800/500`
}

// --- User demo (mahasiswa fiktif Purwokerto, email @contoh.id) ---
// Nomor WA fiktif 0812-0000-00x agar momen "kontak terbuka" bisa didemo.
const DEMO_USERS = [
  { email: 'demo.rizky@contoh.id', nama: 'Rizky Pratama', jurusan: 'Informatika', angkatan: 2022, bio: '[AKUN DEMO] Suka ngoprek web dan ikut hackathon.', whatsapp: '081200000011' },
  { email: 'demo.salsa@contoh.id', nama: 'Salsabila Zahra', jurusan: 'Desain Komunikasi Visual', angkatan: 2023, bio: '[AKUN DEMO] Desainer UI yang hobi bikin poster acara kampus.', whatsapp: '081200000022' },
  { email: 'demo.bagas@contoh.id', nama: 'Bagas Aditya', jurusan: 'Teknik Elektro', angkatan: 2021, bio: '[AKUN DEMO] Main IoT dan robotik sejak semester 3.', whatsapp: '081200000033' },
  { email: 'demo.nadia@contoh.id', nama: 'Nadia Rahmawati', jurusan: 'Manajemen', angkatan: 2023, bio: '[AKUN DEMO] Tertarik business plan dan pitching.', whatsapp: '081200000044' },
  { email: 'demo.fajar@contoh.id', nama: 'Fajar Nugroho', jurusan: 'Sistem Informasi', angkatan: 2022, bio: '[AKUN DEMO] Fokus data dan riset.', whatsapp: '081200000055' },
]

async function seedPosterDanTim() {
  // 1. Backfill poster yang kosong
  const { data: tanpaPoster } = await supabase.from('competitions').select('id, judul').is('poster_url', null).limit(200)
  for (const c of tanpaPoster ?? []) {
    await supabase.from('competitions').update({ poster_url: posterUntuk(c.judul) }).eq('id', c.id)
  }
  console.log(`Poster dibackfill: ${(tanpaPoster ?? []).length}`)

  // 2. User demo (idempoten via email)
  const { data: existing } = await supabase.auth.admin.listUsers({ perPage: 200 })
  const demoIds = {}
  for (const d of DEMO_USERS) {
    let id = existing?.users?.find((u) => u.email === d.email)?.id
    if (!id) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: d.email,
        password: 'demo-ruangkolab-123',
        email_confirm: true,
        user_metadata: { nama: d.nama },
      })
      if (error) {
        console.error(`Gagal buat ${d.email}:`, error.message)
        continue
      }
      id = data.user.id
      console.log(`User demo dibuat: ${d.email}`)
    }
    demoIds[d.email] = id
    // Trigger 002 sudah membuat baris users; lengkapi profilnya
    await supabase.from('users').update({
      nama: d.nama, jurusan: d.jurusan, angkatan: d.angkatan, bio: d.bio,
    }).eq('id', id)
    // Nomor demo agar alur buka-kontak bisa didemokan end-to-end
    await supabase.from('user_contacts').upsert(
      { user_id: id, whatsapp: d.whatsapp },
      { onConflict: 'user_id' },
    )
  }
  if (Object.keys(demoIds).length === 0) {
    console.log('Tidak ada user demo, lewati seed tim/proyek.')
    return
  }

  // 3. Postingan tim/proyek (skip bila sudah ada)
  const { count: postCount } = await supabase.from('team_posts').select('id', { count: 'exact', head: true })
  if ((postCount ?? 0) >= 8 && !FORCE) {
    console.log(`Sudah ada ${postCount} postingan. Lewati seed tim/proyek.`)
    return
  }

  const { data: lomba } = await supabase
    .from('competitions')
    .select('id, judul')
    .eq('publish_status', 'published')
    .order('deadline', { ascending: true })
    .limit(6)
  const { data: skills } = await supabase.from('skills').select('id, nama')
  const skillId = (nama) => skills?.find((s) => s.nama === nama)?.id
  const jamLalu = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString()
  const pemilik = Object.values(demoIds)

  const POSTS = [
    { owner: 1, tipe: 'competition', lombaIdx: 0, judul: 'Butuh UI/UX Designer untuk hackathon kampus', deskripsi: 'Tim kami sudah ada 2 programmer, tinggal butuh 1 desainer untuk prototipe Figma dan slide pitch. Ketemuan rutin tiap sore di sekre UKM.', slot_total: 4, slot_terisi: 3, skills: ['UI/UX Design', 'Penyusunan Proposal Pitch Deck'], jam: 5 },
    { owner: 0, tipe: 'competition', lombaIdx: 1, judul: 'Cari programmer backend untuk Web Dev Cup', deskripsi: 'Stack bebas, kami pakai Next.js + Supabase. Butuh yang bisa bantu API dan auth. Latihan tiap malam via Discord.', slot_total: 4, slot_terisi: 2, skills: ['Pengembangan Web/Aplikasi', 'Manajemen Proyek'], jam: 9 },
    { owner: 4, tipe: 'competition', lombaIdx: 2, judul: 'Tim esai: butuh editor dan periset', deskripsi: 'Topik kesehatan masyarakat. Saya pegang kerangka, butuh 1 periset data dan 1 editor bahasa. Target submit minggu depan.', slot_total: 3, slot_terisi: 1, skills: ['Penyusunan Esai', 'Analisis Data'], jam: 14 },
    { owner: 2, tipe: 'competition', lombaIdx: 3, judul: 'Butuh dokumenter foto/video untuk lomba robotik', deskripsi: 'Tim robotik kami butuh 1 orang dokumentasi untuk foto, video recap, dan konten medsos selama lomba.', slot_total: 5, slot_terisi: 4, skills: ['Fotografi & Videografi', 'Copywriting & Content Creation'], jam: 22 },
    { owner: 3, tipe: 'competition', lombaIdx: 4, judul: 'Cari pitcher untuk final business plan', deskripsi: 'Deck dan finansial sudah jadi, tinggal butuh 1 orang yang pede presentasi dan jawab pertanyaan juri.', slot_total: 3, slot_terisi: 2, skills: ['Public Speaking & Pitching', 'Riset & Validasi Pasar'], jam: 30 },
    { owner: 1, tipe: 'project', judul: 'Redesign aplikasi absensi UKM', deskripsi: 'Proyek santai bareng: redesign alur absensi UKM jadi aplikasi mobile. Cocok untuk portofolio. Ketemuan seminggu sekali.', slot_total: 4, slot_terisi: 1, skills: ['UI/UX Design', 'Pengembangan Web/Aplikasi'], jam: 40 },
    { owner: 4, tipe: 'project', judul: 'Riset chatbot tanya-jawab kampus', deskripsi: 'Eksperimen bikin chatbot dari FAQ kampus pakai data publik. Butuh yang tertarik NLP dan evaluasi model.', slot_total: 3, slot_terisi: 1, skills: ['Kecerdasan Buatan & ML', 'Analisis Data'], jam: 55 },
    { owner: 3, tipe: 'project', judul: 'Branding kantin kampus favorit', deskripsi: 'Bantu kantin langganan bikin logo, menu board, dan konten promo. Portofolio nyata + traktiran sepuasnya.', slot_total: 3, slot_terisi: 2, skills: ['Desain Grafis', 'Copywriting & Content Creation'], jam: 70 },
  ]

  let dibuat = 0
  for (const p of POSTS) {
    const row = {
      owner_id: pemilik[p.owner % pemilik.length],
      tipe: p.tipe,
      competition_id: p.tipe === 'competition' ? (lomba?.[p.lombaIdx % (lomba?.length || 1)]?.id ?? null) : null,
      judul: p.judul,
      deskripsi: p.deskripsi,
      slot_total: p.slot_total,
      slot_terisi: p.slot_terisi,
      status: p.slot_terisi >= p.slot_total ? 'full' : 'open',
      created_at: jamLalu(p.jam),
    }
    if (p.tipe === 'competition' && !row.competition_id) continue
    const { data: ins, error } = await supabase.from('team_posts').insert(row).select('id').single()
    if (error || !ins) {
      console.error(`Gagal seed post "${p.judul}":`, error?.message)
      continue
    }
    const skillRows = (p.skills ?? []).map(skillId).filter(Boolean).map((skill_id) => ({ post_id: ins.id, skill_id }))
    if (skillRows.length > 0) await supabase.from('post_skills').insert(skillRows)
    dibuat++
  }
  console.log(`Postingan tim/proyek terseed: ${dibuat}`)
}

main()
