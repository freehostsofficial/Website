import { MetadataRoute } from 'next'
import { fetchHosts } from '../lib/cache'
import { slugify } from '../lib/slugify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL ?? 'https://freehosts.space';
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/faq',
    '/hosts',
    '/other-free-hosts',
    '/privacy-policy',
    '/server-rules',
    '/staff',
    '/submission-rules',
    '/tos',
    '/compare',
    '/saved'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic host routes
  try {
    const hosts = await fetchHosts()
    const hostRoutes = hosts.map(host => ({
      url: `${baseUrl}/hosts/${slugify(host.name)}`,
      lastModified: host.created_at ? new Date(host.created_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...hostRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}
