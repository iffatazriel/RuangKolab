# PRD: Platform Lomba & Kolaborasi Mahasiswa

**Nama kerja:** KolabLomba (bisa diganti) **Versi:** 0.1 (Draft) **Tanggal:** 6 Oktober 2026 **Penulis:** Pengembang tunggal (solo) **Status:** Perencanaan

---

## 1. Ringkasan

Platform web untuk mahasiswa menemukan info lomba, mencari rekan satu tim, dan menemukan proyek kolaborasi. Dibuat sebagai proyek pembelajaran dan pengalaman pribadi oleh satu orang, tanpa target monetisasi.

## 2. Latar Belakang & Masalah

- Info lomba tersebar di Instagram, grup WhatsApp, dan situs penyelenggara, sehingga mudah terlewat.
- Mencari rekan tim biasanya lewat story atau grup chat, tidak terstruktur, dan terbatas pada lingkaran kenalan.
- Mahasiswa dengan keahlian berbeda (misalnya programmer dan desainer) sulit saling menemukan.

## 3. Tujuan

**Tujuan produk**

1. Mahasiswa dapat menemukan lomba yang relevan dalam waktu kurang dari 1 menit.
2. Mahasiswa dapat membentuk tim dengan alur yang jelas (posting, ajukan, terima).
3. Mahasiswa dapat menemukan atau mengajak orang untuk proyek kolaborasi.

**Tujuan pembelajaran (pengembang)**

- Merancang dan membangun aplikasi full-stack secara mandiri.
- Menguasai database relasional, autentikasi, otorisasi, deployment, dan pengelolaan proyek solo (Git, Kanban, dokumentasi).

## 4. Bukan Tujuan (Non-Goals) untuk v1

- Monetisasi, iklan, atau fitur berbayar.
- Chat real-time di dalam platform.
- Aplikasi mobile native.
- Sistem rating/ulasan antar pengguna.
- Cakupan multi-kampus di v1; fokus awal satu kampus, lalu diperluas ke kampus lain di Purwokerto setelah optimal.

## 5. Target Pengguna

| Persona | Kebutuhan |
| --- | --- |
| **Pencari lomba** | Mahasiswa yang ingin ikut lomba tapi tidak tahu lomba apa dan kapan deadline-nya |
| **Pencari tim** | Mahasiswa yang punya ide/minat lomba tapi kekurangan anggota dengan keahlian tertentu |
| **Penggagas proyek** | Mahasiswa yang punya proyek (open source, riset, startup kampus) dan butuh kolaborator |
| **Admin** | Pengembang yang mengelola sistem, konten, dan laporan |
| **Moderator** | Dosen/pembimbing yang bersedia meninjau laporan dan menghapus konten |

**Pengguna awal:** mahasiswa semester akhir dan pertengahan di kampus pengembang (target 30-50 pengguna di fase uji).

## 6. Alur Pengguna Utama

1. **Cari lomba:** buka daftar lomba → filter kategori/deadline → buka detail → klik tautan resmi.
2. **Buat postingan cari tim:** login → pilih lomba → isi peran yang dicari, jumlah slot, deskripsi → terbit.
3. **Gabung tim:** lihat postingan → "Ajukan gabung" + pesan singkat → pembuat postingan menerima/menolak → jika diterima, kontak WhatsApp terbuka.
4. **Proyek kolaborasi:** buat postingan proyek (tanpa lomba) → alur ajukan/terima sama seperti cari tim.

## 7. Kebutuhan Fungsional

Prioritas: **P0** wajib untuk v1, **P1** sebaiknya ada, **P2** nanti.

### 7.1 Akun & Profil

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F-01 | Daftar dan masuk dengan email + kata sandi | P0 |
| F-02 | Masuk dengan Google | P1 |
| F-03 | Profil: nama, kampus, jurusan, angkatan, bio, tautan portofolio | P0 |
| F-04 | Tag keahlian dan minat pada profil | P0 |
| F-05 | Nomor WhatsApp disimpan privat, tidak tampil publik | P0 |
| F-06 | Verifikasi email kampus (.ac.id) | P2 |

### 7.2 Daftar Lomba

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F-10 | Daftar lomba dengan field: judul, penyelenggara, kategori, tingkat, deadline, biaya, tautan resmi, poster, deskripsi | P0 |
| F-11 | Pencarian berdasarkan kata kunci | P0 |
| F-12 | Filter kategori, tingkat, deadline, biaya | P0 |
| F-13 | Lomba yang lewat deadline disembunyikan otomatis dari daftar utama | P0 |
| F-14 | Admin dapat menambah/mengedit/menghapus lomba (input manual) | P0 |
| F-15 | Pengguna dapat mengusulkan lomba, disetujui admin | P1 |
| F-16 | Simpan lomba ke daftar "minat saya" | P1 |

### 7.3 Cari Tim

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F-20 | Buat postingan cari tim terkait satu lomba: peran dicari, jumlah slot, deskripsi | P0 |
| F-21 | Daftar postingan per lomba dan daftar umum dengan filter keahlian | P0 |
| F-22 | Ajukan gabung dengan pesan singkat | P0 |
| F-23 | Pembuat postingan menerima atau menolak pengajuan | P0 |
| F-24 | Kontak WhatsApp terbuka hanya setelah pengajuan diterima | P0 |
| F-25 | Slot berkurang saat anggota diterima; postingan otomatis "penuh" jika slot habis | P0 |
| F-26 | Pembuat dapat menutup atau menghapus postingannya | P0 |
| F-27 | Pengguna dapat membatalkan pengajuan yang masih pending | P1 |

### 7.4 Proyek Kolaborasi

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F-30 | Buat postingan proyek: judul, deskripsi, keahlian dicari, komitmen waktu, tautan repo (opsional) | P0 |
| F-31 | Alur ajukan/terima sama dengan Cari Tim | P0 |
| F-32 | Filter proyek berdasarkan keahlian | P1 |

### 7.5 Moderasi & Notifikasi

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F-40 | Tombol laporkan pada postingan dan profil | P0 |
| F-41 | Halaman admin/moderator untuk meninjau laporan dan menghapus konten | P0 |
| F-45 | Peran moderator (dosen/pembimbing) dengan hak terbatas | P0 |
| F-42 | Notifikasi di dalam aplikasi (pengajuan baru, diterima/ditolak) | P1 |
| F-43 | Notifikasi email | P2 |
| F-44 | Rekomendasi anggota berdasarkan kecocokan keahlian (AI/pencocokan tag) | P2 |

## 8. Kebutuhan Non-Fungsional

- **Responsif:** nyaman di layar HP (target utama pengguna).
- **Performa:** halaman utama termuat kurang dari 3 detik pada koneksi 4G.
- **Keamanan:** kata sandi di-hash (ditangani penyedia autentikasi), validasi input, perlindungan terhadap XSS/CSRF/SQL injection, aturan akses per baris (row-level security) pada database.
- **Privasi:** data kontak hanya terbuka setelah persetujuan; pengguna bisa menghapus akunnya.
- **Aksesibilitas:** kontras warna memadai, label form jelas, navigasi keyboard dasar.
- **Biaya:** berjalan di tier gratis (Vercel + Supabase) pada skala awal.
- **Bahasa:** antarmuka Bahasa Indonesia.

## 9. Model Data (Garis Besar)

| Entitas | Atribut utama | Relasi |
| --- | --- | --- |
| `campuses` | id, nama, kota | satu kampus banyak `users` dan `competitions` |
| `users` | id, email, nama, campus_id, jurusan, angkatan, bio, portofolio_url, whatsapp, role | banyak-ke-banyak dengan `skills` |
| `skills` | id, nama | banyak-ke-banyak dengan `users` dan `posts` |
| `competitions` | id, judul, penyelenggara, kategori, tingkat, deadline, biaya, url, poster_url, deskripsi, status | satu lomba banyak `team_posts` |
| `team_posts` | id, owner_id, competition_id (nullable untuk proyek), tipe (lomba/proyek), judul, deskripsi, slot_total, slot_terisi, status | milik `users`, banyak `join_requests` |
| `join_requests` | id, post_id, user_id, pesan, status (pending/accepted/rejected/cancelled) | menghubungkan `users` dan `team_posts` |
| `reports` | id, reporter_id, target_type, target_id, alasan, status | oleh `users` |
| `notifications` | id, user_id, tipe, payload, dibaca | milik `users` |

## 10. Teknologi

| Lapisan | Pilihan |
| --- | --- |
| Frontend + backend | Next.js + TypeScript |
| Database, auth, storage | Supabase (PostgreSQL) |
| Styling | Tailwind CSS |
| Hosting | Vercel |
| Manajemen proyek | GitHub Projects (Kanban), Git branch per fitur |
| Desain | Figma atau sketsa kertas |

Pilihan dapat diganti dengan stack yang lebih dikuasai (Laravel + MySQL, Django + PostgreSQL).

## 11. Metrik Keberhasilan

| Metrik | Target fase uji (4 minggu setelah rilis) |
| --- | --- |
| Pengguna terdaftar | 30-50 |
| Info lomba aktif di platform | minimal 30 |
| Postingan cari tim/proyek | minimal 15 |
| Tim yang berhasil terbentuk (ada pengajuan diterima) | minimal 5 |
| Pengguna yang kembali dalam 7 hari | minimal 30% |
| Umpan balik terkumpul dari pengguna uji | minimal 10 respons |

## 12. Rencana Rilis

| Minggu | Target |
| --- | --- |
| 1 | PRD final, ERD, sketsa layar, setup repo dan papan tugas |
| 2-3 | Autentikasi dan profil (F-01, F-03, F-04, F-05) |
| 4 | Daftar lomba, pencarian, filter, halaman admin (F-10 sampai F-14) |
| 5-6 | Cari tim dan alur ajukan/terima (F-20 sampai F-26) |
| 7 | Proyek kolaborasi, laporan/moderasi, perapian tampilan HP |
| 8 | Deploy, uji dengan 5-10 teman, kumpulkan keluhan |
| 9-10 | Perbaikan dari umpan balik, fitur P1 yang paling diminta |

## 13. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Platform kosong, tidak ada yang memakai | Tinggi | Isi 30 lomba sendiri sebelum peluncuran; mulai dari satu lingkaran kecil |
| Lingkup membengkak, proyek solo mandek | Tinggi | Kunci lingkup P0; ide baru masuk daftar "nanti" |
| Spam atau postingan palsu (email kampus tidak wajib) | Sedang | Verifikasi email, rate limit, tombol laporan, admin dan moderator, wajib login untuk posting |
| Kebocoran data pribadi | Tinggi | Nomor WhatsApp privat, row-level security, uji hak akses |
| Info lomba kedaluwarsa atau tidak akurat | Sedang | Sembunyikan otomatis setelah deadline; tautan resmi wajib diisi |
| Kehabisan waktu karena kuliah/skripsi | Sedang | Tiket kecil (1-2 hari), target mingguan realistis, jadwal longgar |

## 14. Keputusan & Pertanyaan Terbuka

**Keputusan (diperbarui 6 Oktober 2026)**

| # | Pertanyaan | Keputusan | Dampak pada desain |
| --- | --- | --- | --- |
| 1 | Cakupan kampus | Satu kampus dahulu. Setelah optimal, diperluas ke kampus lain di Purwokerto | Tabel `campuses` dibuat sejak awal dan semua data lomba/postingan/profil terhubung ke kampus, agar ekspansi tidak perlu merombak database. UI v1 tetap satu kampus |
| 2 | Email kampus | Tidak wajib | Verifikasi email biasa tetap diwajibkan; batas laju (rate limit) pembuatan postingan dan pengajuan; lencana "terverifikasi kampus" opsional (P2) |
| 3 | Moderator | Dosen atau pembimbing yang bersedia, selain pengembang | Peran `moderator` ditambahkan: dapat meninjau laporan dan menghapus konten, tanpa akses pengaturan sistem |
| 4 | Pengisian info lomba | Manual di v1, ekstraksi otomatis di fase lanjut | Form input lomba dirancang agar strukturnya sama dengan keluaran ekstraksi nanti (judul, deadline, biaya, dst.) |

**Masih terbuka**

1. Nama final produk.
2. Kampus mana yang menjadi pilot.
3. Siapa dosen/pembimbing yang akan diajak sebagai moderator, dan bagaimana alur persetujuannya.

## 15. Fase Lanjutan (Setelah v1)

- Rekomendasi anggota tim berbasis keahlian dan minat.
- Ekstraksi otomatis info lomba dari teks atau poster (rencana pasti, setelah input manual stabil).
- Perluasan ke kampus lain di Purwokerto.
- Notifikasi email dan pengingat deadline.
- Verifikasi kampus dan lencana profil.
- Riwayat dan portofolio lomba per pengguna.