'use client';

import Link from '@/components/SiteLink';
import { GitCompare, Trash2, ArrowLeft, Star, CheckCircle2, XCircle } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { ROWS, findBestIndex, computeRating } from '../../lib/comparisonRows';
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
              lead="Select at least two hosts to compare them side by side."
            />
            <EmptyState
              icon={<GitCompare size={48} />}
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
              Browse the host directory and click the{' '}
              <GitCompare
                size={14}
                aria-hidden="true"
                style={{ display: 'inline', verticalAlign: 'middle' }}
              />{' '}
              compare button on any host card to add it here.
              {selection.length === 1 && (
                <>
                  {' '}You have <strong>1 host</strong> selected — add one more to start comparing.
                </>
              )}
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
  const bestIndices: Record<string, number> = {};
  for (const row of ROWS) {
    if (row.getNumeric) {
      const values = selection.map(row.getNumeric);
      bestIndices[row.label] = findBestIndex(values);
    }
  }
  const bestRatingIdx = findBestIndex(hostData.map((h) => h.ratingValue));

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

          {/* ── Host header cards ─────────────────────────────────────── */}
          <div
            className="compare-host-cards"
            style={{
              gridTemplateColumns: `200px repeat(${selection.length}, minmax(280px, 1fr))`
            }}
          >
            {/* Empty top-left corner */}
            <div className="compare-corner-cell" />

            {hostData.map(({ host, ratingPct, totalReviews, statusOnline }, idx) => (
              <div
                key={host.id}
                className={`compare-host-card${bestRatingIdx === idx ? ' compare-host-card--best' : ''}`}
              >
                {bestRatingIdx === idx && totalReviews > 0 && (
                  <div className="compare-best-label">Top Rated</div>
                )}
                <div className="compare-host-card-icon" aria-hidden="true">
                  {host.name.charAt(0).toUpperCase()}
                </div>
                <div className="compare-host-card-name">{host.name}</div>
                {host.description && (
                  <p className="compare-host-card-desc">{host.description}</p>
                )}
                <div className="compare-host-card-status">
                  {statusOnline
                    ? <><CheckCircle2 size={12} aria-hidden="true" className="compare-status-online" /> Online</>
                    : <><XCircle size={12} aria-hidden="true" className="compare-status-offline" /> {host.status || 'Unknown'}</>
                  }
                </div>
                {ratingPct !== null && (
                  <div className="compare-host-card-rating">
                    <div className="compare-rating-bar">
                      <div
                        className="compare-rating-fill"
                        style={{ width: `${ratingPct}%` }}
                        aria-label={`${ratingPct}% approval`}
                      />
                    </div>
                    <span className="compare-rating-text">
                      {ratingPct}% <span className="compare-rating-sub">({totalReviews} reviews)</span>
                    </span>
                  </div>
                )}
                <div className="compare-host-card-actions">
                  <Link
                    href={`/hosts/${slugify(host.name)}`}
                    className="compare-view-btn"
                  >
                    View Details
                  </Link>
                  <button
                    type="button"
                    className={`compare-fav-btn${isFavorite(host.id) ? ' active' : ''}`}
                    onClick={() => toggleFavorite(host.id)}
                    aria-pressed={isFavorite(host.id)}
                    aria-label={isFavorite(host.id) ? `Remove ${host.name} from favorites` : `Save ${host.name}`}
                  >
                    <Star
                      size={14}
                      aria-hidden="true"
                      fill={isFavorite(host.id) ? 'currentColor' : 'none'}
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
                </div>
              </div>
            ))}
          </div>

          {/* ── Comparison rows ───────────────────────────────────────── */}
          <div className="compare-rows-section">
            {ROWS.map((row, rowIdx) => (
              <div
                key={row.label}
                className={`compare-row${rowIdx % 2 === 0 ? ' compare-row--alt' : ''}`}
                style={{
                  gridTemplateColumns: `200px repeat(${selection.length}, minmax(280px, 1fr))`
                }}
              >
                <div className="compare-row-label">{row.label}</div>
                {selection.map((host, colIdx) => {
                  const isBest =
                    row.getNumeric !== undefined &&
                    bestIndices[row.label] === colIdx;
                  return (
                    <div
                      key={host.id}
                      className={`compare-row-cell${isBest ? ' compare-row-cell--best' : ''}`}
                    >
                      {isBest && (
                        <span className="compare-cell-star" aria-label="Best value">★</span>
                      )}
                      <span className="compare-cell-value">{row.getValue(host)}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
