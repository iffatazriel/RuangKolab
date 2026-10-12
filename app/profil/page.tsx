import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfilForm } from './ProfilForm'
import { PageContainer, PageHeader } from '@/components/ui/Page'
import { Avatar } from '@/components/ui/Avatar'
import { TiltCard } from '@/components/motion/TiltCard'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/masuk')

  const [{ data: profile }, { data: skills }, { data: userSkills }, { data: contact }, { data: campuses }] =
    await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase.from('skills').select('id, nama').order('nama'),
      supabase.from('user_skills').select('skill_id').eq('user_id', user.id),
      supabase.from('user_contacts').select('whatsapp').eq('user_id', user.id).maybeSingle(),
      supabase.from('campuses').select('id, nama, kota').order('nama'),
    ])

  const campusName = campuses?.find((c) => c.id === profile?.campus_id)

  return (
    <PageContainer width="narrow">
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi pribadi, identitas kampus, dan keahlian untuk kolaborasi."
      />
      <TiltCard max={4} className="mb-6">
        <div className="flex items-center gap-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <Avatar nama={profile?.nama ?? '?'} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-stone-900 dark:text-stone-100">{profile?.nama}</p>
            <p className="truncate text-sm text-stone-500 dark:text-stone-400">
              {[profile?.jurusan, profile?.angkatan ? `Angkatan ${profile.angkatan}` : null, campusName?.nama]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {(userSkills ?? []).length > 0 && (
              <p className="mt-1 text-xs font-medium text-brand-700 dark:text-brand-400">
                {(userSkills ?? []).length} keahlian terdaftar
              </p>
            )}
          </div>
        </div>
      </TiltCard>
      <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <ProfilForm
          profile={profile!}
          email={user.email!}
          allSkills={skills ?? []}
          userSkillIds={(userSkills ?? []).map((s) => s.skill_id)}
          whatsapp={contact?.whatsapp ?? ''}
          campuses={campuses ?? []}
        />
      </div>
    </PageContainer>
  )
}
