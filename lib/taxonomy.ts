import { slugify } from './slugify'
import { ramDisplay, diskDisplay } from './specs'
import { computeRating } from './comparisonRows'
import { getLanguageName } from './getLanguageName'
import type { Host } from './hosts'

// A host's `targets` field is a comma-separated list inside each array entry
// (e.g. ["Website, Static"]). Split it into clean individual tags.
export function splitTargets(host: Host): string[] {
  const out: string[] = []
  for (const t of host.targets ?? []) {
    for (const part of String(t).split(',')) {
      const p = part.trim()
      if (p) out.push(p)
    }
  }
  return [...new Set(out)]
}

/** Case/whitespace-insensitive key for exact raw-target matching:
 *  "Website (Static)" and "Website(Static)" are the same tag, while
 *  "Web Hosting" stays distinct. Used to rank same-niche hosts first. */
export function rawTargetKey(t: string): string {
  return t.toLowerCase().replace(/\s+/g, "");
}

/**
 * Hosts that could reasonably be an alternative to `host`: share at least one
 * target bucket AND same provider kind (hosting vs subdomains/domains) to avoid
 * comparing apples to oranges. Ranked by exact raw-target matches first (a
 * "Website (Static)" host belongs above a generic "Web Hosting" one for a
 * static-site provider), then shared-bucket count, then votes.
 */
export function findAlternatives(host: Host, all: Host[], limit = 12): Host[] {
  const buckets = targetBuckets(host)
  const hostKeys = new Set(splitTargets(host).map(rawTargetKey))
  const hostSlug = slugify(host.name)
  const hostKind = providerKind(host)
  return all
    .filter(h => {
      if (slugify(h.name) === hostSlug) return false
      if (providerKind(h) !== hostKind) return false
      return [...targetBuckets(h)].some(b => buckets.has(b))
    })
    .map(h => {
      const hBuckets = targetBuckets(h);
      const approvals = Number.isFinite(h.approvals) ? h.approvals : 0;
      const disapprovals = Number.isFinite(h.disapprovals) ? h.disapprovals : 0;
      let exact = 0;
      for (const k of splitTargets(h).map(rawTargetKey)) if (hostKeys.has(k)) exact += 1;
      return {
        h,
        exact,
        shared: [...hBuckets].filter(b => buckets.has(b)).length,
        score: (approvals - disapprovals),
        hasSpecs: hasPublishedSpecs(h) ? 1 : 0,
      };
    })
    .sort((a, b) => {
      if (b.exact !== a.exact) return b.exact - a.exact
      if (b.shared !== a.shared) return b.shared - a.shared
      if (b.hasSpecs !== a.hasSpecs) return b.hasSpecs - a.hasSpecs
      if (b.score !== a.score) return b.score - a.score
      return a.h.name.localeCompare(b.h.name)
    })
    .map(x => x.h)
    .slice(0, limit)
}

/** Primary target bucket used to tailor advice copy on taxonomy pages. */
/** Deterministically pick a representative bucket from a set. */
function firstBucket(buckets: Set<string>): string {
  return [...buckets].sort()[0] ?? 'other'
}

export function primaryBucket(host: Host): string {
  return firstBucket(targetBuckets(host))
}

/** The most relevant bucket two hosts SHARE, for versus-page advice. */
export function sharedBucket(a: Host, b: Host): string {
  const bBuckets = targetBuckets(b)
  const shared = [...targetBuckets(a)].filter(x => bBuckets.has(x))
  return shared.length > 0 ? firstBucket(new Set(shared)) : 'other'
}

export function hostRow(host: Host): {
  slug: string; name: string; targets: string; languages: string;
  cpu: string; ram: string; disk: string; votes: number; ratingPct: number | null
} {
  const totalVotes = (host.approvals || 0) + (host.disapprovals || 0)
  const rating = computeRating(host)
  const languages = [...new Set((host.locale ?? []).map((l) => getLanguageName(String(l).trim())).filter(Boolean))]
  return {
    slug: slugify(host.name),
    name: host.name,
    targets: splitTargets(host).join(', ') || '—',
    languages: languages.join(', ') || '—',
    cpu: host.cpu || '—',
    ram: ramDisplay(host),
    disk: diskDisplay(host),
    votes: totalVotes,
    ratingPct: rating < 0 ? null : Math.round(rating),
  }
}

// ─── Target normalisation ────────────────────────────────────────────────────
// Algorithmic, zero-maintenance: any new target string the API starts
// returning groups automatically with hosts sharing the same normalised
// form. No rules to update when targets change.

const BUCKET_ALIASES: Record<string, string> = {
  // Website variants
  'web hosting': 'website',
  'web': 'website',
  'website builder': 'website',
  'wiki pages': 'website',
  'docs': 'website',
  'forum': 'website',
  // Coding variants
  'codespace': 'coding',
  'developers': 'coding',
  'discord bots': 'coding',
  'discord bot': 'coding',
  'vps': 'coding',
  'coding website': 'coding',
  // Gaming variants
  'gaming beammp': 'gaming',
  // Database variants
  'databases': 'database',
  // Other
  'email hosting': 'other',
  'media sharing': 'other',
}

/**
 * "Website (Static)" -> "website"
 * "Coding(Python)"   -> "coding"
 * "Database (Postgres)" -> "database"
 * "Free Minecraft"   -> "free minecraft"  (new tags just work)
 * "Web Hosting"      -> "website" (alias)
 * "Discord Bots"     -> "coding" (alias)
 * "VPS"              -> "coding" (alias)
 */
export function normalizeTarget(raw: string): string {
  let t = raw.toLowerCase().trim()
  t = t.replace(/\([^)]*\)/g, ' ')        // drop parenthetical qualifiers
  t = t.replace(/[^a-z0-9+.# ]+/g, ' ')   // unify separators
  t = t.replace(/\s+/g, ' ').trim()
  t = BUCKET_ALIASES[t] ?? t
  return t || 'other'
}

export function targetBuckets(host: Host): Set<string> {
  const out = new Set<string>()
  for (const raw of splitTargets(host)) out.add(normalizeTarget(raw))
  if (out.size === 0) out.add('other')
  return out
}

export function sharedTargets(a: Host, b: Host): string[] {
  const aTags = new Set(splitTargets(a).map(normalizeTarget))
  const bTags = new Set(splitTargets(b).map(normalizeTarget))
  return [...aTags].filter(t => bTags.has(t))
}

// ─── Versus pages ────────────────────────────────────────────────────────────

/** Parse "a-vs-b" into two slugs. Splits on the LAST "-vs-" so host slugs
 * containing "-vs-" still parse (left part keeps its "-vs-"). */
export function parseVsSlug(pair: string): [string, string] | null {
  const idx = pair.lastIndexOf('-vs-')
  if (idx <= 0 || idx + 4 >= pair.length) return null
  const a = pair.slice(0, idx)
  const b = pair.slice(idx + 4)
  if (!a || !b) return null
  return [a, b]
}

/** A host has something meaningful to put in a comparison table. */
function hasComparableData(host: Host): boolean {
  const hasSpecs = Boolean(host.ramMB || host.diskMB || (host.cpu && host.cpu !== 'Unknown'))
  const hasVotes = (host.approvals || 0) + (host.disapprovals || 0) > 0
  return hasSpecs || hasVotes
}

/**
 * Every pair of hosts sharing at least one target bucket AND same provider kind,
 * in canonical (alphabetical) slug order. Pairs where BOTH hosts lack any spec
 * data and votes are excluded — there would be nothing to compare.
 */
export function compatibleVsPairs(hosts: Host[]): { slug: string }[] {
  const entries = hosts
    .filter(h => h.name)
    .map(h => ({ h, slug: slugify(h.name), buckets: targetBuckets(h), usable: hasComparableData(h), kind: providerKind(h) }))
  const out: { slug: string }[] = []
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i]
      const b = entries[j]
      if (a.kind !== b.kind) continue
      if (!a.usable && !b.usable) continue // two empty listings = empty page
      let shared = false
      for (const bucket of a.buckets) {
        if (b.buckets.has(bucket)) { shared = true; break }
      }
      if (!shared) continue
      out.push({ slug: [a.slug, b.slug].sort().join('-vs-') })
    }
  }
  return out
}

// ─── Provider classification ─────────────────────────────────────────────────

export type ProviderKind = 'subdomains' | 'domains' | 'hosting'

/**
 * What the provider fundamentally gives out:
 * - "hosting"   runs your workload (specs may or may not be published)
 * - "subdomains" hands out addresses under its own domains (no resources)
 * - "domains"   registers free domain names (no resources)
 */
export function providerKind(host: Host): ProviderKind {
  const raws = splitTargets(host).map(t => t.toLowerCase())
  if (raws.length === 0) return 'hosting'
  const addressOnly = raws.every(t => t.includes('subdomain') || t.includes('domain'))
  if (!addressOnly) return 'hosting'
  return raws.some(t => t.includes('subdomain')) ? 'subdomains' : 'domains'
}

export function hasPublishedSpecs(host: Host): boolean {
  return Boolean(
    (host.cpu && host.cpu !== 'Unknown') ||
    host.ramMB ||
    host.diskMB ||
    (host.ram && host.ram !== 'Unknown') ||
    (host.disk && host.disk !== 'Unknown'),
  )
}

/**
 * Returns a concise, human-readable label for the host's primary use case.
 * Used for accurate metadata titles and descriptions.
 * Examples: "Minecraft hosting", "Discord bot hosting", "web hosting", "database hosting"
 */
export function primaryTargetLabel(host: Host): string {
  const buckets = targetBuckets(host)
  const raws = splitTargets(host).map(t => t.toLowerCase())

  // Specific popular use-case detection based on raw targets (most precise first)
  if (raws.some(t => t.includes('minecraft'))) return 'Minecraft server hosting'
  if (raws.some(t => t.includes('discord bot') || t.includes('discord bots'))) return 'Discord bot hosting'
  if (raws.some(t => t.includes('beammp'))) return 'BeamMP & gaming server hosting'
  if (raws.some(t => t.includes('email'))) return 'email hosting'
  if (raws.some(t => t.includes('media'))) return 'media sharing'
  if (raws.some(t => t.includes('vps'))) return 'VPS hosting'
  if (raws.some(t => t.includes('subdomain'))) return 'free subdomain provider'
  if (raws.some(t => t.includes('domain') && !t.includes('subdomain'))) return 'free domain provider'
  if (raws.some(t => t.includes('static'))) return 'static website hosting'
  if (raws.some(t => t.includes('wordpress'))) return 'WordPress hosting'
  if (raws.some(t => t.includes('website builder') || t.includes('builder'))) return 'website builder hosting'
  if (raws.some(t => t.includes('serverless'))) return 'serverless function hosting'

  // Bucket-level fallback
  if (buckets.has('gaming')) return 'game server hosting'
  if (buckets.has('website')) return 'web hosting'
  if (buckets.has('coding')) return 'app & bot hosting'
  if (buckets.has('database')) return 'database hosting'
  return 'free hosting'
}
