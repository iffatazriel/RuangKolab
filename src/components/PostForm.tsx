'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/Button'
import { Input, Textarea, Select } from './ui/FormFields'
import type { PostType } from '@/lib/types'
import { friendlyError } from '@/lib/errors'

interface Props {
  tipe: PostType
  competitions?: { id: string; judul: string }[]
  allSkills: { id: string; nama: string }[]
  defaultCompetitionId?: string
}

export function PostForm({ tipe, competitions = [], allSkills, defaultCompetitionId = '' }: Props) {
  const router = useRouter()
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Tidak terautentikasi.'); setLoading(false); return }

    const payload = {
      owner_id: user.id,
      tipe,
      judul: form.judul,
      deskripsi: form.deskripsi,
      slot_total: parseInt(form.slot_total, 10),
      competition_id: tipe === 'competition' && form.competition_id ? form.competition_id : null,
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
    <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      {tipe === 'competition' && competitions.length > 0 && (
        <Select id="competition_id" name="competition_id" label="Lomba Terkait" value={form.competition_id} onChange={change} required>
          <option value="">Pilih Lomba</option>
          {competitions.map((c) => (
            <option key={c.id} value={c.id}>{c.judul}</option>
          ))}
        </Select>
      )}

      <Input id="judul" name="judul" label="Judul Postingan" required value={form.judul} onChange={change} placeholder="Cari anggota untuk..." />
      <Textarea id="deskripsi" name="deskripsi" label="Deskripsi (peran yang dicari, syarat, dll.)" required rows={5} value={form.deskripsi} onChange={change} />
      <Input
        id="slot_total"
        name="slot_total"
        type="number"
        min="1"
        max="20"
        label="Jumlah Slot yang Dibuka"
        required
        value={form.slot_total}
        onChange={change}
      />

      {tipe === 'project' && (
        <>
          <Input
            id="komitmen"
            name="komitmen"
            label="Komitmen Waktu (opsional)"
            placeholder="Contoh: 5-8 jam/minggu, durasi 3 bulan"
            value={form.komitmen}
            onChange={change}
          />
          <Input
            id="repo_url"
            name="repo_url"
            type="url"
            label="Tautan Repo / Dokumen (opsional)"
            placeholder="https://github.com/..."
            value={form.repo_url}
            onChange={change}
          />
        </>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Keahlian yang Dicari</label>
        <div className="flex flex-wrap gap-2">
          {allSkills.map((s) => {
            const active = selectedSkills.includes(s.id)
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => toggleSkill(s.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s.nama}
              </button>
            )
          })}
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" loading={loading} size="lg">Terbitkan Postingan</Button>
      </div>
    </form>
  )
}
