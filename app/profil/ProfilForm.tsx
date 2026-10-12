'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/FormFields'
import { Check } from '@phosphor-icons/react/dist/ssr'
import type { User, Skill } from '@/lib/types'
import { friendlyError } from '@/lib/errors'
import { useToast } from '@/components/ui/Toast'
import { DeleteAccountSection } from './DeleteAccountSection'

interface Props {
  profile: User
  email: string
  allSkills: Skill[]
  userSkillIds: string[]
  whatsapp: string
  campuses: { id: string; nama: string; kota: string }[]
}

export function ProfilForm({ profile, email, allSkills, userSkillIds, whatsapp: initWa, campuses }: Props) {
  const router = useRouter()
  const toast = useToast()
  const [form, setForm] = useState({
    nama: profile?.nama ?? '',
    campus_id: profile?.campus_id ?? '',
    jurusan: profile?.jurusan ?? '',
    angkatan: profile?.angkatan ? String(profile.angkatan) : '',
    bio: profile?.bio ?? '',
    portofolio_url: profile?.portofolio_url ?? '',
    whatsapp: initWa,
  })
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userSkillIds)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function toggleSkill(id: string) {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { error: profileError } = await supabase
      .from('users')
      .update({
        nama: form.nama,
        campus_id: form.campus_id || undefined,
        jurusan: form.jurusan || null,
        angkatan: form.angkatan ? parseInt(form.angkatan, 10) : null,
        bio: form.bio || null,
        portofolio_url: form.portofolio_url || null,
      })
      .eq('id', profile.id)

    if (profileError) {
      const msg = friendlyError(profileError)
      setError(msg)
      toast.push(msg, 'error')
      setLoading(false)
      return
    }

    if (form.whatsapp) {
      await supabase.from('user_contacts').upsert({
        user_id: profile.id,
        whatsapp: form.whatsapp,
      })
    }

    // Refresh skills: hapus semua lalu masukkan pilihan terbaru
    await supabase.from('user_skills').delete().eq('user_id', profile.id)
    if (selectedSkills.length > 0) {
      await supabase.from('user_skills').insert(
        selectedSkills.map((skill_id) => ({ user_id: profile.id, skill_id }))
      )
    }

    setLoading(false)
    toast.push('Profil berhasil diperbarui.')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-5" noValidate>
      {error && (
        <div role="alert" className="rounded-[10px] border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 px-3.5 py-2.5 text-sm font-medium text-rose-800 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email-readonly" className="text-xs font-semibold text-stone-700 dark:text-stone-300">Email (tidak dapat diubah)</label>
        <input
          id="email-readonly"
          value={email}
          disabled
          className="w-full rounded-[10px] border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 px-3 py-2 text-sm text-stone-500 dark:text-stone-400"
        />
      </div>

      <Input id="nama" name="nama" label="Nama Lengkap" required value={form.nama} onChange={change} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="campus_id" className="text-xs font-semibold text-stone-700 dark:text-stone-300">Kampus</label>
        <select
          id="campus_id"
          name="campus_id"
          value={form.campus_id}
          onChange={change}
          className="custom-input min-h-[44px] w-full rounded-[10px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none"
        >
          {campuses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nama} ({c.kota})
            </option>
          ))}
        </select>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Cakupan pilot masih satu kampus. Daftar kampus akan bertambah saat ekspansi.
        </p>
      </div>

      <Input id="jurusan" name="jurusan" label="Jurusan / Program Studi" value={form.jurusan} onChange={change} />
      <Input
        id="angkatan"
        name="angkatan"
        type="number"
        inputMode="numeric"
        label="Angkatan"
        helper="Empat digit, contoh 2023."
        value={form.angkatan}
        onChange={change}
      />
      <Input
        id="whatsapp"
        name="whatsapp"
        type="tel"
        inputMode="tel"
        label="Nomor WhatsApp"
        helper="Disimpan privat. Terbuka untuk pemilik postingan hanya setelah pengajuanmu diterima."
        placeholder="08123456789"
        value={form.whatsapp}
        onChange={change}
      />
      <Input
        id="portofolio_url"
        name="portofolio_url"
        type="url"
        label="Tautan Portofolio / GitHub / LinkedIn"
        placeholder="https://..."
        value={form.portofolio_url}
        onChange={change}
      />
      <Textarea
        id="bio"
        name="bio"
        label="Bio Singkat"
        rows={3}
        placeholder="Ceritakan minat dan pengalamanmu..."
        value={form.bio}
        onChange={change}
      />

      <fieldset>
        <legend className="text-sm font-semibold text-stone-800 dark:text-stone-200">Keahlian &amp; minat</legend>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          Dipakai untuk merekomendasikanmu ke tim yang mencari keahlian ini lewat filter.
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
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors active:scale-[0.98] ${
                  active
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {active && <Check size={14} weight="bold" />}
                {s.nama}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="border-t border-stone-100 dark:border-stone-800 pt-5">
        <Button type="submit" loading={loading} size="lg">
          Simpan Profil
        </Button>
      </div>

      <DeleteAccountSection />
    </form>
  )
}
