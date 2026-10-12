/**
 * Validasi formulir postingan tim/proyek (pure, tanpa dependensi React).
 * Mengembalikan map field -> pesan error; kosong berarti valid.
 * Aturan diselaraskan dengan constraint database (slot, panjang).
 */

export const MAX_DESKRIPSI = 1000
export const MAX_SLOT = 20
export const MIN_JUDUL = 10
export const MIN_DESKRIPSI = 30

export interface PostFormInput {
  tipe: 'competition' | 'project'
  judul: string
  deskripsi: string
  slot_total: string
  competition_id: string
}

export function validatePostForm(input: PostFormInput): Record<string, string> {
  const fe: Record<string, string> = {}
  const isLomba = input.tipe === 'competition'

  if (isLomba && !input.competition_id) {
    fe.competition_id = 'Pilih lomba yang akan diikuti.'
  }

  const judul = input.judul.trim()
  if (!judul) fe.judul = 'Judul wajib diisi.'
  else if (judul.length < MIN_JUDUL) fe.judul = 'Judul terlalu pendek, jelaskan tujuan tim atau proyek.'

  const deskripsi = input.deskripsi.trim()
  if (!deskripsi) fe.deskripsi = 'Deskripsi wajib diisi.'
  else if (deskripsi.length < MIN_DESKRIPSI) {
    fe.deskripsi = 'Deskripsi minimal 30 karakter agar calon anggota paham kebutuhanmu.'
  }

  const slot = parseInt(input.slot_total, 10)
  if (Number.isNaN(slot) || slot < 1) fe.slot_total = 'Slot minimal 1.'
  else if (slot > MAX_SLOT) fe.slot_total = `Slot maksimal ${MAX_SLOT}.`

  return fe
}

export function isPostFormValid(input: PostFormInput): boolean {
  return Object.keys(validatePostForm(input)).length === 0
}
