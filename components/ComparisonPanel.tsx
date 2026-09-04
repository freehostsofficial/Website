'use client';

import Link from '@/components/SiteLink';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';

// ─── Component ────────────────────────────────────────────────────────────────

export default function ComparisonPanel() {
  const { selection, removeHost, clearAll } = useComparison();

  // Show a "tray" even with 1 host selected so the user knows they can add more
  if (selection.length === 0) {
    return null;
  }

  const canCompare = selection.length >= 2;

  return (
    <div
      className="comparison-panel"
      role="region"
      aria-label="Host comparison tray"
    >
      <div className="comparison-panel-header">
        <div className="comparison-panel-left">
          <GitCompare size={15} aria-hidden="true" className="comparison-panel-icon" />
          <span className="comparison-panel-title">
            {canCompare
              ? `Comparing ${selection.length} hosts`
              : 'Add 1 more host to compare'}
          </span>
        </div>
        <div className="comparison-panel-actions">
          {canCompare && (
            <Link href="/compare" className="comparison-go-btn">
              Compare now
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          )}
          <button
            className="comparison-clear-btn"
            onClick={clearAll}
            type="button"
            aria-label="Clear all hosts from comparison"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Host chips */}
      <div className="comparison-chips-row">
        {selection.map((host) => (
          <div key={host.id} className="comparison-chip">
            <span className="comparison-chip-icon" aria-hidden="true">
              {host.name.charAt(0).toUpperCase()}
            </span>
            <span className="comparison-chip-name">{host.name}</span>
            <button
              type="button"
              className="comparison-chip-remove"
              onClick={() => removeHost(host.id)}
              aria-label={`Remove ${host.name} from comparison`}
            >
              <X size={11} aria-hidden="true" />
            </button>
          </div>
        ))}
        {/* Empty slot indicators */}
        {selection.length < 4 && Array.from({ length: Math.min(1, 4 - selection.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="comparison-chip comparison-chip--empty">
            <span className="comparison-chip-icon comparison-chip-icon--empty" aria-hidden="true">+</span>
            <span className="comparison-chip-name comparison-chip-name--empty">Add a host</span>
          </div>
        ))}
      </div>
    </div>
  );
}
