'use client';

import { useEffect, useState } from 'react';
import { type Host } from '../../lib/cache';
import Link from '@/components/NoPrefetchLink';
import { slugify } from '../../lib/slugify';
import { getLanguageName } from '../../lib/getLanguageName';
import { GitCompare, Star } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function formatSize(mb?: number): string {
  if (!mb) return 'Unknown';
  if (mb >= 1024) return (mb / 1024).toFixed(1) + 'GB';
  return Math.round(mb) + 'MB';
}

interface HostCardProps {
  host: Host;
}

function HostCard({ host }: HostCardProps) {
  const { isSelected, addHost, removeHost, isFull } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();

  const ramDisplay = host.ramMB ? formatSize(host.ramMB) : host.ram || 'Unknown';
  const storageDisplay = host.diskMB ? formatSize(host.diskMB) : host.disk || 'Unknown';
  const totalReviews = (host.approvals || 0) + (host.disapprovals || 0);
  const rating = totalReviews > 0 ? Math.round(((host.approvals || 0) / totalReviews) * 100) : 0;
  const iconLetter = host.name ? host.name.charAt(0).toUpperCase() : '?';
  const isOnline = host.status && host.status.toLowerCase() === 'online';
  const typeDisplay = host.type ? host.type.split(',').map(t => t.trim().replace(/\s*\([^)]*\)/g, '').trim()) : [];

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
            {iconLetter}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm truncate">{host.name}</div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <Badge variant={isOnline ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                {host.status || 'Unknown'}
              </Badge>
              {typeDisplay.map(type => (
                <Badge key={type} variant="outline" className="text-[10px] px-1.5 py-0">{type}</Badge>
              ))}
              {(host.locale || []).map(locale => (
                <Badge key={locale} variant="secondary" className="text-[10px] px-1.5 py-0">{getLanguageName(locale)}</Badge>
              ))}
              {(host.targets || []).flatMap(target =>
                target.split(',').map(t => {
                  const d = t.trim();
                  return d ? <Badge key={d} variant="outline" className="text-[10px] px-1.5 py-0">{d}</Badge> : null;
                }).filter(Boolean)
              )}
            </div>
            {host.description && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{host.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-muted-foreground shrink-0"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M9 2v2M2 15h2M2 9h2M15 20v2M9 20v2M20 15h2M20 9h2"/></svg>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">{host.cpu || 'Unknown'}</div>
              <div className="text-[10px] text-muted-foreground">CPU</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-muted-foreground shrink-0"><path d="M6 19v-3"/><path d="M10 19v-3"/><path d="M14 19v-3"/><path d="M18 19v-3"/><path d="M8 11V9"/><path d="M16 11V9"/><path d="M12 11V9"/><path d="M2 15h20"/><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z"/></svg>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">{ramDisplay}</div>
              <div className="text-[10px] text-muted-foreground">Memory</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-muted-foreground shrink-0"><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">{storageDisplay}</div>
              <div className="text-[10px] text-muted-foreground">Storage</div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 border-t border-border px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold">{rating}%</span>
          <span className="text-[11px] text-muted-foreground">{totalReviews} reviews</span>
          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-accent" style={{ width: `${rating}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => isSelected(host.id) ? removeHost(host.id) : addHost(host)}
            disabled={isFull && !isSelected(host.id)}
            aria-pressed={isSelected(host.id)}
            aria-label={isSelected(host.id) ? `Remove ${host.name} from comparison` : `Add ${host.name} to comparison`}
            data-active={isSelected(host.id) ? '' : undefined}
            className="data-[active]:text-accent"
          >
            <GitCompare size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => toggleFavorite(host.id)}
            aria-pressed={isFavorite(host.id)}
            aria-label={isFavorite(host.id) ? `Remove ${host.name} from favorites` : `Add ${host.name} to favorites`}
            data-active={isFavorite(host.id) ? '' : undefined}
            className="data-[active]:text-yellow-500"
          >
            <Star size={14} fill={isFavorite(host.id) ? 'currentColor' : 'none'} />
          </Button>
          <Link href={`/hosts/${slugify(host.name)}`}>
            <Button variant="outline" size="xs">
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

interface SavedClientProps {
  allHosts: Host[];
}

export default function SavedClient({ allHosts }: SavedClientProps) {
  const { favorites } = useFavorites();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);

  const savedHosts = allHosts.filter(host => favorites.includes(host.id));

  if (!hasMounted) {
    return (
      <main id="main-content">
        <div id="saved-page" className="wrap py-12">
          <section className="text-center mb-8" aria-labelledby="saved-hero-title">
            <h1 id="saved-hero-title" className="text-3xl font-bold">Saved Hosts</h1>
            <p className="text-muted-foreground mt-2">Your favorited hosting providers, all in one place.</p>
          </section>
        </div>
      </main>
    );
  }

  if (savedHosts.length === 0) {
    return (
      <main id="main-content">
        <div id="saved-page" className="wrap py-12">
          <section className="text-center mb-8" aria-labelledby="saved-hero-title">
            <h1 id="saved-hero-title" className="text-3xl font-bold">Saved Hosts</h1>
            <p className="text-muted-foreground mt-2">Your favorited hosting providers, all in one place.</p>
          </section>

          <Card className="mx-auto max-w-md text-center p-8">
            <CardContent className="space-y-4">
              <div className="flex justify-center text-muted-foreground">
                <Star size={48} />
              </div>
              <h2 className="text-xl font-semibold">No saved hosts yet</h2>
              <p className="text-sm text-muted-foreground">
                Browse the hosting directory and click the star icon on any host card to save it here.
              </p>
              <Link href="/hosts">
                <Button>Browse Hosts</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <div id="saved-page" className="wrap py-12">
        <section className="text-center mb-8" aria-labelledby="saved-hero-title">
          <h1 id="saved-hero-title" className="text-3xl font-bold">Saved Hosts</h1>
          <p className="text-muted-foreground mt-2">
            {savedHosts.length === 1
              ? 'You have 1 saved host.'
              : `You have ${savedHosts.length} saved hosts.`}
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedHosts.map(host => (
            <HostCard key={host.id} host={host} />
          ))}
        </div>
      </div>
    </main>
  );
}
