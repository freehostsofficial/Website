import { redirect, notFound } from 'next/navigation'
import { fetchHostById, fetchHostBySlug, type Host } from '../../../lib/cache'
import { slugify } from '../../../lib/slugify'
import HostDetailClient from '../../../components/HostDetailClient'
export const runtime = 'edge';

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  if (/^\d+$/.test(slug)) return { title: 'Host Not Found | FreeHosts', description: 'The host you are looking for does not exist or has been removed.', robots: { index: false, follow: false } }
  const host = await fetchHostBySlug(slug)
  if (!host) return { title: 'Host Not Found | FreeHosts', description: 'The host you are looking for does not exist or has been removed.', robots: { index: false, follow: false } }
  const specs: string[] = []
  if (host.cpu && host.cpu !== 'Unknown') specs.push(host.cpu)
  if (host.ram && host.ram !== 'Unknown') specs.push(host.ram)
  if (host.disk && host.disk !== 'Unknown') specs.push(host.disk)
  const specsText = specs.length > 0 ? `Specs: CPU ${host.cpu || 'N/A'}, RAM ${host.ram || 'N/A'}, Storage ${host.disk || 'N/A'}.` : 'Find great features for your next project.'
  const typeText = host.type && host.type.toLowerCase().includes('trusted') ? 'Trusted & Free' : host.type || 'Free'
  let description = `Learn about ${host.name}, a ${typeText.toLowerCase()} hosting provider. ${specsText} Read user reviews and compare options on FreeHosts.`
  if (description.length > 160) description = description.substring(0, 157) + '...'
  const totalReviews = (host.approvals || 0) + (host.disapprovals || 0)
  const rating = totalReviews > 0 ? Math.round(((host.approvals || 0) / totalReviews) * 100) : 0
  
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://freehosts.space').replace(/\/$/, '')
  const hostUrl = `${site}/hosts/${slugify(host.name)}`
  
  // Construct dynamic OG image URL
  const ogImageUrl = `${site}/hosts/og/${slug}`

  const title = `${host.name} - Free Hosting Provider Details | FreeHosts`
  const keywords = [host.name, 'free hosting', 'free hosts', ...(host.targets ?? [])].filter(Boolean)
  
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
      type: 'website', 
      locale: 'en_US', 
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${host.name} — Free hosting provider on FreeHosts` }] 
    },
    twitter: { 
      card: 'summary_large_image', 
      title, 
      description, 
      images: [{ url: ogImageUrl, alt: `${host.name} — Free hosting provider on FreeHosts` }], 
      site: '@freehosts_', 
      creator: '@freehosts_' 
    }
  }
}

export default async function HostDetailPage({ params }: Props) {
  const { slug } = await params
  if (/^\d+$/.test(slug)) {
    const host: Host | null = await fetchHostById(Number(slug))
    if (!host) notFound()
    redirect(`/hosts/${slugify(host.name)}`)
  }
  const host: Host | null = await fetchHostBySlug(slug)
  if (!host) notFound()
  const specs: string[] = []
  if (host.cpu && host.cpu !== 'Unknown') specs.push(host.cpu)
  if (host.ram && host.ram !== 'Unknown') specs.push(host.ram)
  if (host.disk && host.disk !== 'Unknown') specs.push(host.disk)
  const specsText = specs.length > 0 ? `Specs: CPU ${host.cpu || 'N/A'}, RAM ${host.ram || 'N/A'}, Storage ${host.disk || 'N/A'}.` : 'Find great features for your next project.'
  const typeText = host.type && host.type.toLowerCase().includes('trusted') ? 'Trusted & Free' : host.type || 'Free'
  let description = `Learn about ${host.name}, a ${typeText.toLowerCase()} hosting provider. ${specsText} Read user reviews and compare options on FreeHosts.`
  if (description.length > 160) description = description.substring(0, 157) + '...'
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://freehosts.space').replace(/\/$/, '')
  const hostUrl = `${site}/hosts/${slugify(host.name)}`
  const totalReviews = host.approvals + host.disapprovals
  const ratingValue = totalReviews > 0 ? ((host.approvals / totalReviews) * 5).toFixed(1) : null
  const title = `${host.name} - Free Hosting Provider Details | FreeHosts`
  const jsonLd = { "@context": "https://schema.org", "@type": "WebPage", "@id": `${hostUrl}#webpage`, "url": hostUrl, "name": title, "isPartOf": { "@id": "https://freehosts.space/#website" }, "inLanguage": "en", "description": description }
  const serviceLd = {
    "@context": "https://schema.org", "@type": "Service", "name": host.name, "description": description, "url": hostUrl, "serviceType": "Web Hosting", "category": host.targets?.join(', ') || 'Web Hosting',
    "provider": { "@type": "Organization", "name": host.name, ...(host.links?.[0] ? { "url": host.links[0] } : {}) },
    ...(host.image ? { "image": host.image } : {}),
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": host.status?.toLowerCase() === "online" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", "url": hostUrl, "description": `Free ${host.targets?.join(', ') || 'hosting'} — ${host.cpu || 'Unknown'} CPU, ${host.ram || 'Unknown'} RAM, ${host.disk || 'Unknown'} storage` },
    ...(ratingValue ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingValue, "bestRating": "5", "worstRating": "1", "ratingCount": totalReviews, "reviewCount": totalReviews } } : {}),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <HostDetailClient host={host} />
    </>
  )
}
