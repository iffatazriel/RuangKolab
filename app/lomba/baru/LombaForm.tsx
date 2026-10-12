'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/FormFields'
import { friendlyError } from '@/lib/errors'

const KATEGORI = ['Ilmiah', 'Teknologi', 'Bisnis', 'Desain', 'Seni & Budaya', 'Olahraga', 'Lainnya']
const TINGKAT = ['Nasional', 'Regional', 'Internasional', 'Internal Kampus']
const DEFAULT_CAMPUS = 'a0000000-0000-0000-0000-000000000001'

interface LombaFormValues {
  judul: string
  penyelenggara: string
  kategori: string
  tingkat: string
  deadline: string
  biaya: string
  url: string
  deskripsi: string
  publish_status: 'draft' | 'published' | 'pending'
}

interface Props {
  id?: string
  /** 'admin' = langsung terbit; 'usul' = pengguna biasa, masuk antrean moderasi */
  mode?: 'admin' | 'usul'
  redirectTo?: string
  /** Nilai awal untuk mode edit */
  initial?: Partial<LombaFormValues>
}

export function LombaForm({ id, mode = 'admin', redirectTo = '/lomba', initial }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    judul: initial?.judul ?? '',
    penyelenggara: initial?.penyelenggara ?? '',
    kategori: initial?.kategori ?? '',
    tingkat: initial?.tingkat ?? '',
    deadline: initial?.deadline ?? '',
    biaya: initial?.biaya ?? '0',
    url: initial?.url ?? '',
    deskripsi: initial?.deskripsi ?? '',
    publish_status: (initial?.publish_status ?? (mode === 'usul' ? 'pending' : 'published')) as LombaFormValues['publish_status'],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Tidak terautentikasi.'); setLoading(false); return }

    const payload = {
      judul: form.judul,
      penyelenggara: form.penyelenggara || null,
      kategori: form.kategori || null,
      tingkat: form.tingkat || null,
      deadline: new Date(form.deadline).toISOString(),
      biaya: parseInt(form.biaya, 10) || 0,
      url: form.url,
      deskripsi: form.deskripsi || null,
      publish_status: mode === 'usul' ? 'pending' : form.publish_status,
      // Saat edit, campus_id dan created_by tidak diubah
      ...(id ? {} : { campus_id: DEFAULT_CAMPUS, created_by: user.id }),
    }

    const { error: dbError } = id
      ? await supabase.from('competitions').update(payload).eq('id', id)
      : await supabase.from('competitions').insert(payload)

    setLoading(false)
    if (dbError) { setError(friendlyError(dbError)); return }
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      <Input id="judul" name="judul" label="Judul Lomba" required value={form.judul} onChange={change} />
      <Input id="penyelenggara" name="penyelenggara" label="Penyelenggara" value={form.penyelenggara} onChange={change} />
      <Select id="kategori" name="kategori" label="Kategori" value={form.kategori} onChange={change}>
        <option value="">Pilih Kategori</option>
        {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
      </Select>
      <Select id="tingkat" name="tingkat" label="Tingkat" value={form.tingkat} onChange={change}>
        <option value="">Pilih Tingkat</option>
        {TINGKAT.map((t) => <option key={t} value={t}>{t}</option>)}
      </Select>
      <Input id="deadline" name="deadline" type="datetime-local" label="Deadline" required value={form.deadline} onChange={change} />
      <Input id="biaya" name="biaya" type="number" min="0" label="Biaya Pendaftaran (Rp, isi 0 jika gratis)" value={form.biaya} onChange={change} />
      <Input id="url" name="url" type="url" label="Tautan Resmi Lomba" required placeholder="https://..." value={form.url} onChange={change} />
      <Textarea id="deskripsi" name="deskripsi" label="Deskripsi" rows={5} value={form.deskripsi} onChange={change} />
      {mode === 'admin' ? (
        <Select id="publish_status" name="publish_status" label="Status" value={form.publish_status} onChange={change}>
          <option value="published">Terbit</option>
          <option value="draft">Draft</option>
        </Select>
      ) : (
        <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Usulanmu akan ditinjau moderator sebelum tampil di daftar lomba. Kamu akan menerima notifikasi setelah diputuskan.
        </p>
      )}
      <div className="pt-2">
        <Button type="submit" loading={loading} size="lg">{id ? 'Simpan Perubahan' : 'Tambah Lomba'}</Button>
      </div>
    </form>
  )
}
