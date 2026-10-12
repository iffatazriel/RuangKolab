'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const inputBase =
  'w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p role="alert" className="mt-1 text-xs font-medium tracking-tight text-rose-600">{message}</p>
}

const previewItems = [
  {
    status: 'Terbuka',
    pill: 'bg-emerald-600 text-white',
    title: 'Hackathon UI/UX 2026',
    desc: 'Batas pendaftaran: 12 Mei 2026',
    meta: '23 peserta',
  },
  {
    status: 'Penuh',
    pill: 'bg-rose-600 text-white',
    title: 'Kompetisi Robotika Interfakultas',
    desc: 'Dilaksanakan: 8 Juni 2026',
    meta: 'Tim 16',
  },
  {
    status: 'Ditutup',
    pill: 'bg-slate-400 text-white',
    title: 'Seminar Startup Mahasiswa',
    desc: 'Selesai: 30 Apr 2026',
    meta: 'Arsip',
  },
  {
    status: 'Menunggu',
    pill: 'bg-amber-400 text-amber-950',
    title: 'Call for Team: Proyek Aeroponik',
    desc: 'Status: Review',
    meta: '5 posisi',
  },
]

export default function DaftarPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nama: '', email: '', password: '', konfirmasi: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)

  function change(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function blur(e: React.FocusEvent<HTMLInputElement>) {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }

  const emailInvalid =
    touched.email && form.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const emailEmpty = touched.email && form.email.length === 0
  const passwordShort = touched.password && form.password.length > 0 && form.password.length < 8
  const konfirmasiMismatch =
    touched.konfirmasi && form.konfirmasi.length > 0 && form.password !== form.konfirmasi

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ nama: true, email: true, password: true, konfirmasi: true })
    setSubmitError('')
    if (!form.nama.trim()) {
      setSubmitError('Nama lengkap wajib diisi.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setSubmitError('Alamat email tidak valid.')
      return
    }
    if (form.password.length < 8) {
      setSubmitError('Kata sandi minimal 8 karakter.')
      return
    }
    if (form.password !== form.konfirmasi) {
      setSubmitError('Konfirmasi tidak cocok.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { nama: form.nama } },
    })
    setLoading(false)
    if (signUpError) {
      setSubmitError(signUpError.message)
      return
    }
    router.push('/masuk?pesan=cek-email')
  }

  async function daftarGoogle() {
    setSubmitError('')
    setOauthLoading(true)
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (oauthError) {
      setOauthLoading(false)
      setSubmitError('Daftar dengan Google belum tersedia. Coba lagi nanti atau gunakan email.')
    }
  }

  return (
    <div className="flex items-center justify-center p-4 md:p-8">
      <div className="my-4 grid w-full max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* BEGIN: RegistrationCard (Left Column) */}
        <section
          aria-labelledby="form-title"
          className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm md:p-9 lg:col-span-7"
        >
          <div className="flex items-start justify-between pb-2">
            <div>
              <h1 id="form-title" className="text-3xl font-extrabold tracking-tight text-slate-900">
                Buat Akun Baru
              </h1>
              <p className="mt-1.5 text-sm font-medium text-slate-600">
                Sudah punya akun?{' '}
                <Link href="/masuk" className="font-semibold text-indigo-600 hover:underline">
                  Masuk
                </Link>
              </p>
            </div>
            <div
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
            <div>
              <label htmlFor="nama" className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700">
                Nama Lengkap
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                autoComplete="name"
                placeholder="Contoh: Aditya Pratama"
                value={form.nama}
                onChange={change}
                onBlur={blur}
                className={`${inputBase} border-slate-300`}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="contoh@kampus.ac.id"
                value={form.email}
                onChange={change}
                onBlur={blur}
                className={`${inputBase} border-slate-300`}
              />
              <FieldError
                message={
                  emailInvalid
                    ? 'Alamat email tidak valid'
                    : emailEmpty
                      ? 'Email wajib diisi'
                      : undefined
                }
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700">
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                value={form.password}
                onChange={change}
                onBlur={blur}
                className={`${inputBase} border-slate-300`}
              />
              <FieldError message={passwordShort ? 'Kata sandi minimal 8 karakter' : undefined} />
            </div>
            <div>
              <label
                htmlFor="konfirmasi"
                className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700"
              >
                Konfirmasi Kata Sandi
              </label>
              <input
                id="konfirmasi"
                name="konfirmasi"
                type="password"
                autoComplete="new-password"
                placeholder="Ketik ulang kata sandi"
                value={form.konfirmasi}
                onChange={change}
                onBlur={blur}
                className={`${inputBase} border-slate-300`}
              />
              <FieldError message={konfirmasiMismatch ? 'Konfirmasi tidak cocok' : undefined} />
            </div>

            <div className="flex items-center gap-2 pt-1 pb-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="cursor-pointer text-xs font-normal text-slate-600 select-none">
                Saya menyetujui <span className="font-medium text-slate-700">Syarat &amp; Ketentuan</span> dan{' '}
                <span className="font-medium text-slate-700">Kebijakan Privasi</span>
              </label>
            </div>

            {submitError && (
              <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                <svg role="alert" className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <line strokeLinecap="round" strokeWidth="2" x1="12" x2="12" y1="8" y2="12" />
                  <circle cx="12" cy="16" fill="currentColor" r="1" />
                </svg>
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {loading ? 'Mendaftarkan...' : 'Daftar'}
            </button>

            <div className="relative flex items-center justify-center pt-2 pb-1">
              <div className="absolute w-full border-t border-slate-200" />
              <span className="relative bg-white px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                atau daftar dengan
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={daftarGoogle}
                disabled={oauthLoading}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4" />
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z" fill="#34A853" />
                  <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05" />
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
                </svg>
                <span>{oauthLoading ? 'Membuka...' : 'Daftar dengan Google'}</span>
              </button>
              <Link
                href="/lomba"
                className="flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-indigo-600 transition hover:bg-slate-50"
              >
                Daftar sebagai Mahasiswa
              </Link>
            </div>

            <p className="pt-3 text-center text-[11px] leading-relaxed text-slate-500 sm:text-left">
              Dengan mendaftar, kamu setuju dengan kebijakan kami dan menyetujui bahwa RuangKolab
              dapat mengirim pemberitahuan terkait akun dan event.
            </p>
          </form>
        </section>
        {/* END: RegistrationCard */}

        {/* BEGIN: InfoPreviewCard (Right Column) */}
        <aside className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm md:p-6 lg:col-span-5">
          <div className="mb-5 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 shadow-inner">
            <span className="px-6 text-center text-sm font-bold text-white">
              Suasana Kolaborasi Mahasiswa
            </span>
          </div>
          <div className="mb-5 space-y-1">
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Temukan Tim &amp; Kompetisi
            </h2>
            <p className="text-xs leading-relaxed text-slate-600">
              Jelajahi kompetisi kampus, buka lowongan anggota, dan kelola milestone proyek tim kamu.
            </p>
          </div>
          <div>
            {previewItems.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between border-b border-slate-100 py-1.5 text-xs last:border-b-0"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex min-w-[56px] items-center justify-center rounded-full px-2.5 py-0.5 text-center text-[10px] font-semibold ${item.pill}`}
                  >
                    {item.status}
                  </span>
                  <div>
                    <p className="leading-tight font-bold text-slate-900">{item.title}</p>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <span className="pl-2 text-[10px] font-medium whitespace-nowrap text-slate-500">
                  {item.meta}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-b border-slate-100 py-1.5 text-xs last:border-b-0">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold whitespace-nowrap text-indigo-600">
                  Kategori: Kompetisi
                </span>
                <div className="ml-1">
                  <p className="leading-tight font-bold text-slate-900">Lomba Ide Bisnis</p>
                  <p className="text-[10px] text-slate-500">Kategori: Kewirausahaan</p>
                </div>
              </div>
              <span className="pl-2 text-[10px] font-medium whitespace-nowrap text-slate-500">
                12 items
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <span>Kompetisi terverifikasi BEM &amp; Prodi</span>
            <Link href="/lomba" className="font-medium text-indigo-600 hover:underline">
              Lihat Semua â†’
            </Link>
          </div>
        </aside>
        {/* END: InfoPreviewCard */}
      </div>
    </div>
  )
}
