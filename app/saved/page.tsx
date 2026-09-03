import { fetchHosts } from '../../lib/hosts'
import SavedClient from './SavedClient'
import Breadcrumbs from '@/components/Breadcrumbs'

export const runtime = 'edge';

export const metadata = {
  title: 'Saved Hosts',
  description: 'View all your favorited free hosting providers in one place. Quickly revisit and compare the hosts you care about.',
  robots: { index: false, follow: false },
}

export default async function SavedPage() {
  const allHosts = await fetchHosts()

  return (
    <>
      <Breadcrumbs siteUrl={process.env.APP_URL} items={[{ name: 'Saved Hosts', path: '/saved' }]} />
      <SavedClient allHosts={allHosts} />
    </>
  )
}
