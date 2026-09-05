import { formatSize } from './parseSpecs'

export interface SpecSource {
  cpu?: string
  ram?: string
  ramMB?: number
  disk?: string
  diskMB?: number
}

// Some listings publish quotas, not capacity ("200 GB per day",
// "500 GB-hours", "50 active hours/month"). The byte-derived figure would
// be a lie there ("500.0 GB"), so the provider's own words win.
const QUOTA_RE = /per\s*(day|month|year)|hour|hits|visits|bandwidth|\/\s*(day|mo|month)\b/i;

/**
 * The display value for RAM: the provider's literal string when it states a
 * quota, otherwise the byte-derived figure, otherwise the raw string.
 */
export function ramDisplay(host: SpecSource): string {
  if (host.ram && QUOTA_RE.test(host.ram)) return host.ram
  return (host.ramMB ? formatSize(host.ramMB) : '') || host.ram || 'Unknown'
}

/**
 * The display value for storage: same precedence rule as RAM.
 */
export function diskDisplay(host: SpecSource): string {
  if (host.disk && QUOTA_RE.test(host.disk)) return host.disk
  return (host.diskMB ? formatSize(host.diskMB) : '') || host.disk || 'Unknown'
}

/**
 * Compact one-line spec summary used in meta descriptions and
 * JSON-LD Offer text. Omits unknown values entirely rather than
 * printing "Unknown".
 */
export function specSummary(host: SpecSource): string {
  const parts: string[] = []
  if (host.cpu && host.cpu !== 'Unknown') parts.push(`${host.cpu} CPU`)
  const ram = ramDisplay(host)
  if (ram !== 'Unknown') parts.push(`${ram} RAM`)
  const disk = diskDisplay(host)
  if (disk !== 'Unknown') parts.push(`${disk} storage`)
  return parts.join(', ')
}
