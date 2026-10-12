import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { LombaForm } from '../../baru/LombaForm'
import { PageContainer, PageHeader } from '@/components/ui/Page'

function toLocalInput(iso: string) {
  // Konversi ISO ke format yang diterima input datetime-local (WIB, tanpa detik)
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default async function EditLombaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/masuk')

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'moderator'].includes(profile.role)) redirect('/')

  const { data: comp } = await supabase
    .from('competitions')
    .select('id, judul, penyelenggara, kategori, tingkat, deadline, biaya, url, deskripsi, publish_status')
    .eq('id', id)
    .single()
  if (!comp) notFound()

  return (
    <PageContainer width="narrow">
      <PageHeader
        title="Edit Lomba"
        description={`Perbarui informasi untuk "${comp.judul}".`}
      />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <LombaForm
          id={comp.id}
          initial={{
            judul: comp.judul,
            penyelenggara: comp.penyelenggara ?? '',
            kategori: comp.kategori ?? '',
            tingkat: comp.tingkat ?? '',
            deadline: toLocalInput(comp.deadline),
            biaya: String(comp.biaya),
            url: comp.url,
            deskripsi: comp.deskripsi ?? '',
            publish_status: comp.publish_status,
          }}
        />
      </div>
    </PageContainer>
  )
}
