import { cacheLife, cacheTag } from "next/cache";
import { API_BASE, contentHash } from "./site";
import { isHttpUrl } from "./url";

export interface Host {
  id: number
  name: string
  description?: string
  info?: string
  type?: string
  /** True when the API type tag includes "trusted" (only "free" otherwise). */
  trusted: boolean
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

// The API's spec strings carry typos and N/A variants ("Unknwon", "N/A").
// Normalise them to "Unknown" once so every downstream check (published
// specs, summaries, comparisons, displays) agrees on what "no data" is.
function normalizeSpec(value: unknown): string {
  if (typeof value !== "string") return "Unknown";
  const v = value.trim();
  if (!v) return "Unknown";
  if (/^(unknown|unknwon|n\/a|n\.a\.?|none|-|—)$/i.test(v)) return "Unknown";
  return v;
}

// Listings sometimes repeat a URL with/without trailing slash — dedupe on
// the normalised form so link lists read like a human wrote them.
function dedupeLinks(links: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const link of links) {
    const key = link.trim().replace(/\/+$/, "").toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(link.trim());
  }
  return out;
}

// Directory data changes at human curation pace; freshness is governed by
// the `use cache` lifetime inside fetchHosts() below.
function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v)).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

export async function fetchHosts(): Promise<Host[]> {
  // Cached function (replaces the old ISR model: per-page `export const
  // revalidate` + fetch `next.revalidate`): one shared entry keyed by
  // (empty) args, 30-min background revalidation, hard expire after a day,
  // tag reserved for future on-demand invalidation.
  "use cache";
  cacheLife({ stale: 1800, revalidate: 1800, expire: 86400 });
  cacheTag("hosts");
  try {
    const response = await fetch(`${API_BASE}/api/hosts?limit=1000`, {
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`API ${response.status}`)
    const data = await response.json()

    const hostsData = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : []

    const cleanedHosts: Host[] = hostsData.map((host: RawHost, index: number) => ({
      id: typeof host.id === "number" && Number.isFinite(host.id) ? host.id : -(index + 1),
      name: typeof host.name === "string" && host.name.trim() ? host.name.trim() : `Host ${index + 1}`,
      description: host.description || '',
      info: host.info || '',
      type: host.type || '',
      trusted: typeof host.type === "string" && host.type.toLowerCase().includes("trusted"),
      locale: toStringArray(host.locale),
      targets: toStringArray(host.targets),
      status: host.status || 'Unknown',
      cpu: normalizeSpec(host.cpu),
      ram: normalizeSpec(host.ram),
      ramMB: host.ramMB || 0,
      disk: normalizeSpec(host.disk),
      diskMB: host.diskMB || 0,
      approvals: Number.isFinite(host.approvals) ? (host.approvals as number) : 0,
      disapprovals: Number.isFinite(host.disapprovals) ? (host.disapprovals as number) : 0,
      created_at: host.created_at || '',
      free_plan: host.free_plan || '',
      links: dedupeLinks(toStringArray(host.links)),
      image: typeof host.image === "string" && isHttpUrl(host.image) ? host.image : undefined,
    }))

    return cleanedHosts
  } catch (err) {
    console.error('Failed to fetch hosts list:', err)
    return []
  }
}

// Version for the host's OG image URL: every field rendered into the image
// feeds the hash, so the URL changes exactly when the image would. The CDN
// caches each version immutably; stale versions are simply never linked.
export function hostOgVersion(host: Host): string {
  return contentHash(
    [host.name, host.cpu, host.ram, host.ramMB, host.disk, host.diskMB, host.status, host.approvals, host.disapprovals, host.targets.join(',')].join('|'),
  );
}
