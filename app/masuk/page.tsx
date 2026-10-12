'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const inputClass =
  'custom-input w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none'

function MasukForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const pesan = searchParams.get('pesan')

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)

  function change(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    setLoading(false)
    if (signInError) {
      setError('Email atau kata sandi salah. Pastikan kredensial Anda benar dan coba lagi.')
      return
    }
    router.push(redirect)
    router.refresh()
  }

  async function loginGoogle() {
    setError('')
    setOauthLoading(true)
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (oauthError) {
      setOauthLoading(false)
      setError('Login dengan Google belum tersedia. Coba lagi nanti atau gunakan email.')
    }
  }

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:gap-8">
          {/* Left Feature Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
            <div>
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg leading-tight font-bold text-slate-900">
                    Temukan Tim &amp; Kompetisi Kampus
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Gabung dengan ribuan mahasiswa untuk berkompetisi, merekrut anggota tim,
                    dan kelola proyek lintas-fakultas dengan mudah.
                  </p>
                </div>
              </div>

              <div className="mb-5 flex h-48 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 sm:h-56">
                <span className="px-6 text-center text-sm font-bold text-white">
                  Kolaborasi Mahasiswa RuangKolab
                </span>
              </div>

              <div className="mb-4 flex items-center gap-1.5">
                <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Open
                </span>
                <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Pending
                </span>
                <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Full
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span>Cari kompetisi berdasarkan fakultas dan kategori</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span>Membuat posting perekrutan tim dengan cepat</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span>Kelola jadwal dan milestone proyek</span>
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <Link
                href="/lomba"
                className="rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                Jelajahi Acara
              </Link>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
            <div>
              {pesan === 'cek-email' && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                  <span>Akun berhasil dibuat. Silakan masuk untuk mulai bergabung dengan tim.</span>
                </div>
              )}

              <div className="mb-4">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Masuk</h1>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Belum punya akun?</span>
                  <Link
                    href="/daftar"
                    className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    Daftar
                  </Link>
                </div>
              </div>

              <form className="space-y-3.5" onSubmit={submit}>
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
                    value={form.email}
                    onChange={change}
                    className={inputClass}
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-medium text-slate-700">
                      Kata Sandi
                    </label>
                    <Link href="/lupa-sandi" className="text-xs text-indigo-600 hover:underline">
                      Lupa kata sandi?
                    </Link>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="Masukkan kata sandi Anda"
                    value={form.password}
                    onChange={change}
                    className={inputClass}
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <line strokeLinecap="round" strokeWidth="2" x1="12" x2="12" y1="8" y2="12" />
                      <circle cx="12" cy="16" fill="currentColor" r="1" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs text-slate-400">
                  <span className="bg-white px-2">atau</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={loginGoogle}
                  disabled={oauthLoading}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.34z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>{oauthLoading ? 'Membuka...' : 'Masuk dengan Google'}</span>
                </button>
                <Link
                  href="/lomba"
                  className="flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Masuk sebagai Tamu
                </Link>
              </div>
            </div>
            <p className="mt-5 text-left text-[11px] leading-normal text-slate-400">
              Dengan masuk, Anda menyetujui Syarat &amp; Ketentuan dan Kebijakan RuangKolab.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MasukPage() {
  return (
    <Suspense>
      <MasukForm />
    </Suspense>
  )
}
