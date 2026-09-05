import { redirect, notFound } from 'next/navigation'
import { Suspense } from 'react'
import { fetchHosts, hostOgVersion, type Host } from '../../../lib/hosts'
import { slugify } from '../../../lib/slugify'
import { specSummary } from '../../../lib/specs'
import { findAlternatives, providerKind, primaryTargetLabel, targetBuckets } from '../../../lib/taxonomy'
import HostDetailClient from '../../../components/HostDetailClient'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { safeJsonLd } from "../../../lib/safeJsonLd";
import { SITE_URL } from "../../../lib/site";
// Prerender all known hosts at build; data freshness comes from
// fetchHosts()' cache lifetime. Hosts added after the build render on demand.
export async function generateStaticParams() {
  const hosts = await fetchHosts();
  const params = hosts.filter((h) => h.name).map((h) => ({ slug: slugify(h.name) }));
  // Must return ≥1 param under Cache Components; a never-matching sentinel
  // keeps the build green when the API is unreachable (renders notFound()).
  return params.length > 0 ? params : [{ slug: '__unlisted__' }];
}

type Props = { params: Promise<{ slug: string }> }

// Shared by generateMetadata + the page body (was copy-pasted ~25 lines:
// summary/kind/targetLabel/specsText/description/site/hostUrl/title).
function getHostSeo(host: Host) {
  const summary = specSummary(host)
  const kind = providerKind(host)
  const targetLabel = primaryTargetLabel(host)
  const specsText = summary
    ? `Specs: ${summary}.`
    : kind === 'hosting'
      ? 'Plan limits are not published publicly.'
      : `Provides free ${kind}.`
  const isTrusted = host.type && host.type.toLowerCase().includes('trusted')

  // Target-specific description: more useful than the generic "hosting provider" for every host
  let description = isTrusted
    ? `${host.name} is a trusted & free ${targetLabel} provider. ${specsText} Read community reviews and compare on FreeHosts.`
    : `${host.name} is a free ${targetLabel} provider. ${specsText} Read community reviews and compare on FreeHosts.`
  if (description.length > 160) description = description.substring(0, 157) + '...'

  const site = SITE_URL
  const hostUrl = `${site}/hosts/${slugify(host.name)}`

  // Target-aware title: "RRHosting — Free Web Hosting & Coding Host" instead of generic
  const title = `${host.name} — Free ${targetLabel.charAt(0).toUpperCase() + targetLabel.slice(1)}`

  return { kind, targetLabel, description, site, hostUrl, title }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  if (/^\d+$/.test(slug)) return { title: 'Host Not Found', description: 'The host you are looking for does not exist or has been removed.', robots: { index: false, follow: false } }
  const host = (await fetchHosts()).find(h => slugify(h.name) === slug) ?? null
  if (!host) return { title: 'Host Not Found', description: 'The host you are looking for does not exist or has been removed.', robots: { index: false, follow: false } }
  const { targetLabel, description, site, hostUrl, title } = getHostSeo(host)

  // Construct dynamic OG image URL (content-hashed: immutable per version).
  const ogImageUrl = `${site}/hosts/og/${slug}?v=${hostOgVersion(host)}`

  // Rich keywords: host name + target-specific terms derived from actual targets
  const targetKeywords = (host.targets ?? []).flatMap(t =>
    t.split(',').map(s => s.trim()).filter(Boolean)
  )
  const keywords = [
    host.name,
    `free ${targetLabel}`,
    'free hosting',
    'free hosts',
    ...targetKeywords,
  ].filter(Boolean)

  return {
    title, description,
    alternates: { canonical: hostUrl },
    keywords,
    authors: [{ name: 'FreeHosts', url: site }],
    metadataBase: new URL(site),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" as const, "max-snippet": -1 } },
    openGraph: {
      title,
      description,
      url: hostUrl,
      siteName: 'FreeHosts',
      type: 'article',
      locale: 'en_US',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${host.name} — Free ${targetLabel} on FreeHosts` }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: ogImageUrl, alt: `${host.name} — Free ${targetLabel} on FreeHosts` }],
      site: '@freehosts_',
      creator: '@freehosts_'
    }
  }
}

export default function HostDetailPage({ params }: Props) {
  // Params resolve at request time for hosts added after the build — await
  // them inside Suspense so the static shell still prerenders.
  return (
    <Suspense fallback={null}>
      <HostDetailBody params={params} />
    </Suspense>
  );
}

async function HostDetailBody({ params }: Props) {
  const { slug } = await params
  // One full-list fetch per render (wrappers removed — on Cloudflare each
  // call is a real upstream request, so derive everything from one list).
  const allHosts = await fetchHosts()
  if (/^\d+$/.test(slug)) {
    const host: Host | null = allHosts.find(h => h.id === Number(slug)) ?? null
    if (!host) notFound()
    redirect(`/hosts/${slugify(host.name)}`)
  }
  const host: Host | null = allHosts.find(h => slugify(h.name) === slug) ?? null
  if (!host) notFound()
  const { targetLabel, description, site, hostUrl, title } = getHostSeo(host)
  const totalReviews = host.approvals + host.disapprovals
  const ratingValue = totalReviews > 0 ? ((host.approvals / totalReviews) * 5).toFixed(1) : null
  // Votes are Discord thumbs, not written reviews — require at least 3 votes
  // before emitting aggregateRating so Google never sees a 1-vote rich result.
  const showRating = ratingValue !== null && totalReviews >= 3
  const jsonLd = { "@context": "https://schema.org", "@type": "WebPage", "@id": `${hostUrl}#webpage`, "url": hostUrl, "name": title, "isPartOf": { "@id": `${site}/#website` }, "inLanguage": "en", "description": description, ...(host.created_at ? { "dateModified": new Date(host.created_at).toISOString().split('T')[0] } : {}) }
  const serviceLd = {
    "@context": "https://schema.org", "@type": "Service", "name": host.name, "description": description, "url": hostUrl,
    "serviceType": `Free ${targetLabel.charAt(0).toUpperCase() + targetLabel.slice(1)}`,
    "category": host.targets?.join(', ') || 'Web Hosting',
    "provider": { "@type": "Organization", "name": host.name, ...(host.links?.[0] ? { "url": host.links[0] } : {}) },
    ...(host.image ? { "image": host.image } : {}),
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": host.status?.toLowerCase() === "online" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", "url": hostUrl, "description": `Free ${targetLabel}${specSummary(host) ? ` — ${specSummary(host)}` : ''}` },
    ...(showRating ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingValue, "bestRating": "5", "worstRating": "1", "ratingCount": totalReviews, "reviewCount": totalReviews } } : {}),
  }
  const hostBuckets = targetBuckets(host);
  const related = allHosts
    .filter(h => {
      if (h.id === host.id) return false;
      for (const b of targetBuckets(h)) if (hostBuckets.has(b)) return true;
      return false;
    })
    // Use a seed-based sort for stable variety between different hosts
    .sort((a, b) => {
      const seed = host.id;
      const valA = (a.id * seed) % 100;
      const valB = (b.id * seed) % 100;
      return valA - valB;
    })
    .slice(0, 4)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceLd) }} />
      <Breadcrumbs
        siteUrl={site}
        items={[
          { name: 'Free Hosting Directory', path: '/hosts' },
          { name: host.name, path: `/hosts/${slugify(host.name)}` },
        ]}
      />
      <HostDetailClient host={host} related={related} alternativesCount={findAlternatives(host, allHosts).length} />
    </>
  )
}

