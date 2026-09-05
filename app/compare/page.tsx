import type { Viewport } from 'next'
import CompareClient from './CompareClient'
import Breadcrumbs from '@/components/Breadcrumbs'
import { safeJsonLd } from '../../lib/safeJsonLd'
import { pageMeta, webPageJsonLd } from '../../lib/pageMeta'
import { SITE_URL } from '../../lib/site'

const DESCRIPTION =
  'Compare free hosting providers side by side: CPU, RAM, storage, supported languages, and community ratings in one table to find the best free host for your project.';
const SOCIAL_DESCRIPTION =
  'Compare free hosting providers side by side: CPU, RAM, storage, supported languages, and community ratings in one table.';

export const metadata = pageMeta({
  path: '/compare',
  title: 'Compare Free Hosting Providers Side by Side',
  description: DESCRIPTION,
  ogTitle: 'Compare Free Hosting Providers Side by Side | FreeHosts',
  ogDescription: SOCIAL_DESCRIPTION,
  keywords: [
    'compare free hosting',
    'free hosting comparison',
    'free hosting comparison table',
    'best free hosting',
  ],
  imageAlt: 'FreeHosts - Compare Free Hosting Providers',
  twitterImageAlt: 'FreeHosts - Compare Free Hosting Providers',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#071028',
};

export default function ComparePage() {
  const webPageSchema = webPageJsonLd(
    '/compare',
    'Compare Free Hosting Providers Side by Side',
    'Compare free hosting providers side by side on CPU, RAM, storage, languages, and community ratings.',
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(webPageSchema),
        }}
      />
      <Breadcrumbs siteUrl={SITE_URL} items={[{ name: 'Compare Hosts', path: '/compare' }]} />
      <CompareClient />
    </>
  )
}
