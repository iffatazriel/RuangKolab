import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ruangkolab.vercel.app'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/lomba`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/tim`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/proyek`, changeFrequency: 'daily', priority: 0.8 },
  ]

  try {
    const supabase = await createClient()
    const now = new Date().toISOString()
    const { data } = await supabase
      .from('competitions')
      .select('id')
      .eq('publish_status', 'published')
      .gte('deadline', now)
      .limit(200)

    const lombaRoutes: MetadataRoute.Sitemap = (data ?? []).map((c) => ({
      url: `${base}/lomba/${c.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
    return [...staticRoutes, ...lombaRoutes]
  } catch {
    return staticRoutes
  }
}
