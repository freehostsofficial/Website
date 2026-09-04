import { fetchHosts } from '../../lib/hosts'
import HostsClient from './HostsClient'
import Breadcrumbs from '@/components/Breadcrumbs'
import { slugify } from '../../lib/slugify'
import { safeJsonLd } from "../../lib/safeJsonLd";
import { pageMeta, webPageJsonLd } from "../../lib/pageMeta";

// ISR: directory listing regenerates at most every 30 min (must be a
// literal; keep in sync with HOSTS_REVALIDATE_SECONDS in lib/hosts.ts).
export const revalidate = 1800;

const DESCRIPTION = 'Browse 100+ free hosting providers for websites, Discord bots, and apps. Filter by CPU, RAM, storage, language, and target. Find the best free host for your project.';
const SOCIAL_DESCRIPTION = 'Browse 100+ free hosting providers for websites, Discord bots, and apps. Filter by CPU, RAM, storage, language, and target.';

export const metadata = pageMeta({
  path: '/hosts',
  title: 'Free Hosting Directory - Browse 100+ Providers',
  description: DESCRIPTION,
  ogTitle: 'Free Hosting Directory - Browse 100+ Providers | FreeHosts',
  ogDescription: SOCIAL_DESCRIPTION,
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
  imageAlt: 'FreeHosts — Free Hosting Directory',
  twitterImageAlt: 'FreeHosts — Free Hosting Directory',
})

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
    url: process.env.APP_URL + '/hosts',
    numberOfItems: hosts.length,
    itemListElement: hosts.slice(0, 50).map((host, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${process.env.APP_URL}/hosts/${slugify(host.name)}`,
      name: host.name,
    })),
  }

  const webPageSchema = webPageJsonLd(
    '/hosts',
    'Free Hosting Directory | FreeHosts',
    'Browse and compare free hosting providers for websites, bots, and apps.',
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }}
      />
      <Breadcrumbs siteUrl={process.env.APP_URL} items={[{ name: 'Free Hosting Directory', path: '/hosts' }]} />
      <HostsClient initialHosts={hosts} />
    </>
  )
}
