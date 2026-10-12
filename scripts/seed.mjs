/**
 * Seed data contoh untuk fase uji pilot.
 * 4 kampus di Purwokerto + 30 lomba aktif (deadline relatif ke tanggal run,
 * jadi selalu di masa depan saat dijalankan).
 *
 * Catatan jujur: ini data contoh, bukan lomba sungguhan. Tautan memakai
 * example.com (domain RFC reserved) agar tidak menipu pengguna.
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
    console.log(`Sudah ada ${count} lomba. Lewati seed (pakai --force untuk menambah ulang).`)
    return
  }

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

main()
