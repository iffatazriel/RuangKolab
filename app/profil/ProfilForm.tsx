'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/FormFields'
import { Check } from '@phosphor-icons/react'
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
}

export function ProfilForm({ profile, email, allSkills, userSkillIds, whatsapp: initWa }: Props) {
  const router = useRouter()
  const toast = useToast()
  const [form, setForm] = useState({
    nama: profile?.nama ?? '',
    jurusan: profile?.jurusan ?? '',
    angkatan: profile?.angkatan ? String(profile.angkatan) : '',
    bio: profile?.bio ?? '',
    portofolio_url: profile?.portofolio_url ?? '',
    whatsapp: initWa,
  })
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userSkillIds)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-800">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email-readonly" className="text-xs font-semibold text-slate-700">Email (tidak dapat diubah)</label>
        <input
          id="email-readonly"
          value={email}
          disabled
          className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
        />
      </div>

      <Input id="nama" name="nama" label="Nama Lengkap" required value={form.nama} onChange={change} />
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
        <legend className="text-sm font-semibold text-slate-800">Keahlian &amp; minat</legend>
        <p className="mt-1 text-xs text-slate-500">
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
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {active && <Check size={14} weight="bold" />}
                {s.nama}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="border-t border-slate-100 pt-5">
        <Button type="submit" loading={loading} size="lg">
          Simpan Profil
        </Button>
      </div>

      <DeleteAccountSection />
    </form>
  )
}
