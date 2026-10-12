import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { friendlyError } from '../src/lib/errors.ts'

describe('friendlyError', () => {
  it('menerjemahkan error batas postingan', () => {
    assert.equal(
      friendlyError({ message: 'Batas 5 postingan per 24 jam tercapai. Coba lagi nanti.' }),
      'Kamu sudah membuat 5 postingan dalam 24 jam terakhir. Coba lagi besok.'
    )
  })

  it('menerjemahkan error batas pengajuan', () => {
    assert.equal(
      friendlyError({ message: 'Batas 10 pengajuan per 24 jam tercapai. Coba lagi nanti.' }),
      'Kamu sudah mengirim 10 pengajuan dalam 24 jam terakhir. Coba lagi besok.'
    )
  })

  it('menerjemahkan pelanggaran unique pengajuan ganda', () => {
    assert.equal(
      friendlyError({ message: 'duplicate key value violates unique constraint "join_requests_one_per_user_per_post"', code: '23505' }),
      'Kamu sudah pernah mengajukan ke postingan ini.'
    )
  })

  it('menerjemahkan error RLS tanpa membocorkan detail', () => {
    const msg = friendlyError({ message: 'new row violates row-level security policy for table "team_posts"', code: '42501' })
    assert.equal(msg, 'Kamu tidak punya izin untuk melakukan tindakan ini.')
  })

  it('memakai fallback untuk error tak dikenal', () => {
    assert.equal(friendlyError({ message: 'something weird happened' }), 'Terjadi kesalahan. Coba lagi.')
    assert.equal(friendlyError(null, 'Pesan khusus.'), 'Pesan khusus.')
    assert.equal(friendlyError(undefined), 'Terjadi kesalahan. Coba lagi.')
  })

  it('menerjemahkan kegagalan jaringan', () => {
    assert.equal(
      friendlyError({ message: 'Failed to fetch' }),
      'Koneksi bermasalah. Periksa internetmu lalu coba lagi.'
    )
  })
})
