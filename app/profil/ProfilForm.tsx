'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/FormFields'
import type { User, Skill } from '@/lib/types'
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
  const [success, setSuccess] = useState(false)
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
    setSuccess(false)
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
      setError(profileError.message)
      setLoading(false)
      return
    }

    if (form.whatsapp) {
      await supabase.from('user_contacts').upsert({
        user_id: profile.id,
        whatsapp: form.whatsapp,
      })
    }

    // Refresh skills: delete all then insert selected
    await supabase.from('user_skills').delete().eq('user_id', profile.id)
    if (selectedSkills.length > 0) {
      await supabase.from('user_skills').insert(
        selectedSkills.map((skill_id) => ({ user_id: profile.id, skill_id }))
      )
    }

    setLoading(false)
    setSuccess(true)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          Profil berhasil diperbarui.
        </div>
      )}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <Input label="Email (tidak dapat diubah)" value={email} disabled className="bg-gray-100" />
      <Input id="nama" name="nama" label="Nama Lengkap" required value={form.nama} onChange={change} />
      <Input id="jurusan" name="jurusan" label="Jurusan / Program Studi" value={form.jurusan} onChange={change} />
      <Input
        id="angkatan"
        name="angkatan"
        type="number"
        label="Angkatan (contoh: 2023)"
        value={form.angkatan}
        onChange={change}
      />
      <Input
        id="whatsapp"
        name="whatsapp"
        type="tel"
        label="Nomor WhatsApp (disimpan privat, hanya terbuka jika pengajuan tim diterima)"
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

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Keahlian &amp; Minat</label>
        <div className="flex flex-wrap gap-2">
          {allSkills.map((s) => {
            const active = selectedSkills.includes(s.id)
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => toggleSkill(s.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s.nama}
              </button>
            )
          })}
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" loading={loading} size="lg">
          Simpan Profil
        </Button>
      </div>

      <DeleteAccountSection />
    </form>
  )
}
