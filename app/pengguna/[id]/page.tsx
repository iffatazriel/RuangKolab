import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ReportButton } from '@/components/ui/ReportButton'
import { PageContainer } from '@/components/ui/Page'

export default async function PenggunaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('users')
    .select('id, nama, jurusan, angkatan, bio, portofolio_url, created_at')
    .eq('id', id)
    .single()

  if (!profile) return notFound()

  const { data: skillsData } = await supabase
    .from('user_skills')
    .select('skills(id, nama)')
    .eq('user_id', id)

  const skills = (skillsData ?? [])
    .map((s) => (Array.isArray(s.skills) ? s.skills[0] : s.skills))
    .filter(Boolean) as { id: string; nama: string }[]

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <PageContainer width="narrow">
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950 text-lg font-bold text-brand-700 dark:text-brand-300">
              {profile.nama.slice(0, 2).toUpperCase()}
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">{profile.nama}</h1>
            {profile.jurusan && (
              <p className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-400">
                {profile.jurusan}{profile.angkatan ? ` (Angkatan ${profile.angkatan})` : ''}
              </p>
            )}
          </div>
          {user && user.id !== id && <ReportButton targetType="user" targetId={id} />}
        </div>

        {profile.bio && (
          <div className="mt-6 border-t border-stone-100 dark:border-stone-800 pt-5">
            <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">Bio</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300 whitespace-pre-line">{profile.bio}</p>
          </div>
        )}

        {profile.portofolio_url && (
          <div className="mt-5 border-t border-stone-100 dark:border-stone-800 pt-5">
            <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">Tautan Portofolio</h2>
            <a
              href={profile.portofolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-block text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Buka Tautan Portofolio â†
            </a>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mt-5 border-t border-stone-100 dark:border-stone-800 pt-5">
            <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">Keahlian &amp; Minat</h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="rounded-full bg-stone-100 dark:bg-stone-800 px-3 py-1 text-xs font-medium text-stone-700 dark:text-stone-300">
                  {s.nama}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
