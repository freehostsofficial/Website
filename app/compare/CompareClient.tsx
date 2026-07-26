'use client';

import Link from 'next/link';
import { GitCompare, Trash2, ArrowLeft, Star, CheckCircle2, XCircle } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { ROWS, findBestIndex, computeRating } from '../../lib/comparisonRows';
import { slugify } from '../../lib/slugify';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSize(mb?: number): string {
  if (!mb) return 'Unknown';
  if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
  return Math.round(mb) + ' MB';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompareClient() {
  const { selection, removeHost, clearAll } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();

  // ── Empty state ──────────────────────────────────────────────────────────
  if (selection.length < 2) {
    return (
      <main id="main-content">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center space-y-6">
            <GitCompare size={48} className="mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Compare Hosts</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Browse the host directory and click the <GitCompare size={14} className="inline" /> compare button on any host card to add it here.
              {selection.length === 1 && (
                <> You have <strong>1 host</strong> selected — add one more to start comparing.</>
              )}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/hosts">
                <Button>Browse Hosts</Button>
              </Link>
              {selection.length === 1 && (
                <Badge variant="secondary">1 of 2 hosts selected</Badge>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Pre-compute best-value indices ───────────────────────────────────────
  const bestIndices: Record<string, number> = {};
  for (const row of ROWS) {
    if (row.getNumeric) {
      const values = selection.map(row.getNumeric);
      bestIndices[row.label] = findBestIndex(values);
    }
  }

  // ── Per-host derived data ────────────────────────────────────────────────
  const hostData = selection.map((host) => {
    const totalReviews = (host.approvals || 0) + (host.disapprovals || 0);
    const ratingPct = totalReviews > 0
      ? Math.round(((host.approvals || 0) / totalReviews) * 100)
      : null;
    const ramDisplay = host.ramMB ? formatSize(host.ramMB) : host.ram || 'Unknown';
    const storageDisplay = host.diskMB ? formatSize(host.diskMB) : host.disk || 'Unknown';
    const statusOnline = host.status?.toLowerCase() === 'online';
    return { host, totalReviews, ratingPct, ramDisplay, storageDisplay, statusOnline };
  });

  // Best rating index
  const ratingValues = hostData.map(({ host }) => computeRating(host));
  const bestRatingIdx = findBestIndex(ratingValues);

  return (
    <main id="main-content">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">

        {/* ── Toolbar ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Compare Hosts</h1>
            <p className="text-sm text-muted-foreground">
              Comparing {selection.length} hosts side by side
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/hosts">
              <Button variant="outline" size="sm">
                <ArrowLeft size={14} /> Back to Hosts
              </Button>
            </Link>
            <Link href="/hosts">
              <Button variant="outline" size="sm">
                <GitCompare size={14} /> Add / Swap
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={clearAll}>
              <Trash2 size={14} /> Clear All
            </Button>
          </div>
        </div>

        {/* ── Host header cards ─────────────────────────────────────── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selection.length}, 1fr)` }}>
          {hostData.map(({ host, ratingPct, totalReviews, statusOnline }, idx) => (
            <Card key={host.id} className={bestRatingIdx === idx && totalReviews > 0 ? 'ring-2 ring-accent' : ''}>
              <CardContent className="p-4 space-y-3">
                {bestRatingIdx === idx && totalReviews > 0 && (
                  <Badge variant="default" className="w-fit">Top Rated</Badge>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
                    {host.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{host.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {statusOnline
                        ? <><CheckCircle2 size={12} className="text-accent" /> Online</>
                        : <><XCircle size={12} className="text-destructive" /> {host.status || 'Unknown'}</>
                      }
                    </div>
                  </div>
                </div>
                {host.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{host.description}</p>
                )}
                {ratingPct !== null && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${ratingPct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{ratingPct}% ({totalReviews})</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Link href={`/hosts/${slugify(host.name)}`}>
                    <Button variant="outline" size="xs">View Details</Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => toggleFavorite(host.id)}
                    aria-pressed={isFavorite(host.id)}
                    className={isFavorite(host.id) ? 'text-yellow-500' : ''}
                  >
                    <Star size={14} fill={isFavorite(host.id) ? 'currentColor' : 'none'} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeHost(host.id)}
                    className="text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Comparison table ───────────────────────────────────────── */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Feature</TableHead>
                {selection.map(host => (
                  <TableHead key={host.id} className="text-center">{host.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium text-sm">{row.label}</TableCell>
                  {selection.map((host, colIdx) => {
                    const isBest = row.getNumeric !== undefined && bestIndices[row.label] === colIdx;
                    return (
                      <TableCell key={host.id} className={`text-center text-sm ${isBest ? 'bg-accent/5 font-semibold' : ''}`}>
                        {isBest && <span className="text-accent mr-1">★</span>}
                        {row.getValue(host)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>
    </main>
  );
}
