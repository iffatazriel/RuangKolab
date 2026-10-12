import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfilForm } from './ProfilForm'
import { PageContainer, PageHeader } from '@/components/ui/Page'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/masuk')

  const [{ data: profile }, { data: skills }, { data: userSkills }, { data: contact }] =
    await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase.from('skills').select('id, nama').order('nama'),
      supabase.from('user_skills').select('skill_id').eq('user_id', user.id),
      supabase.from('user_contacts').select('whatsapp').eq('user_id', user.id).maybeSingle(),
    ])

  return (
    <PageContainer width="narrow">
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi pribadi, identitas kampus, dan keahlian untuk kolaborasi."
      />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <ProfilForm
          profile={profile!}
          email={user.email!}
          allSkills={skills ?? []}
          userSkillIds={(userSkills ?? []).map((s) => s.skill_id)}
          whatsapp={contact?.whatsapp ?? ''}
        />
      </div>
    </PageContainer>
  )
}
