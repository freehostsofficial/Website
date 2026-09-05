'use client';

import Link from '@/components/SiteLink';
import { type Host } from '../../lib/hosts';
import { GitCompare, Star } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useComparison } from '../../contexts/ComparisonContext';
import { useMounted } from '../../hooks/useMounted';
import { useRouter } from 'next/navigation';
import HostCard from '@/components/HostCard';
import { PageHero, EmptyState } from '@/components/PageHero';

function SavedHero({ lead }: { lead: React.ReactNode }) {
  return <PageHero title="Saved Hosts" titleId="saved-hero-title" lead={lead} heroClass="saved-hero" />;
}

export default function SavedClient({ allHosts }: { allHosts: Host[] }) {
  const { favorites } = useFavorites();
  const { addHost } = useComparison();
  const router = useRouter();
  // Suppress rendering until after hydration so we don't flash the empty
  // state while the cookie-based favorites are being loaded client-side.
  const hasMounted = useMounted();

  // Derive saved hosts by filtering allHosts to those whose id is in favorites.
  // IDs not found in allHosts are silently omitted (requirement 2.8).
  const savedHosts = allHosts.filter(host => favorites.includes(host.id));

  // Send the first few saved hosts to the comparison tray (which caps at 4
  // and toasts when full), then jump to the side-by-side table.
  function compareSaved() {
    for (const host of savedHosts.slice(0, 4)) addHost(host);
    router.push('/compare');
  }

  // While hydrating, render the hero + a subtle skeleton so layout doesn't jump
  if (!hasMounted) {
    return (
      <main id="main-content">
        <div id="saved-page">
          <div className="wrap">
            <SavedHero lead="Your favorited hosting providers, all in one place." />
            {/* Invisible placeholder — prevents layout shift */}
            <div className="saved-loading-placeholder" aria-hidden="true" />
          </div>
        </div>
      </main>
    );
  }

  if (savedHosts.length === 0) {
    return (
      <main id="main-content">
        <div id="saved-page">
          <div className="wrap">
            <SavedHero lead="Your favorited hosting providers, all in one place." />
            <EmptyState icon={<Star size={48} aria-hidden="true" />} title="No saved hosts yet">
              <ol className="cmp-steps">
                <li>Browse the <Link href="/hosts">host directory</Link>.</li>
                <li>Click the star on any host card to save it here.</li>
                <li>Come back to revisit, compare, and pick your host.</li>
              </ol>
            </EmptyState>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <div id="saved-page">
        <div className="wrap">
          <SavedHero
            lead={
              savedHosts.length === 1
                ? 'You have 1 saved host.'
                : `You have ${savedHosts.length} saved hosts.`
            }
          />

          <div className="compare-toolbar" role="group" aria-label="Saved hosts actions">
            <p className="cmp-count" role="status">
              {savedHosts.length} saved
            </p>
            <div className="compare-toolbar-right">
              {savedHosts.length >= 2 && (
                <button
                  type="button"
                  className="compare-add-more-btn"
                  onClick={compareSaved}
                >
                  <GitCompare size={13} aria-hidden="true" />
                  Compare these
                </button>
              )}
              <Link href="/hosts" className="compare-back-link">
                Browse Hosts
              </Link>
            </div>
          </div>

          {/* Hosts Grid */}
          <ul className="hosts-grid cmp-card-grid">
            {savedHosts.map(host => (
              <li key={host.id}>
                <HostCard host={host} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
