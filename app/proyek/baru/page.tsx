import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PostForm } from '@/components/PostForm'
import { PageContainer, PageHeader } from '@/components/ui/Page'

export default async function ProyekBaruPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/masuk?redirect=/proyek/baru')

  const { data: skills } = await supabase.from('skills').select('id, nama').order('nama')

  return (
    <PageContainer width="narrow">
      <PageHeader
        title="Mulai Proyek Kolaborasi"
        description="Ajak rekan mahasiswa untuk mengerjakan proyek kreatif, riset, atau startup kampus."
      />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <PostForm tipe="project" allSkills={skills ?? []} />
      </div>
    </PageContainer>
  )
}
