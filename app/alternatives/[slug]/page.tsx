import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from '@/components/SiteLink'
import { safeJsonLd } from '../../../lib/safeJsonLd'
import { fetchHosts } from '../../../lib/hosts'
import { slugify } from '../../../lib/slugify'
import { splitTargets, findAlternatives, primaryBucket, hostRow, sharedTargets, providerKind, hasPublishedSpecs, primaryTargetLabel } from '../../../lib/taxonomy'
import CompareShell from '@/components/CompareShell'

// ISR: prerender all alternatives pages at build, regenerate at most every
// 30 min (revalidate must be a literal; keep in sync with lib/hosts.ts).
// dynamicParams covers hosts added after the build.
export const revalidate = 1800;
export const dynamicParams = true;

export async function generateStaticParams() {
  const hosts = await fetchHosts();
  return hosts.filter((h) => h.name).map((h) => ({ slug: slugify(h.name) }));
}

type Props = { params: Promise<{ slug: string }> }

const BUCKET_ADVICE: Record<string, string[]> = {
  gaming: [
    'Match the RAM to your server type — vanilla Minecraft runs on 1–2 GB, modpacks need more than most free tiers offer.',
    'Check the idle policy before anything else: many free game servers sleep when nobody is online and cold-start on the next join.',
    'Prefer hosts that include scheduled backups, so a corrupt world file never costs you everything.',
  ],
  website: [
    'Compare storage and monthly bandwidth caps first — they are the two limits small sites hit soonest.',
    'If you need your own domain or HTTPS certificate, filter for providers that include both on the free tier.',
    'Static-only hosts are extremely fast and reliable; dynamic (PHP/Node) free tiers trade convenience for tighter caps.',
  ],
  coding: [
    'Check supported runtimes and versions before signing up — this filter alone removes half the candidates.',
    'Idle-sleep policies matter most for bots and APIs: a paused process adds seconds to the first request after a quiet period.',
    'Keep state in an external database from day one so restarts and cold starts never lose data.',
  ],
  database: [
    'Storage caps and connection limits vary more between providers than engines do — compare both numbers.',
    'Some free databases pause after long idle periods and cold-start on the next query; fine for dev, risky for production.',
    'Schedule your own exports regardless of what the provider promises — free tiers back up less aggressively.',
  ],
  // Discord bot / bot-specific advice (maps to "coding" bucket after normalisation)
  'discord bots': [
    'Confirm whether the host allows persistent processes — some coding hosts kill idle bots after inactivity.',
    'Check that your bot framework and Node.js / Python version are supported before committing.',
    'Look for hosts with easy restarts and logs access so you can debug gateway disconnects quickly.',
  ],
  // VPS / raw compute (also maps to "coding")
  vps: [
    'Free VPS tiers often have strict bandwidth and CPU burst limits — check what happens when you exceed them.',
    'Confirm the OS image and kernel version match your software requirements before signing up.',
    'Look for providers that allow SSH access from day one so you can set up your stack without a web UI.',
  ],
  // Email hosting
  'email hosting': [
    'Verify that the provider supports custom domains — most free email tiers restrict you to their own domain.',
    'Check sending limits (messages per day) and storage quotas before choosing a free email host.',
    'DKIM/DMARC/SPF support matters for deliverability — confirm these are configurable on the free plan.',
  ],
  // Media / file sharing
  'media sharing': [
    'Compare storage caps and file size limits — they vary widely across free tiers.',
    'Check whether direct hotlinking to files is allowed; some providers restrict bandwidth on free plans.',
    'Verify the retention policy: some free tiers delete files that have not been accessed recently.',
  ],
  other: [
    'Verify the provider still actively maintains its free tier — status badges here reflect community reports.',
    'Compare what "free" includes: custom domains, SSL, and email accounts are commonly gated behind paid plans.',
  ],
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const all = await fetchHosts()
  const host = all.find(h => slugify(h.name) === slug) ?? null
  if (!host) return { title: 'Not Found', robots: { index: false, follow: false } }
  const alts = findAlternatives(host, all)
  const targetLabel = primaryTargetLabel(host)
  // Keep the full rendered title (base + " | FreeHosts") within ~60 chars.
  const longTitle = `${host.name} Alternatives: Free ${targetLabel.charAt(0).toUpperCase() + targetLabel.slice(1)} Compared`
  const shortTitle = `${host.name} Alternatives`
  const title = longTitle.length + 12 <= 60 ? longTitle : shortTitle
  const description =
    alts.length === 0
      ? `${host.name} alternatives are being verified. Browse the FreeHosts directory for ${all.length - 1} other free ${targetLabel} providers, compared spec by spec.`
      : `Looking beyond ${host.name}? Compare ${alts.length} free ${targetLabel} alternative${alts.length === 1 ? '' : 's'} side by side — RAM, CPU, storage and community reviews.`
  return {
    title,
    ...(description.length > 160 ? { description: description.slice(0, 157) + '...' } : { description }),
    alternates: { canonical: `${process.env.APP_URL}/alternatives/${slugify(host.name)}` },
    robots: {
      index: alts.length >= 2,
      follow: true,
      googleBot: { index: alts.length >= 2, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  }
}

export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params
  const all = await fetchHosts()
  const host = all.find(h => slugify(h.name) === slug) ?? null
  if (!host) notFound()
  const alts = findAlternatives(host, all)
  const rows = alts.map(h => ({
    ...hostRow(h),
    shared: sharedTargets(host, h),
    kind: providerKind(h),
    status: h.status || 'Unknown',
    hasSpecs: hasPublishedSpecs(h),
  }))
  const hostSlug = slugify(host.name)
  const pageUrl = `${process.env.APP_URL}/alternatives/${hostSlug}`
  const tags = splitTargets(host)
  const hostKind = providerKind(host)
  const targetLabel = primaryTargetLabel(host)
  const hostKindLabel = hostKind === 'hosting' ? `free ${targetLabel} providers` : hostKind === 'subdomains' ? 'free subdomain providers' : 'free domain providers'

  // Try a raw-target-specific advice entry first (e.g. "discord bots"),
  // then the normalised bucket (e.g. "coding"), then the generic fallback.
  const rawTargetAdviceKey = tags.map(t => t.toLowerCase()).find(t => BUCKET_ADVICE[t])
  const advice = (rawTargetAdviceKey ? BUCKET_ADVICE[rawTargetAdviceKey] : null)
    ?? BUCKET_ADVICE[primaryBucket(host)]
    ?? BUCKET_ADVICE['other']


  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Free ${targetLabel} alternatives to ${host.name}`,
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${process.env.APP_URL}/hosts/${r.slug}`,
      name: r.name,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }} />
      <CompareShell
        pageUrl={pageUrl}
        name={`${host.name} Alternatives`}
        description={`Free ${targetLabel} alternatives to ${host.name}, compared side by side.`}
        dateModified={host.created_at ? new Date(host.created_at).toISOString().split('T')[0] : undefined}
        crumbs={[
          { name: 'Free Hosting Directory', path: '/hosts' },
          { name: host.name, path: `/hosts/${hostSlug}` },
          { name: 'Alternatives', path: `/alternatives/${hostSlug}` },
        ]}
        heroTitle={`${host.name} Alternatives`}
        heroLead={
          rows.length >= 2 ? (
            <>
              The {rows.length} best free {targetLabel} alternatives to {host.name}, compared on specs, limits and community reviews.
              Every option below is a live listing in the FreeHosts directory.
            </>
          ) : rows.length === 1 ? (
            <>
              {rows[0].name} is currently the closest verified free {targetLabel} alternative to {host.name}, serving similar use
              cases — see the comparison below and browse the directory for more options.
            </>
          ) : (
            <>We have not yet verified enough similar {targetLabel} providers to list alternatives to {host.name}. Meanwhile, the directory lists {all.length - 1} other providers.</>
          )
        }
        ctaTitle="Still deciding?"
        ctaText="Browse the full directory or compare shortlisted hosts side by side."
        ctaButtons={[
          { href: '/hosts', label: 'Browse all free hosts', primary: true },
          { href: `/hosts/${hostSlug}`, label: `Back to ${host.name}` },
        ]}
      >
        {rows.length >= 1 && (
          <section className="content-section">
            <h2>{rows.length === 1 ? `Free ${targetLabel} alternative to ${host.name}` : `Free ${host.name} alternatives compared`}</h2>
            <p className="host-about-summary">
              All {rows.length} options below are <strong>{hostKindLabel}</strong> sharing at least one use-case with {host.name} (
              {tags.join(', ') || 'general hosting'}). Alternatives are ranked by shared focus, spec completeness and community reviews — not alphabetically.
              Specs are the provider&apos;s published free plan at listing time. Tap any name for the full profile.
            </p>
            {hostKind !== 'hosting' && (
              <p className="host-about-summary" style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                Note: {host.name} is classified as a {hostKind} provider (hands out addresses, not compute). These alternatives are the same kind — they are not comparable to VPS / app hosting on RAM or CPU.
              </p>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table className="info-table alt-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Shared focus</th>
                    <th>CPU</th>
                    <th>RAM</th>
                    <th>Storage</th>
                    <th>Status</th>
                    <th>Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.slug}>
                      <td><Link href={`/hosts/${r.slug}`}>{r.name}</Link>{!r.hasSpecs && <span style={{ marginLeft: 6, fontSize: '0.75em', color: 'var(--muted)' }} title="No concrete specs published">— specs TBA</span>}</td>
                      <td title={r.shared.join(', ')}>{r.shared.length > 0 ? r.shared.join(', ') : '—'}</td>
                      <td>{r.cpu}</td>
                      <td>{r.ram}</td>
                      <td>{r.disk}</td>
                      <td><span className={`status-badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
                      <td>{r.ratingPct !== null ? `${r.ratingPct}% (${r.votes} review${r.votes === 1 ? '' : 's'})` : 'No reviews yet'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="host-about-summary" style={{ fontSize: '0.9em', opacity: 0.9 }}>
              Methodology: filtered to same provider kind (<code>{hostKind}</code>) and at least one shared bucket; sorted by shared-bucket count → spec completeness → positive reviews. See <Link href="/methodology">how we review listings</Link>.
            </p>
            {rows.length >= 1 && (
              <p className="host-about-summary">
                Head-to-head:{' '}
                {rows.slice(0, 3).map((r, i) => (
                  <span key={r.slug}>
                    {i > 0 && ' · '}
                    <Link href={`/vs/${hostSlug}-vs-${r.slug}`}>{host.name} vs {r.name}</Link>
                  </span>
                ))}
              </p>
            )}
          </section>
        )}

        <section className="content-section">
          <h2>Why look for {host.name} alternatives?</h2>
          <p className="host-about-summary">
            {host.status && host.status.toLowerCase() === 'closed'
              ? `${host.name} is currently listed as closed, so the options above are the active way to get the same kind of service.`
              : `Free tiers trade capacity for cost, and even good providers are not a fit for every project.`}{' '}
            Common reasons people switch include resource caps being tighter than a project needs, idle policies that pause
            servers or apps, queue or waitlist systems on popular plans, and limits like no custom domains.{' '}
            {tags.length > 0 ? `${host.name} covers ${tags.join(', ')}.` : null}
          </p>
        </section>

        <section className="content-section">
          <h2>How to choose between free hosting alternatives</h2>
          <ul className="host-check-list">
            {advice.map(line => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </CompareShell>
    </>
  )
}
