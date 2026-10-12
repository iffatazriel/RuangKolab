'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/Button'
import { Input } from './ui/FormFields'
import { friendlyError } from '@/lib/errors'
import { validatePostForm, MAX_DESKRIPSI, MAX_SLOT } from '@/lib/validate'
import { X, Check } from '@phosphor-icons/react/dist/ssr'
import type { PostType } from '@/lib/types'

interface Props {
  tipe: PostType
  competitions?: { id: string; judul: string }[]
  allSkills: { id: string; nama: string }[]
  defaultCompetitionId?: string
}

export function PostForm({ tipe, competitions = [], allSkills, defaultCompetitionId = '' }: Props) {
  const router = useRouter()
  const isLomba = tipe === 'competition'
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    slot_total: '3',
    competition_id: defaultCompetitionId,
    komitmen: '',
    repo_url: '',
  })
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setFieldErrors((fe) => ({ ...fe, [e.target.name]: '' }))
  }

  function toggleSkill(id: string) {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  /** Validasi klien: pesan per field, tampil inline di bawah input */
  function validate(): boolean {
    const fe = validatePostForm({
      tipe,
      judul: form.judul,
      deskripsi: form.deskripsi,
      slot_total: form.slot_total,
      competition_id: form.competition_id,
    })
    setFieldErrors(fe)
    return Object.keys(fe).length === 0
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sesi kamu berakhir. Masuk lagi untuk menerbitkan postingan.'); setLoading(false); return }

    const payload = {
      owner_id: user.id,
      tipe,
      judul: form.judul.trim(),
      deskripsi: form.deskripsi.trim(),
      slot_total: parseInt(form.slot_total, 10),
      competition_id: isLomba && form.competition_id ? form.competition_id : null,
      ...(tipe === 'project'
        ? {
            komitmen: form.komitmen.trim() || null,
            repo_url: form.repo_url.trim() || null,
          }
        : {}),
    }

    const { data: post, error: dbError } = await supabase
      .from('team_posts')
      .insert(payload)
      .select('id')
      .single()

    if (dbError) { setError(friendlyError(dbError)); setLoading(false); return }

    if (post && selectedSkills.length > 0) {
      await supabase.from('post_skills').insert(
        selectedSkills.map((skill_id) => ({ post_id: post.id, skill_id }))
      )
    }

    setLoading(false)
    const dest = tipe === 'competition' ? `/tim/${post!.id}` : `/proyek/${post!.id}`
    router.push(dest)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      {/* Error umum (server): inline, role alert */}
      {error && (
        <div role="alert" className="rounded-[10px] border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 px-3.5 py-2.5 text-sm font-medium text-rose-800 dark:text-rose-400">
          {error}
        </div>
      )}

      {isLomba && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="competition_id" className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            Lomba yang diikuti <span aria-hidden="true" className="text-rose-600 dark:text-rose-400">*</span>
          </label>
          <select
            id="competition_id"
            name="competition_id"
            value={form.competition_id}
            onChange={change}
            required
            aria-invalid={!!fieldErrors.competition_id || undefined}
            aria-describedby={fieldErrors.competition_id ? 'competition_id-error' : 'competition_id-bantuan'}
            className={`custom-input min-h-[48px] w-full rounded-[10px] border bg-white dark:bg-stone-900 px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 focus:outline-none ${
              fieldErrors.competition_id ? 'border-rose-400' : 'border-stone-300 dark:border-stone-700'
            }`}
          >
            <option value="">Pilih lomba</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>{c.judul}</option>
            ))}
          </select>
          {fieldErrors.competition_id ? (
            <p id="competition_id-error" className="text-xs font-medium text-rose-700 dark:text-rose-400">{fieldErrors.competition_id}</p>
          ) : (
            <p id="competition_id-bantuan" className="text-xs text-stone-500 dark:text-stone-400">
              {competitions.length > 0
                ? 'Hanya lomba yang masih membuka pendaftaran yang tampil di sini.'
                : 'Belum ada lomba aktif. Coba lagi nanti atau usulkan lomba baru.'}
            </p>
          )}
        </div>
      )}

      <Input
        id="judul"
        name="judul"
        label="Judul postingan"
        required
        value={form.judul}
        onChange={change}
        error={fieldErrors.judul}
        aria-describedby="judul-bantuan"
        placeholder={isLomba ? 'Contoh: Butuh desainer UI untuk hackathon' : 'Contoh: Kolaborasi aplikasi donasi kampus'}
      />
      <p id="judul-bantuan" className="-mt-4 text-xs text-stone-500 dark:text-stone-400">
        Maksimal 80 karakter, satu kalimat yang jelas.
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="deskripsi" className="text-sm font-semibold text-stone-800 dark:text-stone-200">
          Deskripsi <span aria-hidden="true" className="text-rose-600 dark:text-rose-400">*</span>
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          required
          rows={6}
          maxLength={MAX_DESKRIPSI}
          value={form.deskripsi}
          onChange={change}
          aria-invalid={!!fieldErrors.deskripsi || undefined}
          aria-describedby="deskripsi-bantuan"
          placeholder="Peran yang dibutuhkan, syarat, rencana kerja, dan cara kamu membagi tugas."
          className={`custom-input w-full rounded-[10px] border px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none ${
            fieldErrors.deskripsi ? 'border-rose-400' : 'border-stone-300 dark:border-stone-700'
          }`}
        />
        <p id="deskripsi-bantuan" className="text-xs text-stone-500 dark:text-stone-400">
          {form.deskripsi.length}/{MAX_DESKRIPSI} karakter. Minimal 30 karakter.
        </p>
        {fieldErrors.deskripsi && (
          <p className="text-xs font-medium text-rose-700 dark:text-rose-400">{fieldErrors.deskripsi}</p>
        )}
      </div>

      <Input
        id="slot_total"
        name="slot_total"
        type="number"
        inputMode="numeric"
        min="1"
        max={MAX_SLOT}
        required
        label="Jumlah slot yang dibuka"
        value={form.slot_total}
        onChange={change}
        error={fieldErrors.slot_total}
      />

      {tipe === 'project' && (
        <>
          <Input
            id="komitmen"
            name="komitmen"
            label="Komitmen waktu"
            placeholder="Contoh: 5-8 jam per minggu, selama 3 bulan"
            value={form.komitmen}
            onChange={change}
          />
          <Input
            id="repo_url"
            name="repo_url"
            type="url"
            label="Tautan repo atau dokumen"
            placeholder="https://github.com/..."
            value={form.repo_url}
            onChange={change}
          />
        </>
      )}

      {/* Skill chips: fieldset agar terbaca sebagai satu pertanyaan oleh pembaca layar */}
      <fieldset>
        <legend className="text-sm font-semibold text-stone-800 dark:text-stone-200">Keahlian yang dicari</legend>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          Pilih beberapa. Calon anggota memakai ini untuk menemukan postinganmu lewat filter keahlian.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {allSkills.map((s) => {
            const active = selectedSkills.includes(s.id)
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => toggleSkill(s.id)}
                aria-pressed={active}
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.98] ${
                  active
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {active && <Check size={14} weight="bold" />}
                {s.nama}
                {active && <X size={14} weight="bold" aria-label={`Hapus ${s.nama}`} />}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="border-t border-stone-100 dark:border-stone-800 pt-5">
        <Button type="submit" size="lg" loading={loading}>
          {isLomba ? 'Terbitkan pencarian tim' : 'Terbitkan proyek'}
        </Button>
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
          Postingan tampil publik. Kamu bisa menghapusnya kapan saja dari halaman detail.
        </p>
      </div>
    </form>
  )
}
