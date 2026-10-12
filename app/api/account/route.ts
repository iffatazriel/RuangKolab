import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Hapus akun milik pengguna yang sedang login (NFR privasi).
// Membutuhkan SUPABASE_SERVICE_ROLE_KEY di server; tidak pernah dikirim ke klien.
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk.' }, { status: 401 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({ error: 'Konfigurasi server belum lengkap.' }, { status: 500 })
  }

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // public.users tidak punya FK ke auth.users, jadi hapus baris profil secara eksplisit.
  // Cascade dari public.users akan membersihkan user_contacts, user_skills,
  // join_requests, notifications, dan team_posts milik user ini.
  const { error: profileError } = await admin.from('users').delete().eq('id', user.id)
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.auth.signOut()
  return NextResponse.json({ ok: true })
}
