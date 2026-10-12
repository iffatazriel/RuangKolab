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
node scripts/migrate.mjs           # jalankan migrasi 001-007 ke Supabase
node scripts/seed.mjs              # data contoh: 4 kampus + 30 lomba
npm run dev
```

Buka `http://localhost:3000`.

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
3. Deploy; jalankan migrasi dan seed sekali dari mesin lokal ke database produksi

## Peta Fitur (PRD)

- **Lomba**: katalog + filter (kategori, tingkat, deadline, biaya), detail, usulan lomba dengan persetujuan moderator, simpan ke minat
- **Tim & Proyek**: buka rekrutmen, ajukan gabung, terima/tolak/batalkan, slot otomatis penuh, kontak WhatsApp terbuka setelah diterima
- **Dashboard**: notifikasi in-app, pengajuan masuk, status lamaran, minat, usulan
- **Moderasi**: antrean usulan lomba, laporan konten
- **Akun**: email + kata sandi, reset sandi, hapus akun
