/**
 * Bersih-bersih data demo sebelum LAUNCH production.
 * Menghapus: postingan tim/proyek milik akun @contoh.id, lomba contoh
 * (url example.com), kontak/skill demo, lalu akun demo itu sendiri.
 *
 * Default DRY-RUN (hanya menampilkan yang akan dihapus):
 *   node scripts/clean-demo.mjs
 * Eksekusi sungguhan:
 *   node scripts/clean-demo.mjs --confirm
 *
 * JANGAN jalankan di database dev selama masih butuh data contoh.
 */
import 'dotenv/config'
import { createRequire } from 'module'
const require = createRequire(new URL('.', import.meta.url))
const { createClient } = require('@supabase/supabase-js')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('Env belum lengkap.')
  process.exit(1)
}
const CONFIRM = process.argv.includes('--confirm')
const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

const main = async () => {
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
  const demoAuth = (list?.users ?? []).filter((u) => (u.email ?? '').endsWith('@contoh.id'))
  const demoIds = demoAuth.map((u) => u.id)
  console.log(`Akun demo: ${demoAuth.length} (${demoAuth.map((u) => u.email).join(', ') || '-'})`)

  const { data: demoPosts } = demoIds.length
    ? await admin.from('team_posts').select('id').in('owner_id', demoIds)
    : { data: [] }
  console.log(`Postingan milik demo: ${(demoPosts ?? []).length}`)

  const { data: demoLomba } = await admin.from('competitions').select('id, judul').like('url', '%example.com%')
  console.log(`Lomba contoh (example.com): ${(demoLomba ?? []).length}`)

  if (!CONFIRM) {
    console.log('\nDRY-RUN: tidak ada yang dihapus. Tambahkan --confirm untuk eksekusi.')
    return
  }

  const postIds = (demoPosts ?? []).map((p) => p.id)
  if (postIds.length > 0) {
    // Notifikasi yang merujuk postingan demo
    const { data: notifs } = await admin.from('notifications').select('id, payload')
    const kena = (notifs ?? []).filter((n) => n.payload && postIds.includes(n.payload.post_id)).map((n) => n.id)
    if (kena.length > 0) await admin.from('notifications').delete().in('id', kena)
    // Join requests ikut cascade saat postingan dihapus
    await admin.from('team_posts').delete().in('id', postIds)
    console.log(`Postingan demo dihapus: ${postIds.length}`)
  }

  // Join requests milik demo di postingan lain
  if (demoIds.length > 0) {
    await admin.from('join_requests').delete().in('user_id', demoIds)
  }

  // Lomba contoh (hanya yang tidak dirujuk postingan tersisa)
  for (const l of demoLomba ?? []) {
    const { error } = await admin.from('competitions').delete().eq('id', l.id)
    if (error) console.log(`Lewati "${l.judul.slice(0, 40)}": masih dirujuk postingan`)
  }

  // Kontak, skill, profil, lalu akun auth demo
  if (demoIds.length > 0) {
    await admin.from('user_contacts').delete().in('user_id', demoIds)
    await admin.from('user_skills').delete().in('user_id', demoIds)
    await admin.from('users').delete().in('id', demoIds)
    for (const u of demoAuth) {
      await admin.auth.admin.deleteUser(u.id)
    }
    console.log(`Akun demo dihapus: ${demoAuth.length}`)
  }
  console.log('Selesai.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
