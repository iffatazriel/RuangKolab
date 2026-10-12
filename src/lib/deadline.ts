/**
 * Urgensi deadline, semantik dan terpisah dari warna aksen brand.
 * Dihitung pada zona Asia/Jakarta agar "besok" sesuai hari lokal pengguna.
 *
 * Pemakaian ulang: halaman daftar (teks baris atas) dan halaman detail.
 */

export type DeadlineTone = 'kuat' | 'lembut' | 'netral'

interface DeadlineInfo {
  tone: DeadlineTone
  /** Teks pendek untuk baris atas kartu: "Hari ini", "Besok", "3 hari lagi". */
  pendek: string
  /** Teks panjang untuk footer/detail: "Kamis, 15 Okt 2026". */
  panjang: string
}

/** Tanggal "hari ini" menurut Asia/Jakarta, sebagai angka YYYY-MM-DD. */
function jakartaDateKey(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

/** Selisih hari kalender (Asia/Jakarta) antara tanggal target dan hari ini. */
export function sisaHariJakarta(target: string | Date): number {
  const t = typeof target === 'string' ? new Date(target) : target
  const today = jakartaDateKey(new Date())
  const targetKey = jakartaDateKey(t)
  const ms = new Date(`${targetKey}T00:00:00+07:00`).getTime() - new Date(`${today}T00:00:00+07:00`).getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function getDeadlineTone(target: string | Date): DeadlineInfo {
  const t = typeof target === 'string' ? new Date(target) : target
  const hari = sisaHariJakarta(t)
  const panjang = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(t)

  if (hari <= 0) return { tone: 'kuat', pendek: 'Hari ini', panjang }
  if (hari === 1) return { tone: 'kuat', pendek: 'Besok', panjang }
  if (hari <= 3) return { tone: 'kuat', pendek: `${hari} hari lagi`, panjang }
  if (hari <= 7) return { tone: 'lembut', pendek: `${hari} hari lagi`, panjang }
  return { tone: 'netral', pendek: `${hari} hari lagi`, panjang }
}

/** Kelas warna teks per tingkat urgensi, kontras AA di terang dan gelap. */
export const deadlineToneClass: Record<DeadlineTone, string> = {
  kuat: 'text-rose-700 dark:text-rose-400',
  lembut: 'text-amber-700 dark:text-amber-400',
  netral: 'text-slate-600 dark:text-slate-400',
}
