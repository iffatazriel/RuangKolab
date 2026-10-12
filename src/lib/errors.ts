/**
 * Menerjemahkan error mentah dari Supabase/Postgres menjadi pesan Indonesia
 * yang bisa ditampilkan ke pengguna. Pesan database yang dikenali dicocokkan
 * dengan substring; error lain jatuh ke pesan umum agar tidak membocorkan detail.
 */
const RULES: { match: string; message: string }[] = [
  { match: 'Batas 5 postingan per 24 jam', message: 'Kamu sudah membuat 5 postingan dalam 24 jam terakhir. Coba lagi besok.' },
  { match: 'Batas 10 pengajuan per 24 jam', message: 'Kamu sudah mengirim 10 pengajuan dalam 24 jam terakhir. Coba lagi besok.' },
  { match: 'Cannot join your own post', message: 'Kamu tidak bisa mengajukan gabung ke postinganmu sendiri.' },
  { match: 'join_requests_one_per_user_per_post', message: 'Kamu sudah pernah mengajukan ke postingan ini.' },
  { match: 'team_posts_slot_terisi_valid', message: 'Slot untuk postingan ini sudah penuh.' },
  { match: 'row-level security', message: 'Kamu tidak punya izin untuk melakukan tindakan ini.' },
  { match: 'violates row-level security', message: 'Kamu tidak punya izin untuk melakukan tindakan ini.' },
  { match: 'competitions_biaya_nonneg', message: 'Biaya tidak boleh negatif.' },
  { match: 'duplicate key', message: 'Data serupa sudah ada.' },
  { match: 'Failed to fetch', message: 'Koneksi bermasalah. Periksa internetmu lalu coba lagi.' },
]

export function friendlyError(err: { message?: string; code?: string } | null | undefined, fallback = 'Terjadi kesalahan. Coba lagi.'): string {
  if (!err) return fallback
  const msg = err.message ?? ''
  for (const rule of RULES) {
    if (msg.includes(rule.match)) return rule.message
  }
  // Kode Postgres 23505 = unique violation, 42501 = insufficient privilege
  if (err.code === '23505') return 'Data serupa sudah ada.'
  if (err.code === '42501') return 'Kamu tidak punya izin untuk melakukan tindakan ini.'
  return fallback
}
