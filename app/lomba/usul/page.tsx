import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LombaForm } from '../baru/LombaForm'
import { PageContainer, PageHeader } from '@/components/ui/Page'

export default async function UsulLombaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/masuk?redirect=/lomba/usul')

  return (
    <PageContainer width="narrow">
      <PageHeader
        title="Usulkan Informasi Lomba"
        description="Bantu teman mahasiswa menemukan info kompetisi. Usulan akan ditinjau moderator sebelum tampil."
      />
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-sm">
        <LombaForm mode="usul" redirectTo="/dashboard" />
      </div>
    </PageContainer>
  )
}
