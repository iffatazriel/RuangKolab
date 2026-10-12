import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { sisaHariJakarta, getDeadlineTone } from '../src/lib/deadline.ts'

const DAY = 24 * 60 * 60 * 1000

describe('sisaHariJakarta', () => {
  it('hari ini menghasilkan 0', () => {
    assert.equal(sisaHariJakarta(new Date()), 0)
  })

  it('besok menghasilkan 1', () => {
    assert.equal(sisaHariJakarta(new Date(Date.now() + DAY)), 1)
  })

  it('kemarin menghasilkan -1', () => {
    assert.equal(sisaHariJakarta(new Date(Date.now() - DAY)), -1)
  })

  it('menerima string ISO', () => {
    const iso = new Date(Date.now() + 5 * DAY).toISOString()
    assert.equal(sisaHariJakarta(iso), 5)
  })
})

describe('getDeadlineTone', () => {
  it('hari ini dan besok bertone kuat', () => {
    assert.equal(getDeadlineTone(new Date()).tone, 'kuat')
    assert.equal(getDeadlineTone(new Date(Date.now() + DAY)).tone, 'kuat')
  })

  it('2-3 hari bertone kuat dengan label jumlah hari', () => {
    const info = getDeadlineTone(new Date(Date.now() + 3 * DAY))
    assert.equal(info.tone, 'kuat')
    assert.equal(info.pendek, '3 hari lagi')
  })

  it('4-7 hari bertone lembut', () => {
    assert.equal(getDeadlineTone(new Date(Date.now() + 7 * DAY)).tone, 'lembut')
  })

  it('lebih dari 7 hari bertone netral', () => {
    assert.equal(getDeadlineTone(new Date(Date.now() + 30 * DAY)).tone, 'netral')
  })

  it('selalu menyertakan tanggal panjang berbahasa Indonesia', () => {
    const info = getDeadlineTone(new Date(Date.now() + 10 * DAY))
    assert.match(info.panjang, /\d{4}/)
  })
})
