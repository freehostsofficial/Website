'use client';

import { useEffect, useState } from 'react';
import { type Host } from '../../lib/hosts';
import { Star } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import HostCard from '@/components/HostCard';
import { PageHero, EmptyState } from '@/components/PageHero';

function SavedHero({ lead }: { lead: React.ReactNode }) {
  return <PageHero title="Saved Hosts" titleId="saved-hero-title" lead={lead} heroClass="saved-hero" />;
}

export default function SavedClient({ allHosts }: { allHosts: Host[] }) {
  const { favorites } = useFavorites();
  // Suppress rendering until after hydration so we don't flash the empty
  // state while the cookie-based favorites are being loaded client-side.
  const [hasMounted, setHasMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setHasMounted(true); }, []);

  // Derive saved hosts by filtering allHosts to those whose id is in favorites.
  // IDs not found in allHosts are silently omitted (requirement 2.8).
  const savedHosts = allHosts.filter(host => favorites.includes(host.id));

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
            <EmptyState icon={<Star size={48} />} title="No saved hosts yet">
              Browse the hosting directory and click the{' '}
              <Star size={14} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
              star icon on any host card to save it here.
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

          {/* Hosts Grid */}
          <div className="hosts-grid">
            {savedHosts.map(host => (
              <HostCard key={host.id} host={host} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
