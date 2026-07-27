import { slugify } from './slugify'

export interface Host {
  id: number
  name: string
  description?: string
  info?: string
  type?: string
  locale: string[]
  targets: string[]
  status?: string
  cpu?: string
  ram?: string
  ramMB?: number
  disk?: string
  diskMB?: number
  approvals: number
  disapprovals: number
  created_at?: string
  free_plan?: string
  links: string[]
  image?: string
}

interface RawHost {
  id?: number
  name?: string
  description?: string
  info?: string
  type?: string
  locale?: unknown
  targets?: unknown
  status?: string
  cpu?: string
  ram?: string
  ramMB?: number
  disk?: string
  diskMB?: number
  approvals?: number
  disapprovals?: number
  created_at?: string
  free_plan?: string
  links?: unknown
  image?: string
}

// Server-side cache
let hostsCache: Host[] | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function fetchHosts(): Promise<Host[]> {
  // Check if we have a valid cache
  if (
    hostsCache &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_DURATION
  ) {
    return hostsCache
  }

  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return hostsCache || []
  }

  try {
    const response = await fetch(`${process.env.API_URL}/api/hosts?limit=1000`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })
    if (!response.ok) throw new Error(`API ${response.status}`)
    const data = await response.json()

    const hostsData = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : []

    const cleanedHosts: Host[] = hostsData.map((host: RawHost) => ({
      id: host.id || 0,
      name: host.name || 'Unknown Host',
      description: host.description || '',
      info: host.info || '',
      type: host.type || '',
      locale: Array.isArray(host.locale) ? host.locale : [],
      targets: Array.isArray(host.targets) ? host.targets : [],
      status: host.status || 'Unknown',
      cpu: host.cpu || 'Unknown',
      ram: host.ram || 'Unknown',
      ramMB: host.ramMB || 0,
      disk: host.disk || 'Unknown',
      diskMB: host.diskMB || 0,
      approvals: host.approvals || 0,
      disapprovals: host.disapprovals || 0,
      created_at: host.created_at || '',
      free_plan: host.free_plan || '',
      links: Array.isArray(host.links) ? host.links : [],
      image: host.image,
    }))

    // Update cache
    hostsCache = cleanedHosts
    cacheTimestamp = Date.now()

    return cleanedHosts
  } catch (err) {
    console.error('Failed to fetch hosts list:', err)
    // Return cached data if available, even if stale
    return hostsCache || []
  }
}

export function getHostFromCache(id: number): Host | undefined {
  if (!hostsCache) return undefined
  return hostsCache.find((h) => h.id === id)
}

/**
 * Finds a host whose slugified name matches the given slug.
 * Uses the existing in-memory cache; calls fetchHosts() if cache is cold.
 */
export async function fetchHostBySlug(slug: string): Promise<Host | null> {
  return (await fetchHosts()).find(h => slugify(h.name) === slug) ?? null
}

// Fetch single host using the full list (API has no /:id route)
export async function fetchHostById(
  id: number | string,
): Promise<Host | null> {
  const hostId = Number(id)
  if (!Number.isFinite(hostId)) return null

  try {
    // Use cached list if fresh
    if (
      hostsCache &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_DURATION
    ) {
      const cached = hostsCache.find((h) => h.id === hostId)
      if (cached) return cached
    }

    // Otherwise fetch all hosts
    const allHosts = await fetchHosts()
    const host = allHosts.find((h) => h.id === hostId)
    return host || null
  } catch (err) {
    console.error('fetchHostById error:', err)
    const fallback = getHostFromCache(hostId)
    return fallback ?? null
  }
}
