'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UsersThree, WarningCircle, ArrowRight } from '@phosphor-icons/react/dist/ssr'

const inputBase =
  'w-full rounded-[10px] border px-3.5 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p role="alert" className="mt-1 text-xs font-medium tracking-tight text-rose-600 dark:text-rose-400">{message}</p>
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
    pill: 'bg-stone-400 text-white',
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
      const msg = oauthError.message.toLowerCase()
      setSubmitError(
        msg.includes('provider') && (msg.includes('not enabled') || msg.includes('disabled') || msg.includes('unsupported'))
          ? 'Daftar dengan Google belum diaktifkan oleh admin. Silakan daftar dengan email dulu.'
          : 'Daftar dengan Google gagal. Coba lagi atau gunakan email.',
      )
    }
  }

  return (
    <div className="flex items-center justify-center p-4 md:p-8">
      <div className="my-4 grid w-full max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* BEGIN: RegistrationCard (Left Column) */}
        <section
          aria-labelledby="form-title"
          className="rounded-2xl border border-stone-200 dark:border-stone-800/70 bg-white dark:bg-stone-900 p-6 shadow-sm md:p-9 lg:col-span-7"
        >
          <div className="flex items-start justify-between pb-2">
            <div>
              <h1 id="form-title" className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                Buat Akun Baru
              </h1>
              <p className="mt-1.5 text-sm font-medium text-stone-600 dark:text-stone-400">
                Sudah punya akun?{' '}
                <Link href="/masuk" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  Masuk
                </Link>
              </p>
            </div>
            <div
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400"
            >
              <UsersThree size={20} weight="duotone" aria-hidden="true" />
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
            <div>
              <label htmlFor="nama" className="mb-1.5 block text-xs font-bold tracking-wide text-stone-700 dark:text-stone-300">
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
                className={`${inputBase} border-stone-300 dark:border-stone-700`}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold tracking-wide text-stone-700 dark:text-stone-300">
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
                className={`${inputBase} border-stone-300 dark:border-stone-700`}
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
              <label htmlFor="password" className="mb-1.5 block text-xs font-bold tracking-wide text-stone-700 dark:text-stone-300">
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
                className={`${inputBase} border-stone-300 dark:border-stone-700`}
              />
              <FieldError message={passwordShort ? 'Kata sandi minimal 8 karakter' : undefined} />
            </div>
            <div>
              <label
                htmlFor="konfirmasi"
                className="mb-1.5 block text-xs font-bold tracking-wide text-stone-700 dark:text-stone-300"
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
                className={`${inputBase} border-stone-300 dark:border-stone-700`}
              />
              <FieldError message={konfirmasiMismatch ? 'Konfirmasi tidak cocok' : undefined} />
            </div>

            <div className="flex items-center gap-2 pt-1 pb-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 cursor-pointer rounded border-stone-300 dark:border-stone-700 text-brand-600 dark:text-brand-400 focus:ring-brand-500"
              />
              <label htmlFor="terms" className="cursor-pointer text-xs font-normal text-stone-600 dark:text-stone-400 select-none">
                Saya menyetujui <span className="font-medium text-stone-700 dark:text-stone-300">Syarat &amp; Ketentuan</span> dan{' '}
                <span className="font-medium text-stone-700 dark:text-stone-300">Kebijakan Privasi</span>
              </label>
            </div>

            {submitError && (
              <div role="alert" className="flex items-start gap-2 rounded-[10px] border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-400">
                <WarningCircle size={16} weight="bold" className="mt-0.5 shrink-0 text-rose-500" aria-hidden="true" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-brand-300 dark:disabled:bg-brand-800"
            >
              {loading ? 'Mendaftarkan...' : 'Daftar'}
            </button>

            <div className="relative flex items-center justify-center pt-2 pb-1">
              <div className="absolute w-full border-t border-stone-200 dark:border-stone-800" />
              <span className="relative bg-white dark:bg-stone-900 px-3 text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                atau daftar dengan
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={daftarGoogle}
                disabled={oauthLoading}
                className="flex items-center justify-center gap-2 rounded-full border border-stone-300 dark:border-stone-700 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 transition hover:bg-stone-50 dark:hover:bg-stone-900 disabled:opacity-60"
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
                className="flex items-center justify-center rounded-full border border-stone-300 dark:border-stone-700 px-3 py-2 text-center text-xs font-semibold text-brand-600 dark:text-brand-400 transition hover:bg-stone-50 dark:hover:bg-stone-900"
              >
                Lihat sebagai tamu
              </Link>
            </div>

            <p className="pt-3 text-center text-[11px] leading-relaxed text-stone-500 dark:text-stone-400 sm:text-left">
              Dengan mendaftar, kamu setuju dengan kebijakan kami dan menyetujui bahwa RuangKolab
              dapat mengirim pemberitahuan terkait akun dan event.
            </p>
          </form>
        </section>
        {/* END: RegistrationCard */}

        {/* BEGIN: InfoPreviewCard (Right Column) */}
        <aside className="rounded-2xl border border-stone-200 dark:border-stone-800/70 bg-white dark:bg-stone-900 p-5 shadow-sm md:p-6 lg:col-span-5">
          <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/mahasiswa-presentasi-kelas/800/450"
              alt="Mahasiswa mempresentasikan proyek di kelas"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" aria-hidden="true" />
            <p className="absolute inset-x-0 bottom-0 px-5 pb-4 text-left text-sm font-bold leading-relaxed text-white">
              Suasana Kolaborasi Mahasiswa
            </p>
          </div>
          <div className="mb-5 space-y-1">
            <h2 className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Temukan Tim &amp; Kompetisi
            </h2>
            <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">
              Jelajahi kompetisi kampus, buka lowongan anggota, dan kelola milestone proyek tim kamu.
            </p>
          </div>
          <div>
            {previewItems.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 py-1.5 text-xs last:border-b-0"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex min-w-[56px] items-center justify-center rounded-full px-2.5 py-0.5 text-center text-[10px] font-semibold ${item.pill}`}
                  >
                    {item.status}
                  </span>
                  <div>
                    <p className="leading-tight font-bold text-stone-900 dark:text-stone-100">{item.title}</p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">{item.desc}</p>
                  </div>
                </div>
                <span className="pl-2 text-[10px] font-medium whitespace-nowrap text-stone-500 dark:text-stone-400">
                  {item.meta}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 py-1.5 text-xs last:border-b-0">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold whitespace-nowrap text-brand-600 dark:text-brand-400">
                  Kategori: Kompetisi
                </span>
                <div className="ml-1">
                  <p className="leading-tight font-bold text-stone-900 dark:text-stone-100">Lomba Ide Bisnis</p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">Kategori: Kewirausahaan</p>
                </div>
              </div>
              <span className="pl-2 text-[10px] font-medium whitespace-nowrap text-stone-500 dark:text-stone-400">
                12 items
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-3 text-[11px] text-stone-400">
            <span>Kompetisi terverifikasi BEM &amp; Prodi</span>
            <Link href="/lomba" className="inline-flex min-h-[44px] items-center gap-1 font-medium text-brand-600 dark:text-brand-400 hover:underline">
              Lihat Semua
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </aside>
        {/* END: InfoPreviewCard */}
      </div>
    </div>
  )
}
