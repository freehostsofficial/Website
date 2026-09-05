'use client';

import Link from '@/components/SiteLink';
import { GitCompare, Trash2, ArrowLeft, Star, CheckCircle2, XCircle } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { ROWS, findBestIndex, computeRating } from '../../lib/comparisonRows';
import { hasPublishedSpecs } from '../../lib/taxonomy';
import { slugify } from '../../lib/slugify';
import { ramDisplay, diskDisplay } from '../../lib/specs';
import { useFavorites } from '../../contexts/FavoritesContext';
import { PageHero, EmptyState } from '@/components/PageHero';

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompareClient() {
  const { selection, removeHost, clearAll } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();

  // ── Empty state ──────────────────────────────────────────────────────────
  if (selection.length < 2) {
    return (
      <main id="main-content">
        <div id="compare-page">
          <div className="wrap">
            <PageHero
              title="Compare Hosts"
              titleId="compare-hero-title"
              heroClass="compare-hero"
              lead="Pick any two (or more) hosts and see every spec side by side."
            />
            <EmptyState
              icon={<GitCompare size={48} aria-hidden="true" />}
              title="No hosts selected yet"
              actions={
                <>
                  <Link href="/hosts" className="btn primary">
                    Browse Hosts
                  </Link>
                  {selection.length === 1 && (
                    <span className="compare-empty-hint">1 of 2 hosts selected</span>
                  )}
                </>
              }
            >
              <ol className="cmp-steps">
                <li>Browse the <Link href="/hosts">host directory</Link>.</li>
                <li>Click the compare button on any host card{selection.length === 1 ? ' (one more to go — you have 1 selected)' : ''}.</li>
                <li>Come back here for the full side-by-side table.</li>
              </ol>
            </EmptyState>
          </div>
        </div>
      </main>
    );
  }

  // ── Per-host derived data (single pass) ──────────────────────────────────
  const hostData = selection.map((host) => {
    const ratingValue = computeRating(host);
    return {
      host,
      totalReviews: (host.approvals || 0) + (host.disapprovals || 0),
      ratingPct: ratingValue < 0 ? null : Math.round(ratingValue),
      ratingValue,
      ramValue: ramDisplay(host),
      storageValue: diskDisplay(host),
      statusOnline: host.status?.toLowerCase() === 'online',
    };
  });

  // ── Best-value indices ───────────────────────────────────────────────────
  // CPU/RAM/Storage rows only make sense when at least one compared host
  // publishes specs — otherwise they'd be an all-Unknown wall (common for
  // subdomain providers, which never have compute numbers).
  const showSpecRows = selection.some((h) => hasPublishedSpecs(h));
  const visibleRows = showSpecRows
    ? ROWS
    : ROWS.filter((row) => row.label !== 'CPU' && row.label !== 'RAM' && row.label !== 'Storage');
  const bestIndices: Record<string, number> = {};
  for (const row of visibleRows) {
    if (row.getNumeric) {
      const values = selection.map(row.getNumeric);
      bestIndices[row.label] = findBestIndex(values);
    }
  }
  const bestRatingIdx = findBestIndex(hostData.map((h) => h.ratingValue));
  const topRated = bestRatingIdx >= 0 && hostData[bestRatingIdx].totalReviews > 0
    ? hostData[bestRatingIdx]
    : null;

  return (
    <main id="main-content">
      <div id="compare-page">
        <div className="wrap">

          <PageHero
            title="Compare Hosts"
            titleId="compare-hero-title"
            heroClass="compare-hero"
            lead={
              <>
                Comparing{' '}
                <strong style={{ color: 'var(--text)' }}>
                  {selection.length} hosts
                </strong>{' '}
                side by side.
              </>
            }
          />

          {topRated && (
            <p className="cmp-verdict cmp-verdict--slim" role="status">
              <Star size={18} aria-hidden="true" fill="currentColor" />
              <span><strong>{topRated.host.name}</strong> leads on community rating ({topRated.ratingPct}% across {topRated.totalReviews} review{topRated.totalReviews === 1 ? '' : 's'}).</span>
            </p>
          )}

          {/* ── Toolbar ───────────────────────────────────────────────── */}
          <div className="compare-toolbar">
            <Link href="/hosts" className="compare-back-link">
              <ArrowLeft size={14} aria-hidden="true" />
              Back to Hosts
            </Link>
            <div className="compare-toolbar-right">
              <Link href="/hosts" className="compare-add-more-btn">
                <GitCompare size={13} aria-hidden="true" />
                Add / Swap Hosts
              </Link>
              <button
                type="button"
                className="compare-clear-all-btn"
                onClick={clearAll}
              >
                <Trash2 size={13} aria-hidden="true" />
                Clear All
              </button>
            </div>
          </div>

          {/* ── Comparison table ──────────────────────────────────────── */}
          <div className="cmp-table-scroll" role="region" aria-label="Host comparison table, scroll horizontally on small screens" tabIndex={0}>
            <table className="cmp-table cmp-table--compare">
              <caption className="sr-only">
                Side-by-side comparison of {selection.map((h) => h.name).join(', ')}
              </caption>
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Feature</span></th>
                  {hostData.map(({ host, ratingPct, totalReviews, statusOnline }, idx) => {
                    const fav = isFavorite(host.id);
                    return (
                      <th
                        key={host.id}
                        scope="col"
                        className={`cmp-col-head${bestRatingIdx === idx && totalReviews > 0 ? ' cmp-col-head--best' : ''}`}
                      >
                        {bestRatingIdx === idx && totalReviews > 0 && (
                          <span className="compare-best-label">Top Rated</span>
                        )}
                        <span className="compare-host-card-icon" aria-hidden="true">
                          {host.name.charAt(0).toUpperCase()}
                        </span>
                        <Link
                          href={`/hosts/${slugify(host.name)}`}
                          className="compare-host-card-name"
                        >
                          {host.name}
                        </Link>
                        <span className="compare-host-card-status">
                          {statusOnline
                            ? <><CheckCircle2 size={12} aria-hidden="true" className="compare-status-online" /> Online</>
                            : <><XCircle size={12} aria-hidden="true" className="compare-status-offline" /> {host.status || 'Unknown'}</>
                          }
                        </span>
                        {ratingPct !== null && (
                          <span className="compare-host-card-rating">
                            <span
                              className="compare-rating-bar"
                              role="progressbar"
                              aria-valuenow={ratingPct}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${host.name}: ${ratingPct}% approval`}
                            >
                              <span
                                className="compare-rating-fill"
                                style={{ width: `${ratingPct}%` }}
                                aria-hidden="true"
                              />
                            </span>
                            <span className="compare-rating-text">
                              {ratingPct}% <span className="compare-rating-sub">({totalReviews})</span>
                            </span>
                          </span>
                        )}
                        <span className="compare-host-card-actions">
                          <button
                            type="button"
                            className={`compare-fav-btn${fav ? ' active' : ''}`}
                            onClick={() => toggleFavorite(host.id)}
                            aria-pressed={fav}
                            aria-label={fav ? `Remove ${host.name} from favorites` : `Save ${host.name}`}
                          >
                            <Star
                              size={14}
                              aria-hidden="true"
                              fill={fav ? 'currentColor' : 'none'}
                            />
                          </button>
                          <button
                            type="button"
                            className="compare-remove-host-btn"
                            onClick={() => removeHost(host.id)}
                            aria-label={`Remove ${host.name} from comparison`}
                          >
                            Remove
                          </button>
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {selection.map((host, colIdx) => {
                      const isBest =
                        row.getNumeric !== undefined &&
                        bestIndices[row.label] === colIdx;
                      return (
                        <td key={host.id} className={isBest ? 'cmp-cell--win' : undefined}>
                          {isBest && (
                            <span className="compare-cell-star" role="img" aria-label="Best value">★ </span>
                          )}
                          {row.getValue(host)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="host-about-summary cmp-dim">
            ★ marks the best published value in each row. “Unknown” means the provider doesn&apos;t publish a concrete figure — not a zero.
          </p>

        </div>
      </div>
    </main>
  );
}
