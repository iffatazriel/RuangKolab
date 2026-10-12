'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function PerbaruiSandiPage() {
  const router = useRouter()
  const [form, setForm] = useState({ password: '', konfirmasi: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function change(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Kata sandi minimal 8 karakter.')
      return
    }
    if (form.password !== form.konfirmasi) {
      setError('Konfirmasi tidak cocok.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password: form.password })
    setLoading(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Atur Kata Sandi Baru
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Masukkan kata sandi baru untuk akunmu (minimal 8 karakter).
        </p>

        <form className="mt-4 space-y-3.5" onSubmit={submit}>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-slate-700">
              Kata Sandi Baru
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
              value={form.password}
              onChange={change}
              className="custom-input w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="konfirmasi" className="mb-1 block text-xs font-medium text-slate-700">
              Konfirmasi Kata Sandi
            </label>
            <input
              id="konfirmasi"
              name="konfirmasi"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Ketik ulang kata sandi"
              value={form.konfirmasi}
              onChange={change}
              className="custom-input w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {error && (
            <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loading ? 'Menyimpan...' : 'Simpan Kata Sandi'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          <Link href="/masuk" className="font-semibold text-indigo-600 hover:underline">
            Kembali Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
