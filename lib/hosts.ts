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

// Directory data changes at human curation pace (new listings, status flips,
// votes), so a 30-minute shared cache is the deliberate trade-off: the API is
// hit at most twice per hour per region instead of on every request, while
// edits still surface quickly. Tag allows future on-demand invalidation via
// revalidateTag('hosts') from a webhook/route handler.
export const HOSTS_CACHE_TAG = 'hosts'
export const HOSTS_REVALIDATE_SECONDS = 1800

export async function fetchHosts(): Promise<Host[]> {
  try {
    const response = await fetch(`${process.env.API_URL}/api/hosts?limit=1000`, {
      next: { revalidate: HOSTS_REVALIDATE_SECONDS, tags: [HOSTS_CACHE_TAG] },
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

    return cleanedHosts
  } catch (err) {
    console.error('Failed to fetch hosts list:', err)
    return []
  }
}
