/**
 * E2E-CHECK: membuktikan alur inti lewat API asli (bukanзависимо hanya baca kode).
 * 1. Pemilik buat postingan sementara (judul [E2E-CHECK])
 * 2. Pelamar ajukan gabung -> RLS negatif: WA pemilik tetap tak terbaca
 * 3. Pemilik terima -> slot_terisi +1, notifikasi masuk ke pelamar
 * 4. Postingan penuh otomatis saat slot habis (F-25)
 * 5. Pelamar yang diterima bisa baca WA pemilik (F-24)
 * 6. Bersih-bersih: hapus postingan sementara (cascade) + notifikasi uji
 *
 * Memakai akun demo (@contoh.id). Aman dijalankan ulang.
 */
import 'dotenv/config'
import { createRequire } from 'module'
const require = createRequire(new URL('.', import.meta.url))
const { createClient } = require('@supabase/supabase-js')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !anon || !serviceKey) {
  console.error('Env belum lengkap.')
  process.exit(1)
}

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
const results = []
const ok = (nama, lolos, detail = '') => {
  results.push({ nama, lolos })
  console.log(`${lolos ? 'PASS' : 'FAIL'}  ${nama}${detail ? ` (${detail})` : ''}`)
}

const asUser = async (email) => {
  const c = createClient(url, anon, { auth: { autoRefreshToken: false, persistSession: false } })
  const { error } = await c.auth.signInWithPassword({ email, password: 'demo-ruangkolab-123' })
  if (error) throw new Error(`Login gagal ${email}: ${error.message}`)
  return c
}

const main = async () => {
  // Setup: id demo + satu lomba published
  const { data: users } = await admin.from('users').select('id')
  const emails = ['demo.rizky@contoh.id', 'demo.nadia@contoh.id', 'demo.fajar@contoh.id']
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
  const byEmail = Object.fromEntries((list?.users ?? []).filter((u) => emails.includes(u.email)).map((u) => [u.email, u.id]))
  if (Object.keys(byEmail).length < 3) {
    console.error('Akun demo belum ada. Jalankan node scripts/seed.mjs dulu.')
    process.exit(1)
  }
  void users
  const { data: comps } = await admin.from('competitions').select('id').eq('publish_status', 'published').limit(1)
  if (!comps?.length) {
    console.error('Tidak ada lomba published.')
    process.exit(1)
  }

  const rizky = await asUser('demo.rizky@contoh.id')
  const nadia = await asUser('demo.nadia@contoh.id')
  const fajar = await asUser('demo.fajar@contoh.id')

  // 1. Pemilik buat postingan sementara (slot 2)
  const { data: post, error: ePost } = await rizky.from('team_posts').insert({
    owner_id: byEmail['demo.rizky@contoh.id'],
    tipe: 'competition',
    competition_id: comps[0].id,
    judul: '[E2E-CHECK] Postingan sementara uji alur',
    deskripsi: 'Dihapus otomatis oleh scripts/e2e-check.mjs.',
    slot_total: 2,
  }).select('id').single()
  ok('1. Pemilik bisa buat postingan (RLS insert)', !ePost, ePost?.message ?? post.id)
  if (!post) return finish(1)
  const postId = post.id

  // 2. Pelamar ajukan gabung
  const { data: req1, error: eReq1 } = await nadia.from('join_requests').insert({
    post_id: postId, user_id: byEmail['demo.nadia@contoh.id'], pesan: '[E2E-CHECK] Saya ikut!',
  }).select('id').single()
  ok('2. Pelamar bisa ajukan gabung', !eReq1, eReq1?.message ?? req1.id)
  if (!req1) return finish(1)

  // 3. RLS negatif: WA pemilik tak terbaca sebelum diterima
  const { data: waBlocked } = await nadia.from('user_contacts').select('user_id').eq('user_id', byEmail['demo.rizky@contoh.id'])
  ok('3. WA terkunci sebelum diterima (F-24 negatif)', (waBlocked ?? []).length === 0, `terbaca: ${(waBlocked ?? []).length} baris`)

  // 4. Pemilik terima -> slot +1
  const { error: eAcc1 } = await rizky.from('join_requests').update({ status: 'accepted' }).eq('id', req1.id)
  const { data: p1 } = await admin.from('team_posts').select('slot_terisi, status').eq('id', postId).single()
  ok('4. Terima menaikkan slot (F-25)', !eAcc1 && p1?.slot_terisi === 1, `slot_terisi=${p1?.slot_terisi}`)

  // 5. Notifikasi masuk ke pelamar
  const { data: notif } = await nadia.from('notifications').select('id').filter('payload->>post_id', 'eq', postId)
  ok('5. Notifikasi diterima pelamar (F-42)', (notif ?? []).length > 0, `${(notif ?? []).length} notif`)

  // 6. Pelamar kedua + terima -> penuh otomatis
  const { data: req2 } = await fajar.from('join_requests').insert({
    post_id: postId, user_id: byEmail['demo.fajar@contoh.id'], pesan: '[E2E-CHECK] Ikut juga!',
  }).select('id').single()
  await rizky.from('join_requests').update({ status: 'accepted' }).eq('id', req2.id)
  const { data: p2 } = await admin.from('team_posts').select('slot_terisi, status').eq('id', postId).single()
  ok('6. Otomatis penuh saat slot habis', p2?.slot_terisi === 2 && p2?.status === 'full', `slot=${p2?.slot_terisi} status=${p2?.status}`)

  // 7. RLS positif: WA terbuka setelah diterima
  const { data: waOpen } = await nadia.from('user_contacts').select('whatsapp').eq('user_id', byEmail['demo.rizky@contoh.id'])
  ok('7. WA terbuka setelah diterima (F-24 positif)', (waOpen ?? []).length === 1, waOpen?.[0] ? 'terbaca' : 'tetap terkunci')

  // 8. Bersih-bersih
  await admin.from('notifications').delete().filter('payload->>post_id', 'eq', postId)
  const { error: eDel } = await admin.from('team_posts').delete().eq('id', postId)
  const { count: sisaReq } = await admin.from('join_requests').select('id', { count: 'exact', head: true }).eq('post_id', postId)
  ok('8. Data uji bersih (cascade)', !eDel && (sisaReq ?? -1) === 0, `sisa request: ${sisaReq}`)

  return finish(0)
}

const finish = (code) => {
  const gagal = results.filter((r) => !r.lolos).length
  console.log(`\nHasil: ${results.length - gagal}/${results.length} lolos`)
  process.exit(gagal > 0 ? 1 : code)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
