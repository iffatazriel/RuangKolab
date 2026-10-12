'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LupaSandiPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/perbarui-sandi`,
    })
    setLoading(false)
    if (resetError) {
      setError(resetError.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Lupa Kata Sandi</h1>
        <p className="mt-1 text-xs text-slate-500">
          Masukkan email akunmu. Kami akan mengirim tautan untuk mengatur ulang kata sandi.
        </p>

        {sent ? (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800">
            Tautan reset telah dikirim ke <span className="font-semibold">{email}</span>. Cek inbox
            (dan folder spam), lalu ikuti tautannya.
          </div>
        ) : (
          <form className="mt-4 space-y-3.5" onSubmit={submit}>
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="nama@kampus.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-xs text-slate-500">
          Ingat kata sandi?{' '}
          <Link href="/masuk" className="font-semibold text-indigo-600 hover:underline">
            Kembali Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
