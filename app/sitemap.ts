import type { MetadataRoute } from 'next'
import { fetchHosts } from '../lib/hosts'
import { slugify } from '../lib/slugify'
import { categories } from '../lib/categories'
import { findAlternatives, compatibleVsPairs } from '../lib/taxonomy'

// Crawlers fetch this often; hourly regeneration is plenty.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL ?? ''
  const staticPaths = ['', '/about', '/acceptable-use-policy', '/cookies', '/disclaimer', '/faq', '/hosts', '/compare', '/methodology', '/other-free-hosts', '/privacy-policy', '/server-rules', '/staff', '/submission-rules', '/submit-host', '/submit-layout', '/tos']
  const urls: MetadataRoute.Sitemap = [
    ...staticPaths.map((path) => ({ url: `${base}${path}` })),
    ...categories.map((c) => ({ url: `${base}/categories/${c.slug}`, lastModified: c.updated })),
  ]
  try {
    const hosts = await fetchHosts()
    for (const host of hosts) {
      if (!host.name) continue
      const slug = slugify(host.name)
      const lastModified = host.created_at || undefined
      urls.push({ url: `${base}/hosts/${slug}`, lastModified })
      if (findAlternatives(host, hosts).length >= 2) urls.push({ url: `${base}/alternatives/${slug}`, lastModified })
    }
    for (const { slug } of compatibleVsPairs(hosts)) urls.push({ url: `${base}/vs/${slug}` })
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }
  return urls
}
