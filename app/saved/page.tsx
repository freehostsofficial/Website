import type { Metadata } from 'next'
import { fetchHosts } from '../../lib/hosts'
import SavedClient from './SavedClient'
import Breadcrumbs from '@/components/Breadcrumbs'
import { SITE_URL } from '../../lib/site'
import { pageMeta } from '../../lib/pageMeta'

// Personalized page: prerendered as a static shell (same HTML for everyone),
// per-user favorites filtering happens client-side in SavedClient from
// cookies — so the edge may cache it like /hosts (see next.config.ts).

// The shell embeds the host list via fetchHosts(), whose own cache lifetime
// governs how soon new hosts appear here.
export const metadata: Metadata = pageMeta({
  path: '/saved',
  title: 'Saved Hosts',
  description: 'View all your favorited free hosting providers in one place. Quickly revisit and compare the hosts you care about.',
  imageAlt: 'FreeHosts - Saved Hosts',
  twitterImageAlt: 'FreeHosts - Saved Hosts',
  index: false,
})

export default async function SavedPage() {
  const allHosts = await fetchHosts()

  return (
    <>
      <Breadcrumbs siteUrl={SITE_URL} items={[{ name: 'Saved Hosts', path: '/saved' }]} />
      <SavedClient allHosts={allHosts} />
    </>
  )
}
