/**
 * Waktu relatif Bahasa Indonesia untuk penanda kesegaran konten.
 * Contoh: "baru saja", "5 menit lalu", "3 jam lalu", "2 hari lalu".
 * Untuk tanggal > 30 hari, kembalikan tanggal pendek agar tetap informatif.
 */
export function waktuRelatif(iso: string | Date): string {
  const t = typeof iso === 'string' ? new Date(iso) : iso
  const diffMs = Date.now() - t.getTime()
  if (Number.isNaN(diffMs)) return ''
  if (diffMs < 0) return 'baru saja'
  const menit = Math.floor(diffMs / 60000)
  if (menit < 1) return 'baru saja'
  if (menit < 60) return `${menit} menit lalu`
  const jam = Math.floor(menit / 60)
  if (jam < 24) return `${jam} jam lalu`
  const hari = Math.floor(jam / 24)
  if (hari < 30) return `${hari} hari lalu`
  return new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
