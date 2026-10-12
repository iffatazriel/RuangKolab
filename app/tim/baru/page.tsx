import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PostForm } from '@/components/PostForm'
import { PageContainer, PageHeader } from '@/components/ui/Page'

export default async function TimBaruPage({
  searchParams,
}: {
  searchParams: Promise<{ lomba?: string }>
}) {
  const { lomba: defaultCompetitionId } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/masuk?redirect=/tim/baru')

  const now = new Date().toISOString()
  const [{ data: competitions }, { data: skills }] = await Promise.all([
    supabase
      .from('competitions')
      .select('id, judul')
      .eq('publish_status', 'published')
      .gte('deadline', now)
      .order('deadline', { ascending: true }),
    supabase.from('skills').select('id, nama').order('nama'),
  ])

  return (
    <PageContainer width="narrow">
      <PageHeader
        title="Buka rekrutmen tim"
        description="Satu postingan untuk satu lomba. Jelaskan peran yang dibutuhkan agar calon anggota tepat sasaran."
      />
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900 p-6 shadow-sm sm:p-8">
        <PostForm
          tipe="competition"
          competitions={competitions ?? []}
          allSkills={skills ?? []}
          defaultCompetitionId={defaultCompetitionId}
        />
      </div>
    </PageContainer>
  )
}
