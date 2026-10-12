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
      <div className="w-full max-w-md rounded-2xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-sm sm:p-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">Lupa Kata Sandi</h1>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          Masukkan email akunmu. Kami akan mengirim tautan untuk mengatur ulang kata sandi.
        </p>

        {sent ? (
          <div className="mt-4 rounded-[10px] border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-3.5 py-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            Tautan reset telah dikirim ke <span className="font-semibold">{email}</span>. Cek inbox
            (dan folder spam), lalu ikuti tautannya.
          </div>
        ) : (
          <form className="mt-4 space-y-3.5" onSubmit={submit}>
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium text-stone-700 dark:text-stone-300">
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
                className="custom-input w-full rounded-[10px] border border-stone-200 dark:border-stone-800 px-3 py-2 text-xs text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
            {error && (
              <div role="alert" className="rounded-[10px] border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-400">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300 dark:disabled:bg-brand-800"
            >
              {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-xs text-stone-500 dark:text-stone-400">
          Ingat kata sandi?{' '}
          <Link href="/masuk" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Kembali Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
