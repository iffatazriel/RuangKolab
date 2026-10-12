'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PasswordInput } from '@/components/ui/PasswordInput'

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
      <div className="w-full max-w-md rounded-2xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-sm sm:p-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
          Atur Kata Sandi Baru
        </h1>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          Masukkan kata sandi baru untuk akunmu (minimal 8 karakter).
        </p>

        <form className="mt-4 space-y-3.5" onSubmit={submit}>
          <PasswordInput
            id="password"
            name="password"
            label="Kata Sandi Baru"
            required
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            value={form.password}
            onChange={change}
          />
          <PasswordInput
            id="konfirmasi"
            name="konfirmasi"
            label="Konfirmasi Kata Sandi"
            required
            autoComplete="new-password"
            placeholder="Ketik ulang kata sandi"
            value={form.konfirmasi}
            onChange={change}
          />
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
            {loading ? 'Menyimpan...' : 'Simpan Kata Sandi'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-stone-500 dark:text-stone-400">
          <Link href="/masuk" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Kembali Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
