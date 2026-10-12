'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function DeleteAccountSection() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function remove() {
    if (!window.confirm('Hapus akun secara permanen? Semua postingan, pengajuan, dan data profilmu akan ikut terhapus.')) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/account', { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Gagal menghapus akun.')
      setLoading(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="mt-10 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 p-5">
      <h3 className="text-sm font-bold text-rose-900">Zona Berbahaya: Hapus Akun</h3>
      <p className="mt-1 text-xs text-rose-700 dark:text-rose-400 leading-relaxed">
        Tindakan ini permanen. Semua data akun, riwayat postingan tim, dan pengajuan kolaborasi akan dihapus seluruhnya.
      </p>
      {error && <p className="mt-2 text-xs font-semibold text-rose-700 dark:text-rose-400">{error}</p>}
      <div className="mt-4">
        <Button variant="danger" size="sm" loading={loading} onClick={remove}>
          Hapus Akun Saya
        </Button>
      </div>
    </div>
  )
}
