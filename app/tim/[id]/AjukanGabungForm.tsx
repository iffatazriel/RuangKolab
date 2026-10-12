'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { friendlyError } from '@/lib/errors'
import { Clock, CheckCircle, XCircle, Prohibit, PaperPlaneTilt, Check } from '@phosphor-icons/react'
import { EASE_OUT, SPRING } from '@/lib/motion'
import { useToast } from '@/components/ui/Toast'

interface Props {
  postId: string
  existingStatus: string | null
  requestId: string | null
}

const MAX_PESAN = 300

export function AjukanGabungForm({ postId, existingStatus, requestId }: Props) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const toast = useToast()
  const [pesan, setPesan] = useState('')
  const [loading, setLoading] = useState(false)
  const [terkirim, setTerkirim] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sesi kamu berakhir. Masuk lagi untuk mengajukan.'); setLoading(false); return }

    const { error: dbError } = await supabase.from('join_requests').insert({
      post_id: postId,
      user_id: user.id,
      pesan: pesan.trim() || null,
    })
    setLoading(false)
    if (dbError) { setError(friendlyError(dbError)); return }
    setTerkirim(true)
    toast.push('Pengajuan terkirim. Tunggu balasan pemilik.')
    router.refresh()
  }

  async function cancel() {
    if (!requestId) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: cancelError } = await supabase
      .from('join_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)
      .eq('status', 'pending')
    setLoading(false)
    if (cancelError) { setError(friendlyError(cancelError)); return }
    toast.push('Pengajuan dibatalkan.')
    router.refresh()
  }

  // Status pengajuan yang sudah ada: kartu status dengan layoutId agar
  // terbaca sebagai satu blok yang berubah wujud, bukan elemen baru.
  if (existingStatus) {
    const map: Record<string, { label: string; text: string; cls: string; Icon: typeof Clock }> = {
      pending: { label: 'Menunggu balasan', text: 'Pemilik postingan belum memutuskan. Kamu bisa membatalkan selama belum dibalas.', cls: 'border-amber-200 bg-amber-50 text-amber-900', Icon: Clock },
      accepted: { label: 'Diterima', text: 'Selamat, kamu diterima. Kontak pemilik ada di bagian atas halaman.', cls: 'border-emerald-200 bg-emerald-50 text-emerald-900', Icon: CheckCircle },
      rejected: { label: 'Tidak diterima', text: 'Pengajuan ini belum berhasil. Coba postingan tim lain yang sesuai keahlianmu.', cls: 'border-rose-200 bg-rose-50 text-rose-900', Icon: XCircle },
      cancelled: { label: 'Dibatalkan', text: 'Kamu membatalkan pengajuan ini.', cls: 'border-slate-200 bg-slate-50 text-slate-700', Icon: Prohibit },
    }
    const s = map[existingStatus]
    if (!s) return null
    return (
      <motion.div
        layoutId="ajukan-status"
        role="status"
        className={`rounded-2xl border p-5 ${s.cls}`}
        transition={reduce ? { duration: 0 } : SPRING}
      >
        <div className="flex items-start gap-3">
          <s.Icon size={22} weight="bold" className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">{s.label}</p>
            <p className="mt-1 text-sm leading-relaxed">{s.text}</p>
            {existingStatus === 'pending' && requestId && (
              <div className="mt-3">
                <Button variant="secondary" size="sm" loading={loading} onClick={cancel}>
                  Batalkan pengajuan
                </Button>
              </div>
            )}
            {error && <p className="mt-2 text-sm font-medium text-rose-700">{error}</p>}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div layoutId="ajukan-status">
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Ajukan bergabung</h2>
          <p className="mt-1 text-sm text-slate-600">Ceritakan singkat dirimu dan alasan ingin ikut.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="pesan-pengajuan" className="text-sm font-semibold text-slate-800">
            Pesan untuk pemilik (opsional)
          </label>
          <textarea
            id="pesan-pengajuan"
            value={pesan}
            onChange={(e) => setPesan(e.target.value.slice(0, MAX_PESAN))}
            rows={4}
            aria-describedby="pesan-bantuan"
            className="custom-input w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            placeholder="Contoh: Saya mahasiswa Informatika, bisa bantu bagian desain antarmuka."
          />
          <p id="pesan-bantuan" className="text-xs text-slate-500">
            {pesan.length}/{MAX_PESAN} karakter. Pesan ini hanya terlihat oleh pemilik postingan.
          </p>
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-800">
            {error}
          </div>
        )}

        {/* Tombol tiga keadaan: Ajukan, Mengirim, Terkirim (centang tergambar) */}
        <Button type="submit" size="lg" disabled={loading || terkirim}>
          <AnimatePresence mode="wait" initial={false}>
            {terkirim ? (
              <motion.span
                key="terkirim"
                className="inline-flex items-center gap-2"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
              >
                <motion.span
                  className="inline-flex"
                  initial={reduce ? false : { scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={SPRING}
                >
                  <Check size={18} weight="bold" />
                </motion.span>
                Terkirim
              </motion.span>
            ) : loading ? (
              <motion.span key="kirim" className="inline-flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Mengirim
              </motion.span>
            ) : (
              <motion.span key="ajukan" className="inline-flex items-center gap-2" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
                <PaperPlaneTilt size={18} />
                Ajukan
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </form>
    </motion.div>
  )
}
