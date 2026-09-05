import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from '@/components/SiteLink'
import { Trophy, Scale } from 'lucide-react'
import { fetchHosts, type Host } from '../../../lib/hosts'
import { slugify } from '../../../lib/slugify'
import { splitTargets, targetBuckets, parseVsSlug, sharedBucket, providerKind, sharedTargets, primaryTargetLabel } from '../../../lib/taxonomy'
import { permanentRedirect } from 'next/navigation'
import { ramDisplay, diskDisplay, specSummary } from '../../../lib/specs'
import { computeRating } from '../../../lib/comparisonRows'
import { getLanguageName } from '../../../lib/getLanguageName'
import { extractLocations } from '../../../lib/hostContent'
import CompareShell from '@/components/CompareShell'
import { SITE_URL } from '../../../lib/site'

// On demand: the pair space is combinatorial (thousands of URLs), so pages
// render on first request; data freshness comes from fetchHosts()' cache.
type Props = { params: Promise<{ slug: string }> }

const BUCKET_PICK: Record<string, string> = {
  gaming: 'For game servers, RAM is the deciding number — vanilla worlds run on 1–2 GB, while modpacks demand more than most free tiers publish.',
  website: 'For websites, storage and bandwidth caps decide how far the free plan stretches; custom-domain support is the next tiebreaker.',
  coding: 'For apps and bots, the idle policy decides daily experience: a paused process answers seconds late after quiet periods.',
  database: 'For databases, compare storage caps and connection limits — they vary more between providers than engines do.',
  'discord bots': 'For Discord bots, uptime and idle policies are critical — check if the host kills processes when inactive.',
  vps: 'For raw VPS compute, check the OS images offered and whether root SSH access is provided out of the box.',
  'email hosting': 'For email hosting, sending limits and custom domain support are the key differentiators.',
  'media sharing': 'For media sharing, storage quotas and bandwidth limits will dictate how useful the free plan is.',
  other: 'Compare what "free" includes at each provider: custom domains, SSL and email are the features most often gated behind paid plans.',
}

function pct(host: Host): number | null {
  const rating = computeRating(host)
  return rating < 0 ? null : Math.round(rating)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pair = parseVsSlug(slug)
  if (!pair) return { title: 'Not Found', robots: { index: false, follow: false } }
  const hosts = await fetchHosts()
  const a = hosts.find(h => slugify(h.name) === pair[0])
  const b = hosts.find(h => slugify(h.name) === pair[1])
  if (!a || !b) return { title: 'Not Found', robots: { index: false, follow: false } }
  // One canonical direction per pair: /vs/b-vs-a permanently redirects to /vs/a-vs-b.
  const [first, second] = [slugify(a.name), slugify(b.name)].sort()
  if (`${first}-vs-${second}` !== slug) {
    return { alternates: { canonical: `${SITE_URL}/vs/${first}-vs-${second}` }, robots: { index: false, follow: true } }
  }

  const sharedOk = [...targetBuckets(a)].some(bucket => targetBuckets(b).has(bucket))
  const targetLabel = sharedOk ? primaryTargetLabel(a) : 'hosting'

  // Keep the rendered title (base + " | FreeHosts") within ~60 chars.
  const longTitle = `${a.name} vs ${b.name}: Free ${targetLabel.charAt(0).toUpperCase() + targetLabel.slice(1)} Compared`
  const shortTitle = `${a.name} vs ${b.name} compared`
  const title = longTitle.length + 12 <= 60 ? longTitle : (shortTitle.length + 12 <= 60 ? shortTitle : `${a.name} vs ${b.name}`)
  const description =
    `${a.name} and ${b.name} side by side: targets, CPU, RAM, storage, status and community reviews. ` +
    `An honest, spec-level comparison of two free ${targetLabel} providers.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/vs/${first}-vs-${second}` },
    robots: {
      index: sharedOk,
      follow: true,
      googleBot: { index: sharedOk, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/vs/${first}-vs-${second}`,
      siteName: 'FreeHosts',
      type: 'website',
      locale: 'en_US',
      images: [{ url: `${SITE_URL}/Src/Images/banner.png`, width: 1280, height: 720, alt: `${a.name} vs ${b.name} on FreeHosts` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: `${SITE_URL}/Src/Images/banner.png`, alt: `${a.name} vs ${b.name} on FreeHosts` }],
      site: '@freehosts_',
      creator: '@freehosts_',
    },
  }
}

export default function VersusPage({ params }: Props) {
  // The pair space is combinatorial — params resolve at request time, so
  // await them inside Suspense to keep a prerenderable static shell.
  return (
    <Suspense fallback={null}>
      <VersusBody params={params} />
    </Suspense>
  );
}

async function VersusBody({ params }: Props) {
  const { slug } = await params
  const pair = parseVsSlug(slug)
  if (!pair) notFound()

  const all = await fetchHosts()
  const a = all.find(h => slugify(h.name) === pair[0])
  const b = all.find(h => slugify(h.name) === pair[1])
  if (!a || !b) notFound()
  if (slugify(a.name) === slugify(b.name)) notFound() // a host cannot compete with itself

  // Enforce one URL per pair regardless of the order typed in.
  const canonicalSlug = [slugify(a.name), slugify(b.name)].sort().join('-vs-')
  if (canonicalSlug !== slug) permanentRedirect(`/vs/${canonicalSlug}`)

  const sharedOk = [...targetBuckets(a)].some(bucket => targetBuckets(b).has(bucket))
  const kindA = providerKind(a), kindB = providerKind(b)
  const kindMismatch = kindA !== kindB
  const shared = sharedTargets(a, b)
  const uniqueA = splitTargets(a).filter(t => !shared.map(s => s.toLowerCase()).includes(t.toLowerCase().trim())).join(', ')
  const uniqueB = splitTargets(b).filter(t => !shared.map(s => s.toLowerCase()).includes(t.toLowerCase().trim())).join(', ')

  const rowsA = splitTargets(a).join(', ') || '—'
  const rowsB = splitTargets(b).join(', ') || '—'
  const langsA = [...new Set(a.locale.map((l) => getLanguageName(l)).filter(Boolean))].join(', ') || '—'
  const langsB = [...new Set(b.locale.map((l) => getLanguageName(l)).filter(Boolean))].join(', ') || '—'
  const locsA = extractLocations(a.info)
  const locsB = extractLocations(b.info)
  const ramA = ramDisplay(a), ramB = ramDisplay(b)
  const diskA = diskDisplay(a), diskB = diskDisplay(b)
  const votesA = (a.approvals || 0) + (a.disapprovals || 0)
  const votesB = (b.approvals || 0) + (b.disapprovals || 0)
  const pctA = pct(a), pctB = pct(b)
  const cpuA = a.cpu || 'Unknown', cpuB = b.cpu || 'Unknown'

  // Factual differences only — computed, never invented.
  const diffs: string[] = []
  const ramToMB = (h: Host) => h.ramMB ?? 0
  if (kindMismatch) diffs.push(`Provider type: ${a.name} is ${kindA} while ${b.name} is ${kindB} — they solve different problems (compute vs addresses), so RAM/CPU are not directly comparable.`)
  if (ramA !== 'Unknown' && ramB !== 'Unknown' && ramA !== ramB) {
    const aWins = ramToMB(a) >= ramToMB(b)
    diffs.push(`RAM: ${(aWins ? a : b).name} lists the larger allocation (${aWins ? ramA : ramB} vs ${aWins ? ramB : ramA}).`)
  } else if (ramA !== ramB) {
    diffs.push(`RAM: ${a.name} ${ramA} vs ${b.name} ${ramB} — one provider does not publish a concrete figure.`)
  }
  if (diskA !== 'Unknown' && diskB !== 'Unknown' && diskA !== diskB) {
    const dA = a.diskMB ?? 0
    const dB = b.diskMB ?? 0
    if (dA && dB) diffs.push(`Storage: ${(dA >= dB ? a : b).name} offers more (${dA >= dB ? diskA : diskB} vs ${dA >= dB ? diskB : diskA}).`)
  } else if (diskA !== diskB && (diskA === 'Unknown' || diskB === 'Unknown')) {
    diffs.push(`Storage: ${a.name} ${diskA} vs ${b.name} ${diskB} — incomplete disclosure on one side.`)
  }
  if (cpuA !== cpuB && cpuA !== 'Unknown' && cpuB !== 'Unknown') {
    diffs.push(`CPU: ${a.name} ${cpuA} vs ${b.name} ${cpuB}.`)
  }
  if (shared.length > 0 && (uniqueA || uniqueB)) {
    diffs.push(`Focus overlap: both cover ${shared.join(', ')}${uniqueA ? `; only ${a.name} adds ${uniqueA}` : ''}${uniqueB ? `; only ${b.name} adds ${uniqueB}` : ''}.`)
  } else if (shared.length === 0) {
    diffs.push(`No bucket overlap: ${a.name} [${rowsA}] vs ${b.name} [${rowsB}] — comparison is cross-category.`)
  }
  if (pctA !== null && pctB !== null && pctA !== pctB && Math.max(votesA, votesB) > 2) {
    const leader = pctA! > pctB! ? a : b
    const lpct = Math.max(pctA!, pctB!), lvotes = leader === a ? votesA : votesB
    diffs.push(`Community score: ${leader.name} currently rates higher (${lpct}% across ${lvotes} review${lvotes === 1 ? '' : 's'}).`)
  }
  if (a.status && b.status && a.status.toLowerCase() !== b.status.toLowerCase()) {
    diffs.push(`Status: ${a.name} is listed as ${a.status.toLowerCase()}, ${b.name} as ${b.status.toLowerCase()}.`)
  }
  if (a.free_plan && b.free_plan && a.free_plan !== b.free_plan) {
    diffs.push(`Free plan note: ${a.name} "${a.free_plan}" vs ${b.name} "${b.free_plan}".`)
  }

  // Table winners + pick advice, computed once (were single-use IIFEs).
  const ramWinner = ramA !== 'Unknown' && ramB !== 'Unknown' && (a.ramMB ?? 0) !== (b.ramMB ?? 0) ? ((a.ramMB ?? 0) > (b.ramMB ?? 0) ? 'a' : 'b') : null
  const diskWinner = diskA !== 'Unknown' && diskB !== 'Unknown' && (a.diskMB ?? 0) !== (b.diskMB ?? 0) ? ((a.diskMB ?? 0) > (b.diskMB ?? 0) ? 'a' : 'b') : null
  const voteWinner = pctA !== null && pctB !== null && pctA !== pctB && Math.max(votesA, votesB) > 2 ? (pctA! > pctB! ? 'a' : 'b') : null

  // Compute specs only mean something for compute providers. Two subdomain
  // (or domain) givers never have decidable RAM/storage — rendering "Tie /
  // No decidable difference" tiles for them is noise, so those tiles and
  // rows drop out entirely (kind mismatch keeps them for transparency, with
  // the notice above explaining they don't compare).
  const showComputeRows = kindA === 'hosting' || kindB === 'hosting'
  const decidableCount = [ramWinner, diskWinner, voteWinner].filter(Boolean).length

  const aTags = splitTargets(a).map(t => t.toLowerCase())
  const bTags = splitTargets(b).map(t => t.toLowerCase())
  const sharedRaw = aTags.find(t => bTags.includes(t) && BUCKET_PICK[t])
  const advice = (sharedRaw ? BUCKET_PICK[sharedRaw] : null)
    ?? BUCKET_PICK[sharedBucket(a, b)]
    ?? 'Compare what each provider publishes for its free plan — the table above carries the facts; community reviews carry the experience.'

  const pageSlug = [slugify(a.name), slugify(b.name)].sort().join('-vs-')

  // Verdict: tally the computed category wins. A tie (or no decidable
  // category) is an honest "too close to call", never a coin flip.
  const winsA = [ramWinner === 'a', diskWinner === 'a', voteWinner === 'a'].filter(Boolean).length
  const winsB = [ramWinner === 'b', diskWinner === 'b', voteWinner === 'b'].filter(Boolean).length
  const verdictWinner = kindMismatch ? null : winsA > winsB ? a : winsB > winsA ? b : null
  const verdictCats: string[] = []
  if (verdictWinner === a || verdictWinner === b) {
    const w = verdictWinner === a ? 'a' : 'b'
    if (ramWinner === w) verdictCats.push('more RAM')
    if (diskWinner === w) verdictCats.push('more storage')
    if (voteWinner === w) verdictCats.push('a higher community rating')
  }
  const kindNoun = kindA === 'subdomains' ? 'subdomain' : kindA === 'domains' ? 'domain' : kindA;
  const tieCopy = kindMismatch
    ? 'Different provider kinds solve different problems — pick by what you need (compute vs an address), not by these numbers.'
    : decidableCount === 0 && kindA !== 'hosting'
      ? `Neither side publishes compute specs — expected for ${kindNoun} providers, which hand out addresses rather than server resources. Judge them on what's actually on offer and on community reviews instead.`
      : 'Neither provider clearly beats the other on published specs. Let community reviews and a quick deploy test decide.'

  return (
    <CompareShell
      pageUrl={`${SITE_URL}/vs/${pageSlug}`}
      name={`${a.name} vs ${b.name}`}
      description={`Spec-level comparison of free hosting providers ${a.name} and ${b.name}.`}
      crumbs={[
        { name: 'Free Hosting Directory', path: '/hosts' },
        { name: `${a.name} vs ${b.name}`, path: `/vs/${pageSlug}` },
      ]}
      eyebrow="Head-to-head"
      heroStats={[
        { value: shared.length > 0 ? shared.slice(0, 2).join(', ') : kindA, label: shared.length > 0 ? 'shared focus' : 'provider kind' },
        { value: String(votesA + votesB), label: (votesA + votesB) === 1 ? 'community review' : 'community reviews' },
      ]}
      heroTitle={`${a.name} vs ${b.name}`}
      heroLead={
        kindMismatch
          ? `Heads up: ${a.name} (${kindA}) and ${b.name} (${kindB}) are different kinds of providers — specs below are not directly comparable.`
          : `Both are free ${kindA} providers${sharedOk ? ` sharing ${shared.join(', ') || 'a category'}` : ''}. Here is every published spec side by side — CPU, RAM, storage, status and community reviews.`
      }
      ctaTitle="Want more options?"
      ctaText={<>Both providers sit inside the full directory, alongside {all.length - 2} others.</>}
      ctaButtons={[
        { href: '/hosts', label: 'Browse all free hosts', primary: true },
        { href: `/alternatives/${slugify(a.name)}`, label: `More ${a.name} alternatives` },
      ]}
    >
      {verdictWinner ? (
        <section className="cmp-verdict" aria-labelledby="verdict-heading">
          <Trophy size={28} aria-hidden="true" className="cmp-verdict-icon" />
          <div>
            <h2 id="verdict-heading">Our pick: {verdictWinner.name}</h2>
            <p>
              {verdictWinner.name} wins on {verdictCats.join(', ')}.{
                ` Still, free tiers change fast — skim both profiles before committing.`
              }
            </p>
          </div>
          <Link href={`/hosts/${slugify(verdictWinner.name)}`} className="btn primary">View {verdictWinner.name}</Link>
        </section>
      ) : (
        <section className="cmp-verdict cmp-verdict--tie" aria-labelledby="verdict-heading">
          <Scale size={28} aria-hidden="true" className="cmp-verdict-icon" />
          <div>
            <h2 id="verdict-heading">Too close to call</h2>
            <p>{tieCopy}</p>
          </div>
        </section>
      )}

      {kindMismatch && (
        <section className="content-section cmp-notice" aria-labelledby="kinds-heading">
          <h2 id="kinds-heading">Different provider types</h2>
          <p className="host-about-summary">
            <strong>{a.name}</strong> is <code>{kindA}</code> and <strong>{b.name}</strong> is <code>{kindB}</code>.
            One hands out addresses (subdomains/domains) with no compute; the other runs workloads (RAM/CPU/storage).
            RAM, CPU and storage are not comparable across kinds — treat this page as a category check, not a spec shootout.
          </p>
        </section>
      )}

      {decidableCount > 0 && (
      <section className="content-section" aria-labelledby="scoreboard-heading">
        <h2 id="scoreboard-heading">Scoreboard</h2>
        <ul className="cmp-score-tiles">
          {ramWinner && (
          <li className="cmp-score-tile">
            <span className="cmp-score-label">RAM</span>
            <span className="cmp-score-value">{ramWinner === 'a' ? a.name : b.name}</span>
            <span className="cmp-score-sub">{ramWinner === 'a' ? ramA : ramB}</span>
          </li>
          )}
          {diskWinner && (
          <li className="cmp-score-tile">
            <span className="cmp-score-label">Storage</span>
            <span className="cmp-score-value">{diskWinner === 'a' ? a.name : b.name}</span>
            <span className="cmp-score-sub">{diskWinner === 'a' ? diskA : diskB}</span>
          </li>
          )}
          {voteWinner && (
          <li className="cmp-score-tile">
            <span className="cmp-score-label">Community</span>
            <span className="cmp-score-value">{voteWinner === 'a' ? a.name : b.name}</span>
            <span className="cmp-score-sub">
              {voteWinner === 'a' ? pctA : pctB}% across {voteWinner === 'a' ? votesA : votesB} review{(voteWinner === 'a' ? votesA : votesB) === 1 ? '' : 's'}
            </span>
          </li>
          )}
        </ul>
      </section>
      )}

      <section className="content-section" aria-labelledby="specs-heading">
        <h2 id="specs-heading">{a.name} vs {b.name}: spec comparison</h2>
        <p className="host-about-summary cmp-dim">
          Verified against each provider&apos;s published free plan · {a.name}: {specSummary(a) || 'no concrete specs'} · {b.name}: {specSummary(b) || 'no concrete specs'}
        </p>
        <div className="cmp-table-scroll" role="region" aria-label="Specification comparison table, scroll horizontally on small screens" tabIndex={0}>
        <table className="cmp-table cmp-table--vs">
          <caption className="sr-only">Side-by-side specifications of {a.name} and {b.name}</caption>
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">Feature</span></th>
              <th scope="col"><Link href={`/hosts/${slugify(a.name)}`}>{a.name}</Link>{ramWinner === 'a' || diskWinner === 'a' ? <span role="img" aria-label="Best value"> ★</span> : null}</th>
              <th scope="col"><Link href={`/hosts/${slugify(b.name)}`}>{b.name}</Link>{ramWinner === 'b' || diskWinner === 'b' ? <span role="img" aria-label="Best value"> ★</span> : null}</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Provider type</th><td><code>{kindA}</code></td><td><code>{kindB}</code></td></tr>
            <tr><th scope="row">Targets</th><td>{rowsA || '—'}{shared.length > 0 && <span className="cmp-shares">shares: {shared.join(', ')}</span>}</td><td>{rowsB || '—'}{shared.length > 0 && <span className="cmp-shares">shares: {shared.join(', ')}</span>}</td></tr>
            <tr><th scope="row">Languages</th><td>{langsA}</td><td>{langsB}</td></tr>
            {(locsA.length > 0 || locsB.length > 0) && <tr><th scope="row">Server locations</th><td>{locsA.length > 0 ? locsA.join(', ') : '—'}</td><td>{locsB.length > 0 ? locsB.join(', ') : '—'}</td></tr>}
            {showComputeRows && (<>
            <tr><th scope="row">CPU</th><td>{cpuA}</td><td>{cpuB}</td></tr>
            <tr><th scope="row">RAM</th><td className={ramWinner === 'a' ? 'cmp-cell--win' : undefined}>{ramA}{ramWinner === 'a' && <span role="img" aria-label="Higher value"> ✓</span>}</td><td className={ramWinner === 'b' ? 'cmp-cell--win' : undefined}>{ramB}{ramWinner === 'b' && <span role="img" aria-label="Higher value"> ✓</span>}</td></tr>
            <tr><th scope="row">Storage</th><td className={diskWinner === 'a' ? 'cmp-cell--win' : undefined}>{diskA}{diskWinner === 'a' && <span role="img" aria-label="Higher value"> ✓</span>}</td><td className={diskWinner === 'b' ? 'cmp-cell--win' : undefined}>{diskB}{diskWinner === 'b' && <span role="img" aria-label="Higher value"> ✓</span>}</td></tr>
            </>)}
            {(a.free_plan || b.free_plan) && <tr><th scope="row">Free plan</th><td className="cmp-prewrap">{a.free_plan || '—'}</td><td className="cmp-prewrap">{b.free_plan || '—'}</td></tr>}
            <tr><th scope="row">Status</th><td><span className={`status-badge ${(a.status?.toLowerCase().replace(/[^a-z0-9-]+/g, '-') || 'unknown')}`}>{a.status}</span></td><td><span className={`status-badge ${(b.status?.toLowerCase().replace(/[^a-z0-9-]+/g, '-') || 'unknown')}`}>{b.status}</span></td></tr>
            <tr>
              <th scope="row">Community</th>
              <td className={voteWinner === 'a' ? 'cmp-cell--win' : undefined}>{pctA !== null ? `${pctA}% of ${votesA} review${votesA === 1 ? '' : 's'}` : 'No reviews yet'}{voteWinner === 'a' && <span role="img" aria-label="Best value"> ★</span>}</td>
              <td className={voteWinner === 'b' ? 'cmp-cell--win' : undefined}>{pctB !== null ? `${pctB}% of ${votesB} review${votesB === 1 ? '' : 's'}` : 'No reviews yet'}{voteWinner === 'b' && <span role="img" aria-label="Best value"> ★</span>}</td>
            </tr>
            <tr>
              <th scope="row">Listed since</th>
              <td>{a.created_at ? new Date(a.created_at).getFullYear() : '—'}</td>
              <td>{b.created_at ? new Date(b.created_at).getFullYear() : '—'}</td>
            </tr>
          </tbody>
        </table>
        </div>
        <p className="host-about-summary cmp-dim">
          Sources: provider plan pages at listing time; <Link href="/methodology">how we verify</Link>. No invented specs — “Unknown” means the provider does not publish a concrete figure.
        </p>
      </section>

      <section className="content-section" aria-labelledby="diffs-heading">
        <h2 id="diffs-heading">Key differences</h2>
        {diffs.length > 0 ? (
          <ul className="host-check-list">
            {diffs.map(d => <li key={d}>{d}</li>)}
          </ul>
        ) : (
          <p className="host-about-summary">
            Their published specs are closely matched — for these two, the practical differences will come down to
            idle policies, supported languages and community feedback rather than headline numbers.
          </p>
        )}
      </section>

      <section className="content-section" aria-labelledby="pick-heading">
        <h2 id="pick-heading">Which should you pick?</h2>
        <p className="host-about-summary">{advice}</p>
        <ul className="host-check-list">
          <li>Read each provider&apos;s own plan page before committing — free tiers change without notice.</li>
          <li>Check community review scores on both profiles ({a.name}: {pctA ?? 'n/a'}%, {b.name}: {pctB ?? 'n/a'}%) and skim recent feedback in our Discord.</li>
          <li>Deploy something small to both if you can — real-world latency and panel comfort beat any spec sheet.</li>
        </ul>
      </section>
    </CompareShell>
  )
}
