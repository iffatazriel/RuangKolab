# RuangKolab

Platform kolaborasi mahasiswa: temukan lomba kampus, rekrut rekan tim, dan mulai proyek kolaborasi. Pilot satu kampus di Purwokerto, antarmuka Bahasa Indonesia, tanpa monetisasi.

Dibangun sesuai [PRD v1](<PRD_ Platform Lomba & Kolaborasi Mahasiswa.md>): fokus P0, tanpa chat real-time, tanpa rating, tanpa fitur berbayar.

## Teknologi

| Lapisan | Pilihan |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) + TypeScript |
| Database, Auth | Supabase (PostgreSQL) dengan Row-Level Security penuh |
| Styling | Tailwind CSS v4 + komponen internal (`src/components/ui`) |
| Motion | `motion` (token terpusat di `src/lib/motion.ts`) |
| Ikon | `@phosphor-icons/react` |
| Hosting target | Vercel |

## Struktur

```
app/                  # Rute Next.js App Router
  lomba/ tim/ proyek/ #   katalog + detail + form
  dashboard/          #   pusat aktivitas (sidebar, notifikasi)
  moderasi/           #   panel admin/moderator
  api/account/        #   hapus akun (service role, server-only)
  auth/callback/      #   penukar kode OAuth/reset
src/
  components/         #   ui/, layout/, motion/
  lib/                #   supabase client/server, errors, motion, types
supabase/migrations/  #   001-007, urut sesuai nomor
scripts/              #   migrate.mjs, seed.mjs
```

## Menjalankan Lokal

```bash
npm install
cp .env.local.example .env.local   # isi nilainya
npm run dev
```

Buka `http://localhost:3000`.

## Migrasi Database

Migrasi dijalankan lewat **Supabase Dashboard → SQL Editor** (bukan script;
DDL tidak bisa lewat REST). Salin isi file dari `supabase/migrations/`
**urut sesuai nomor** (001 sampai 007) ke SQL Editor lalu Run satu per satu:

1. `001_initial_schema.sql` - tabel inti, enum, seed kampus + skills
2. `002_auth_trigger.sql` - auto-buat profil saat signup
3. `003_slot_counter_trigger.sql` - slot otomatis + cegah self-join
4. `004_rls_policies.sql` - Row-Level Security
5. `005_fixes_notifications_project_fields.sql` - perbaikan RLS, notifikasi, kolom proyek
6. `006_usulan_favorit_ratelimit.sql` - usulan lomba, favorit, rate limit
7. `007_notifikasi_link_dan_validasi.sql` - link notifikasi, validasi pengajuan

Setelah itu, isi data contoh:

```bash
node scripts/seed.mjs   # 4 kampus + 30 lomba contoh (idempoten)
```

## Environment Variables

| Variabel | Dipakai di mana | Catatan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | server + klien | Boleh publik |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | server + klien | Boleh publik, RLS yang menjaga data |
| `SUPABASE_SERVICE_ROLE_KEY` | server saja | **Rahasia.** Hanya untuk `app/api/account` dan `scripts/` |

## Data Contoh

`scripts/seed.mjs` mengisi 30 lomba contoh dengan deadline relatif ke tanggal
eksekusi, sehingga selalu aktif saat dijalankan. Nama penyelenggara dan tautan
adalah contoh (domain `example.com`), bukan lomba sungguhan. Untuk pengujian
tambahan: `node scripts/seed.mjs --force`.

## Peran

- `student`: default, lewat trigger signup
- `moderator` / `admin`: ubah manual di SQL Editor
  ```sql
  update public.users set role = 'admin' where id = '<uuid>';
  ```

## Keamanan

- Semua tabel memakai RLS; kontak WhatsApp terkunci sampai pengajuan diterima
- Rate limit di level database: 5 postingan dan 10 pengajuan per 24 jam
- Kunci service role tidak pernah dikirim ke klien

## Deploy ke Vercel

1. Import repo ke Vercel
2. Isi ketiga environment variable di Project Settings
3. Deploy; jalankan migrasi via SQL Editor dan seed sekali dari mesin lokal ke database produksi

## Peta Fitur (PRD)

- **Lomba**: katalog + filter (kategori, tingkat, deadline, biaya), detail, usulan lomba dengan persetujuan moderator, simpan ke minat
- **Tim & Proyek**: buka rekrutmen, ajukan gabung, terima/tolak/batalkan, slot otomatis penuh, kontak WhatsApp terbuka setelah diterima
- **Dashboard**: notifikasi in-app, pengajuan masuk, status lamaran, minat, usulan
- **Moderasi**: antrean usulan lomba, laporan konten
- **Akun**: email + kata sandi, reset sandi, hapus akun
