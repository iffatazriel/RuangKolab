import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LombaForm } from './LombaForm'
import { PageContainer, PageHeader } from '@/components/ui/Page'

export default async function LombaBaruPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/masuk')

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'moderator'].includes(profile.role)) redirect('/')

  return (
    <PageContainer width="narrow">
      <PageHeader
        title="Tambah Lomba Baru"
        description="Publikasikan informasi kompetisi langsung ke katalog aktif RuangKolab."
      />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <LombaForm />
      </div>
    </PageContainer>
  )
}
