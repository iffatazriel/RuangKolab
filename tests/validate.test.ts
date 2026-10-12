import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { validatePostForm, isPostFormValid } from '../src/lib/validate.ts'

const VALID_TIM = {
  tipe: 'competition' as const,
  judul: 'Butuh UI designer untuk hackathon kampus',
  deskripsi: 'Kami tim beranggotakan tiga orang membutuhkan satu desainer antarmuka untuk prototipe.',
  slot_total: '4',
  competition_id: 'abc-123',
}

describe('validatePostForm', () => {
  it('form valid menghasilkan map kosong', () => {
    assert.deepEqual(validatePostForm(VALID_TIM), {})
    assert.equal(isPostFormValid(VALID_TIM), true)
  })

  it('lomba tanpa competition_id ditolak', () => {
    const fe = validatePostForm({ ...VALID_TIM, competition_id: '' })
    assert.equal(fe.competition_id, 'Pilih lomba yang akan diikuti.')
  })

  it('proyek tidak butuh competition_id', () => {
    assert.equal(isPostFormValid({ ...VALID_TIM, tipe: 'project', competition_id: '' }), true)
  })

  it('judul kosong dan terlalu pendek ditolak', () => {
    assert.equal(validatePostForm({ ...VALID_TIM, judul: '  ' }).judul, 'Judul wajib diisi.')
    assert.match(validatePostForm({ ...VALID_TIM, judul: 'abc' }).judul ?? '', /terlalu pendek/)
  })

  it('deskripsi kosong dan terlalu pendek ditolak', () => {
    assert.equal(validatePostForm({ ...VALID_TIM, deskripsi: '' }).deskripsi, 'Deskripsi wajib diisi.')
    assert.match(validatePostForm({ ...VALID_TIM, deskripsi: 'terlalu pendek' }).deskripsi ?? '', /30 karakter/)
  })

  it('slot di luar 1-20 ditolak', () => {
    assert.equal(validatePostForm({ ...VALID_TIM, slot_total: '0' }).slot_total, 'Slot minimal 1.')
    assert.equal(validatePostForm({ ...VALID_TIM, slot_total: 'abc' }).slot_total, 'Slot minimal 1.')
    assert.match(validatePostForm({ ...VALID_TIM, slot_total: '21' }).slot_total ?? '', /maksimal 20/)
  })

  it('mengumpulkan semua error sekaligus', () => {
    const fe = validatePostForm({ tipe: 'competition', judul: '', deskripsi: '', slot_total: '0', competition_id: '' })
    assert.deepEqual(Object.keys(fe).sort(), ['competition_id', 'deskripsi', 'judul', 'slot_total'])
  })
})
