import type { MetadataRoute } from 'next'
import { fetchHosts } from '../lib/hosts'
import { slugify } from '../lib/slugify'
import { categoryIndex } from '../lib/category-index'
import { findAlternatives, compatibleVsPairs } from '../lib/taxonomy'
import { SITE_URL } from '../lib/site'

// Crawlers fetch this often; freshness flows from fetchHosts()' cache
// lifetime, and the CDN tier lives in next.config.ts.

// Google limits: 50,000 URLs / 50MB per sitemap file. The /vs/ pair space is
// combinatorial, so it gets its own shards; everything else fits in shard 0.
// Next serves /sitemap.xml as the index and /sitemap/<id>.xml per shard.
const VS_PER_SITEMAP = 5000;

export async function generateSitemaps() {
  try {
    const hosts = await fetchHosts()
    const shards = Math.max(1, Math.ceil(compatibleVsPairs(hosts).length / VS_PER_SITEMAP))
    return [{ id: '0' }, ...Array.from({ length: shards }, (_, i) => ({ id: `vs-${i}` }))]
  } catch {
    return [{ id: '0' }]
  }
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const shard = await id
  const base = SITE_URL

  // Shard 0: static pages, categories, hosts, alternatives — always small.
  if (shard === '0') {
    const urls: MetadataRoute.Sitemap = [
      ...['', '/about', '/acceptable-use-policy', '/cookies', '/disclaimer', '/faq', '/hosts', '/compare', '/methodology', '/other-free-hosts', '/privacy-policy', '/server-rules', '/staff', '/submission-rules', '/submit-host', '/submit-layout', '/tos'].map(
        (path) => ({ url: `${base}${path}` }),
      ),
      ...categoryIndex.map((c) => ({ url: `${base}/categories/${c.slug}`, lastModified: c.updated })),
    ]
    try {
      const hosts = await fetchHosts()
      for (const host of hosts) {
        if (!host.name) continue
        const slug = slugify(host.name)
        const ts = host.created_at ? Date.parse(host.created_at) : NaN
        const lastModified = Number.isFinite(ts) ? new Date(ts).toISOString() : undefined
        urls.push({ url: `${base}/hosts/${slug}`, lastModified })
        if (findAlternatives(host, hosts).length >= 2) urls.push({ url: `${base}/alternatives/${slug}`, lastModified })
      }
    } catch (error) {
      console.error('Error generating sitemap:', error)
    }
    return urls
  }

  // Shard vs-N: one 5k window of the /vs/ pair space.
  const index = Number(shard.replace('vs-', ''))
  if (!Number.isInteger(index) || index < 0) return []
  try {
    const hosts = await fetchHosts()
    const pairs = compatibleVsPairs(hosts)
    return pairs
      .slice(index * VS_PER_SITEMAP, (index + 1) * VS_PER_SITEMAP)
      .map(({ slug }) => ({ url: `${base}/vs/${slug}` }))
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return []
  }
}
