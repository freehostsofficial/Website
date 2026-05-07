import { fetchHosts } from '../../lib/cache'
import HostsClient from './HostsClient'
import { slugify } from '../../lib/slugify'

export const runtime = 'edge';
export const metadata = {
  title: 'Free Hosting Directory - Browse 100+ Providers | FreeHosts',
  description: 'Browse 100+ free hosting providers for websites, Discord bots, and apps. Filter by CPU, RAM, storage, language, and target. Find the best free host for your project.',
  keywords: [
    'free hosting directory',
    'free web hosting',
    'free bot hosting',
    'free discord bot hosting',
    'free app hosting',
    'free server hosting',
    'hosting comparison',
    'best free hosting',
    'no cost hosting providers',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: 'https://freehosts.space/hosts',
  },
  openGraph: {
    locale: 'en_US',
    siteName: 'FreeHosts',
    type: 'website',
    url: 'https://freehosts.space/hosts',
    title: 'Free Hosting Directory - Browse 100+ Providers | FreeHosts',
    description: 'Browse 100+ free hosting providers for websites, Discord bots, and apps. Filter by CPU, RAM, storage, language, and target.',
    images: [
      {
        url: 'https://freehosts.space/Src/Images/banner.png',
        width: 1280,
        height: 720,
        alt: 'FreeHosts — Free Hosting Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Hosting Directory - Browse 100+ Providers | FreeHosts',
    description: 'Browse 100+ free hosting providers for websites, Discord bots, and apps. Filter by CPU, RAM, storage, language, and target.',
    images: [
      {
        url: 'https://freehosts.space/Src/Images/banner.png',
        alt: 'FreeHosts — Free Hosting Directory',
      },
    ],
    site: '@freehosts_',
    creator: '@freehosts_',
  },
}

export const viewport = {
  themeColor: '#071028',
};

export default async function HostsPage() {
  const hosts = await fetchHosts()

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free Hosting Directory',
    description: 'A curated directory of free hosting providers for websites, bots, and apps.',
    url: 'https://freehosts.space/hosts',
    numberOfItems: hosts.length,
    itemListElement: hosts.slice(0, 50).map((host, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://freehosts.space/hosts/${slugify(host.name)}`,
      name: host.name,
    })),
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://freehosts.space/hosts#webpage',
    url: 'https://freehosts.space/hosts',
    name: 'Free Hosting Directory | FreeHosts',
    isPartOf: { '@id': 'https://freehosts.space/#website' },
    inLanguage: 'en',
    description: 'Browse and compare free hosting providers for websites, bots, and apps.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <HostsClient initialHosts={hosts} />
    </>
  )
}
