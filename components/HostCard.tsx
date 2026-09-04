'use client';

import Link from 'next/link';
import { type Host } from '../lib/hosts';
import { slugify } from '../lib/slugify';
import { getLanguageName } from '../lib/getLanguageName';
import { ramDisplay, diskDisplay } from '../lib/specs';
import { extractDomainNames } from '../lib/domains';
import { computeRating } from '../lib/comparisonRows';
import { useComparison } from '../contexts/ComparisonContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { GitCompare, Star, Cpu, MemoryStick, HardDrive, ArrowRight, Link as LinkIcon } from 'lucide-react';

// Shared host card (was a ~108-line verbatim copy in HostsClient +
// SavedClient). Inline SVGs were lucide path data pasted by hand —
// the real lucide components render identically.

// ─── Domain extensions section (hosts listing only) ──────────────────────────

function DomainSection({ host }: { host: Host }) {
  const isDomainHost = host.targets?.some(t => t.toLowerCase().includes('domain'));
  if (isDomainHost) {
    const all = extractDomainNames(`${host.info || ''}\n${host.description || ''}\n${host.free_plan || ''}`);
    const domains = all.slice(0, 10);
    if (domains.length > 0) {
      return (
        <div className="host-domains">
          <div className="host-domains-label">
            <LinkIcon size={12} aria-hidden="true" />
            Extensions:
          </div>
          <div className="host-domains-list">
            {domains.map(domain => (
              <span key={domain} className="domain-badge">
                {domain.replace(/^[-\s•*]+/, '')}
              </span>
            ))}
          </div>
          {all.length > 10 && (
            <div className="host-domains-more">
              + {all.length - 10} more available
            </div>
          )}
        </div>
      );
    }
  }

  if (host.targets?.some(t => t.toLowerCase().includes('subdomain'))) {
    const domains = extractDomainNames(host.free_plan || '').slice(0, 10);
    if (domains.length > 0) {
      return (
        <div className="host-domains">
          <div className="host-domains-label">
            <LinkIcon size={12} aria-hidden="true" />
            Extensions:
          </div>
          <div className="host-domains-list">
            {domains.map(domain => (
              <span key={domain} className="domain-badge">
                {domain}
              </span>
            ))}
          </div>
        </div>
      );
    }
  }

  return <SpecCards host={host} />;
}

// ─── Spec cards ───────────────────────────────────────────────────────────────

function SpecCards({ host }: { host: Host }) {
  return (
    <div className="host-specs">
      <div className="host-spec-card">
        <div className="host-spec-icon">
          <Cpu size={18} aria-hidden="true" />
        </div>
        <div className="spec-copy">
          <div className="spec-box-value">{host.cpu || 'Unknown'}</div>
          <div className="spec-box-label">CPU</div>
        </div>
      </div>
      <div className="host-spec-card">
        <div className="host-spec-icon">
          <MemoryStick size={18} aria-hidden="true" />
        </div>
        <div className="spec-copy">
          <div className="spec-box-value">{ramDisplay(host)}</div>
          <div className="spec-box-label">Memory</div>
        </div>
      </div>
      <div className="host-spec-card">
        <div className="host-spec-icon">
          <HardDrive size={18} aria-hidden="true" />
        </div>
        <div className="spec-copy">
          <div className="spec-box-value">{diskDisplay(host)}</div>
          <div className="spec-box-label">Storage</div>
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export default function HostCard({ host, isNew = false, showDomains = false }: { host: Host; isNew?: boolean; showDomains?: boolean }) {
  const { isSelected, addHost, removeHost, isFull } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();
  const totalReviews = (host.approvals || 0) + (host.disapprovals || 0);
  const rating = Math.max(0, Math.round(computeRating(host)));
  const iconLetter = host.name ? host.name.charAt(0).toUpperCase() : '?';
  const statusClass = host.status && host.status.toLowerCase() === 'online' ? 'online' : 'closed';
  const typeDisplay = host.type ? host.type.split(',').map(t => t.trim().replace(/\s*\([^)]*\)/g, '').trim()) : [];

  return (
    <div className="host-card">
      {isNew && <div className="host-badge">NEW</div>}

      {/* Top: icon + name/badges */}
      <div className="host-card-top">
        <div className="host-icon">{iconLetter}</div>
        <div className="host-name-group">
          <div className="host-name">{host.name}</div>
          <div className="badges-container">
            <span className={`status-badge ${statusClass}`}>{host.status || 'Unknown'}</span>
            {typeDisplay.map(type => (
              <span key={type} className="host-type-badge">{type}</span>
            ))}
            {(host.locale || []).map(locale => (
              <span key={locale} className="language-badge">{getLanguageName(locale)}</span>
            ))}
            {(host.targets || []).flatMap(target =>
              target.split(',').map(t => {
                const d = t.trim();
                return d ? <span key={d} className="target-badge">{d}</span> : null;
              }).filter(Boolean)
            )}
          </div>
          {host.description && (
            <p className="host-description">{host.description}</p>
          )}
        </div>
      </div>

      {showDomains ? <DomainSection host={host} /> : <SpecCards host={host} />}

      {/* Footer: rating + actions */}
      <div className="host-card-footer">
        <div className="host-rating">
          <div className="rating-value">{rating}%</div>
          <div className="rating-label">{totalReviews} reviews</div>
          <div className="rating-bar">
            <div className="rating-fill" style={{ width: `${rating}%` }} />
          </div>
        </div>
        <div className="host-card-actions">
          <button
            className={`compare-btn icon-btn${isSelected(host.id) ? ' active' : ''}`}
            onClick={() => isSelected(host.id) ? removeHost(host.id) : addHost(host)}
            disabled={isFull && !isSelected(host.id)}
            aria-pressed={isSelected(host.id)}
            aria-label={isSelected(host.id) ? `Remove ${host.name} from comparison` : `Add ${host.name} to comparison`}
            type="button"
          >
            <GitCompare size={14} aria-hidden="true" />
          </button>
          <button
            className={`favorite-btn icon-btn${isFavorite(host.id) ? ' active' : ''}`}
            onClick={() => toggleFavorite(host.id)}
            aria-pressed={isFavorite(host.id)}
            aria-label={isFavorite(host.id) ? `Remove ${host.name} from favorites` : `Add ${host.name} to favorites`}
            type="button"
          >
            <Star size={14} aria-hidden="true" fill={isFavorite(host.id) ? 'currentColor' : 'none'} />
          </button>
          <Link href={`/hosts/${slugify(host.name)}`} className="view-details-btn">
            View Details
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
