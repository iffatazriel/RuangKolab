# RuangKolab

Platform kolaborasi mahasiswa: temukan lomba, bentuk tim, wujudkan proyek.
Dibangun dengan Next.js + TypeScript + Tailwind CSS + Supabase.

## Persiapan

1. Clone repo lalu install dependensi:

   ```bash
   npm install
   ```

2. Salin `.env.local.example` menjadi `.env.local`, lalu isi nilainya dari
   dashboard Supabase (Project Settings → API):

   | Variabel | Kegunaan |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | URL proyek Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (aman untuk klien) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **rahasia, hanya untuk script server** |

3. Jalankan migrasi database **berurutan** (`001` → `007`) lewat
   Supabase Dashboard → SQL Editor:

   ```
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/002_auth_trigger.sql
   supabase/migrations/003_slot_counter_trigger.sql
   supabase/migrations/004_rls_policies.sql
   supabase/migrations/005_fixes_notifications_project_fields.sql
   supabase/migrations/006_usulan_favorit_ratelimit.sql
   supabase/migrations/007_notifikasi_link_dan_validasi.sql
   ```

4. (Opsional, untuk fase uji) Isi data contoh — 4 kampus + 30 lomba aktif:

   ```bash
   node scripts/seed.mjs          # lewati jika lomba sudah >= 30
   node scripts/seed.mjs --force  # paksa tambah ulang
   ```

5. Jalankan aplikasi:

   ```bash
   npm run dev     # development di http://localhost:3000
   npm run build   # verifikasi production build
   npm run lint    # verifikasi eslint
   ```

## Login dengan Google (opsional)

Tombol login Google hanya berfungsi jika provider-nya diaktifkan:

1. Buka Supabase Dashboard → Authentication → Providers → Google → Enable.
2. Isi Client ID dan Client Secret dari Google Cloud Console.
3. Tambahkan URL callback `https://<domain-anda>/auth/callback`
   (untuk lokal: `http://localhost:3000/auth/callback`).

Jika belum diaktifkan, aplikasi tetap berjalan normal dengan email + kata sandi.

## Deploy ke Vercel

1. Import repo ke Vercel.
2. Tambahkan ketiga environment variable di atas di Project Settings.
3. Deploy. Migrasi database hanya perlu dijalankan sekali (lihat langkah 3).

## Struktur singkat

- `app/` — rute Next.js App Router (lomba, tim, proyek, dashboard, moderasi, auth)
- `src/components/` — komponen UI, layout, motion
- `src/lib/` — client Supabase, tipe, error, util
- `supabase/migrations/` — skema database + RLS + trigger (sumber kebenaran skema)
- `scripts/seed.mjs` — data contoh fase uji

## Catatan

- Peran `admin`/`moderator` diatur manual di tabel `users` lewat SQL Editor.
- Batas laju: maksimal 5 postingan dan 10 pengajuan per pengguna per 24 jam
  (ditegakkan trigger database, pesan ramah di form).
