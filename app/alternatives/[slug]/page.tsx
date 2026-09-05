import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from '@/components/SiteLink'
import { safeJsonLd } from '../../../lib/safeJsonLd'
import { fetchHosts } from '../../../lib/hosts'
import { slugify } from '../../../lib/slugify'
import { splitTargets, findAlternatives, primaryBucket, hostRow, sharedTargets, providerKind, hasPublishedSpecs, primaryTargetLabel } from '../../../lib/taxonomy'
import { extractDomainNames } from '../../../lib/domains'
import CompareShell from '@/components/CompareShell'
import { SITE_URL } from '../../../lib/site'

// Prerender all alternatives pages at build; data freshness comes from
// fetchHosts()' cache lifetime. Hosts added after the build render on demand.
export async function generateStaticParams() {
  const hosts = await fetchHosts();
  const params = hosts.filter((h) => h.name).map((h) => ({ slug: slugify(h.name) }));
  // Must return ≥1 param under Cache Components; a never-matching sentinel
  // keeps the build green when the API is unreachable (renders notFound()).
  return params.length > 0 ? params : [{ slug: '__unlisted__' }];
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
    alternates: { canonical: `${SITE_URL}/alternatives/${slugify(host.name)}` },
    robots: {
      index: alts.length >= 2,
      follow: true,
      googleBot: { index: alts.length >= 2, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      title,
      description: description.length > 160 ? description.slice(0, 157) + '...' : description,
      url: `${SITE_URL}/alternatives/${slugify(host.name)}`,
      siteName: 'FreeHosts',
      type: 'website',
      locale: 'en_US',
      images: [{ url: `${SITE_URL}/Src/Images/banner.png`, width: 1280, height: 720, alt: `${host.name} alternatives on FreeHosts` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.length > 160 ? description.slice(0, 157) + '...' : description,
      images: [{ url: `${SITE_URL}/Src/Images/banner.png`, alt: `${host.name} alternatives on FreeHosts` }],
      site: '@freehosts_',
      creator: '@freehosts_',
    },
  }
}

export default function AlternativesPage({ params }: Props) {
  // Params resolve at request time for hosts added after the build — await
  // them inside Suspense so the static shell still prerenders.
  return (
    <Suspense fallback={null}>
      <AlternativesBody params={params} />
    </Suspense>
  );
}

async function AlternativesBody({ params }: Props) {
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
  const pageUrl = `${SITE_URL}/alternatives/${hostSlug}`
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
    ...(rows.length > 0
      ? {
          itemListElement: rows.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/hosts/${r.slug}`,
            name: r.name,
          })),
        }
      : {}),
  }

  const topPick = rows.length > 0 ? rows[0] : null;
  const topPickHost = alts.length > 0 ? alts[0] : null;
  // Compute specs only exist for compute providers. Subdomain/domain rows
  // never publish them, so their columns (and the "specs" tag) drop out
  // instead of rendering an Unknown wall.
  const showSpecColumns = rows.some((r) => r.cpu !== 'Unknown' || r.ram !== 'Unknown' || r.disk !== 'Unknown');
  const pickDomains = topPickHost && hostKind !== 'hosting'
    ? extractDomainNames(`${topPickHost.info || ''}\n${topPickHost.free_plan || ''}`)
    : [];
  const topPickReason = topPick
    ? [
        topPick.shared.length > 0
          ? `shares ${topPick.shared.length} use-case${topPick.shared.length === 1 ? '' : 's'} (${topPick.shared.slice(0, 2).join(', ')})`
          : null,
        topPick.ratingPct !== null
          ? `rated ${topPick.ratingPct}% across ${topPick.votes} review${topPick.votes === 1 ? '' : 's'}`
          : 'no reviews yet — judge it on specs',
      ]
        .filter(Boolean)
        .join(' · ')
    : null;

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
        eyebrow="Free alternatives"
        heroStats={
          rows.length > 0
            ? [
                { value: String(rows.length), label: rows.length === 1 ? 'verified option' : 'verified options' },
                { value: hostKind === 'hosting' ? 'Hosting' : hostKind === 'subdomains' ? 'Subdomains' : 'Domains', label: 'provider kind' },
                { value: tags[0] ?? 'General', label: 'main use-case' },
              ]
            : [{ value: 'Verifying', label: 'more options soon' }]
        }
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
        {topPick && topPickReason && (
          <section className="content-section" aria-labelledby="top-pick-heading">
            <h2 id="top-pick-heading">Our top pick</h2>
            <article className="cmp-pick-card">
              <div className="cmp-pick-rank" aria-hidden="true">#1</div>
              <div className="cmp-pick-body">
                <h3 className="cmp-pick-name">
                  <Link href={`/hosts/${topPick.slug}`}>{topPick.name}</Link>
                </h3>
                <p className="cmp-pick-reason">{topPickReason}.</p>
                <p className="cmp-pick-specs">
                  {pickDomains.length > 0
                    ? `Available domains: ${pickDomains.slice(0, 6).join(', ')}${pickDomains.length > 6 ? ', …' : ''}`
                    : ([topPick.cpu, topPick.ram, topPick.disk].filter((s) => s && s !== 'Unknown').join(' · ') || 'Specs not published — see its profile for details.')}
                </p>
                <div className="cmp-pick-actions">
                  <Link href={`/hosts/${topPick.slug}`} className="btn primary">View full profile</Link>
                  <Link
                    href={`/vs/${[hostSlug, topPick.slug].sort().join('-vs-')}`}
                    className="btn"
                  >
                    {host.name} vs {topPick.name}
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {rows.length >= 1 && (
          <section className="content-section" aria-labelledby="all-options-heading">
            <h2 id="all-options-heading">
              {rows.length === 1
                ? `The alternative at a glance`
                : `All ${rows.length} alternatives compared`}
            </h2>
            <p className="host-about-summary">
              Every option is a <strong>{hostKindLabel}</strong> sharing at least one use-case with {host.name} (
              {tags.join(', ') || 'general hosting'}). Ranked by shared focus, spec completeness and community reviews — not alphabetically.
              Tap any name for the full profile.
            </p>
            {hostKind !== 'hosting' && (
              <p className="host-about-summary cmp-note">
                Note: {host.name} hands out addresses, not compute ({hostKind}). These alternatives are the same kind — don&apos;t compare them to VPS or app hosting on RAM or CPU.
              </p>
            )}
            <div className="cmp-table-scroll" role="region" aria-label="Alternatives comparison table, scroll horizontally on small screens" tabIndex={0}>
              <table className="cmp-table">
                <caption className="sr-only">Free {targetLabel} alternatives to {host.name}, ranked best first</caption>
                <thead>
                  <tr>
                    <th scope="col"><span className="sr-only">Rank</span></th>
                    <th scope="col">Provider</th>
                    <th scope="col">Why it fits</th>
                    {showSpecColumns && (
                      <>
                    <th scope="col">CPU</th>
                    <th scope="col">RAM</th>
                    <th scope="col">Storage</th>
                      </>
                    )}
                    <th scope="col">Languages</th>
                    <th scope="col">Status</th>
                    <th scope="col">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.slug} className={i === 0 ? 'cmp-table-row--top' : undefined}>
                      <th scope="row" className="cmp-rank" aria-label={`Ranked number ${i + 1}`}>{i + 1}</th>
                      <td className="cmp-provider-cell">
                        <Link href={`/hosts/${r.slug}`}>{r.name}</Link>
                        {!r.hasSpecs && r.kind === 'hosting' && <span className="cmp-specs-tba" title="This provider does not publish concrete specs">No specs published</span>}
                      </td>
                      <td title={r.shared.join(', ')}>{r.shared.length > 0 ? r.shared.slice(0, 2).join(', ') : '—'}</td>
                      {showSpecColumns && (
                        <>
                      <td>{r.cpu}</td>
                      <td>{r.ram}</td>
                      <td>{r.disk}</td>
                        </>
                      )}
                      <td>{r.languages}</td>
                      <td><span className={`status-badge ${(r.status.toLowerCase().replace(/[^a-z0-9-]+/g, '-') || 'unknown')}`}>{r.status}</span></td>
                      <td>{r.ratingPct !== null ? `${r.ratingPct}% (${r.votes})` : <span className="cmp-muted">No reviews</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <details className="cmp-methodology">
              <summary>How we rank these alternatives</summary>
              <p>
                Filtered to the same provider kind (<code>{hostKind}</code>) with at least one shared use-case; sorted by
                shared focus → spec completeness → positive reviews. Specs are each provider&apos;s published free plan at
                listing time. See <Link href="/methodology">how we review listings</Link>.
              </p>
            </details>
            {rows.length > 1 && (
              <div className="cmp-h2h">
                <span className="cmp-h2h-label" id="h2h-label">Head-to-head:</span>
                <ul className="cmp-h2h-pills" aria-labelledby="h2h-label">
                  {rows.slice(0, 3).map((r) => {
                    const [first, second] = [hostSlug, r.slug].sort();
                    return (
                      <li key={r.slug}>
                        <Link href={`/vs/${first}-vs-${second}`} className="cmp-pill">{host.name} vs {r.name}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>
        )}

        <div className="cmp-guide-grid">
          <section className="content-section" aria-labelledby="why-switch-heading">
            <h2 id="why-switch-heading">Why look beyond {host.name}?</h2>
            <p className="host-about-summary">
              {host.status && host.status.toLowerCase() === 'closed'
                ? `${host.name} is currently listed as closed, so the options above are the active way to get the same kind of service.`
                : `Free tiers trade capacity for cost, and even good providers are not a fit for every project.`}{' '}
              Common reasons people switch: tighter resource caps than a project needs, idle policies that pause
              servers or apps, queues on popular plans, and limits like no custom domains.{' '}
              {tags.length > 0 ? `${host.name} covers ${tags.join(', ')}.` : null}
            </p>
          </section>

          <section className="content-section" aria-labelledby="how-choose-heading">
            <h2 id="how-choose-heading">How to choose</h2>
            <ul className="host-check-list">
              {advice.map(line => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        </div>
      </CompareShell>
    </>
  )
}
