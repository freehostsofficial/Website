"use client";

import Link from "next/link";
import { GitCompare, Trash2, ArrowLeft, Star, CheckCircle2, XCircle, Sparkles, Crosshair, Compass, Share2 } from "lucide-react";
import { useComparison } from "../../contexts/ComparisonContext";
import { ROWS, findBestIndex, computeRating } from "../../lib/comparisonRows";
import { slugify } from "../../lib/slugify";
import { useFavorites } from "../../contexts/FavoritesContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/TiltCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function formatSize(mb?: number): string {
  if (!mb) return "Unknown";
  if (mb >= 1024) return (mb / 1024).toFixed(1) + " GB";
  return Math.round(mb) + " MB";
}

export default function CompareClient() {
  const { selection, removeHost, clearAll } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();

  // ── Empty state ──────────────────────────────────────────────────────────
  if (selection.length < 2) {
    return (
      <main className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6">
        <div className="reveal">
          <h1>Compare Hosts</h1>
          <p className="mt-2 text-muted-foreground">
            Select at least two hosts to compare them side by side.
          </p>
        </div>

          <SpotlightCard className="mx-auto mt-10 max-w-md p-10">
          <div className="flex flex-col items-center gap-4">
          <GitCompare className="size-10 text-muted-foreground" />
          <h2 className="text-lg">No hosts selected yet</h2>
          <p className="text-sm text-muted-foreground">
            Browse the host directory and click the compare button on any host
            card to add it here.
            {selection.length === 1 && (
              <>
                {" "}
                You have <strong className="text-foreground">1 host</strong> selected —
                add one more to start comparing.
              </>
            )}
          </p>
          <Button asChild>
            <Link href="/hosts">Browse Hosts</Link>
          </Button>
          {selection.length === 1 && (
            <span className="text-xs text-muted-foreground">1 of 2 hosts selected</span>
          )}
        </div>
          </SpotlightCard>
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
    const ratingPct =
      totalReviews > 0 ? Math.round(((host.approvals || 0) / totalReviews) * 100) : null;
    const statusOnline = host.status?.toLowerCase() === "online";
    return { host, totalReviews, ratingPct, statusOnline };
  });

  const ratingValues = hostData.map(({ host }) => computeRating(host));
  const bestRatingIdx = findBestIndex(ratingValues);

  return (
    <main>
      <section className="relative overflow-hidden noise-overlay border-b border-border">
        <div className="dot-grid relative">
          <div className="pointer-events-none absolute -top-40 left-1/4 size-96 opacity-20 blob-morph" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-80 opacity-15 blob-morph" style={{ animationDelay: "4s" }} />
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
            <div className="flex flex-col items-center gap-3 text-center reveal">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Compass className="size-7" />
              </div>
              <h1>Compare Hosts</h1>
              <p className="max-w-2xl text-muted-foreground body-large">
                Add hosting providers to compare their features side by side.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="flex items-center justify-between reveal">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Link href="/hosts">
                <ArrowLeft className="size-4" />
                Back to Hosts
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href="/hosts">
                  <GitCompare className="size-3.5" />
                  Add / Swap Hosts
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={clearAll}>
                <Trash2 className="size-3.5" />
                Clear All
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied!"))}>
                <Share2 className="size-3.5" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Host header cards — shown on every breakpoint ──────────────── */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className={cn(
          "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 stagger-children",
          selection.length === 2 && "md:grid-cols-2",
          selection.length === 3 && "md:grid-cols-3",
          selection.length === 4 && "md:grid-cols-4",
        )}>
          {hostData.map(({ host, ratingPct, totalReviews, statusOnline }, idx) => (
            <div key={host.id} className="h-full">
              <TiltCard maxTilt={6} glare={false} className="h-full">
                <Card className={cn(
                  "relative gap-3 py-5 h-full card-hover card-glow transition-all duration-300",
                  bestRatingIdx === idx && "border-accent/40"
                )}>
                  <CardContent className="flex flex-col items-center gap-2 text-center">
                    {bestRatingIdx === idx && totalReviews > 0 && (
                      <Badge variant="success" className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        Top Rated
                      </Badge>
                    )}
                    <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-lg font-semibold">
                      {host.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-medium">{host.name}</div>
                    {host.description && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">{host.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-xs">
                      {statusOnline ? (
                        <>
                          <CheckCircle2 className="size-3.5 text-accent" />
                          Online
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3.5 text-destructive" />
                          {host.status || "Unknown"}
                        </>
                      )}
                    </div>
                    {ratingPct !== null && (
                      <div className="w-full">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${ratingPct}%` }}
                            aria-label={`${ratingPct}% approval`}
                          />
                        </div>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {ratingPct}% ({totalReviews} reviews)
                        </span>
                      </div>
                    )}
                    <div className="mt-2 flex w-full flex-col gap-1.5">
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/hosts/${slugify(host.name)}`}>View Details</Link>
                      </Button>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1.5"
                          onClick={() => toggleFavorite(host.id)}
                          aria-pressed={isFavorite(host.id)}
                          aria-label={isFavorite(host.id) ? `Remove ${host.name} from favorites` : `Save ${host.name}`}
                        >
                          <Star className="size-3.5" fill={isFavorite(host.id) ? "currentColor" : "none"} />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-destructive hover:text-destructive"
                          onClick={() => removeHost(host.id)}
                          aria-label={`Remove ${host.name} from comparison`}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>

      {/* ── Comparison rows: real table ≥ md, stacked cards below ───────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 reveal">
          <div className="hidden overflow-hidden rounded-lg border border-border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-card">Spec</TableHead>
                  {selection.map((host) => (
                    <TableHead key={host.id}>{host.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
                <TableBody>
                {ROWS.map((row, rowIdx) => (
                  <TableRow key={row.label} className={cn("card-hover", rowIdx % 2 === 1 && "bg-secondary/20")}>
                    <TableCell className="sticky left-0 bg-card font-medium text-foreground">
                      {row.label}
                    </TableCell>
                    {selection.map((host, colIdx) => {
                      const isBest = row.getNumeric !== undefined && bestIndices[row.label] === colIdx;
                      return (
                        <TableCell key={host.id} className={cn(isBest && "text-accent")}>
                          <span className={cn("flex items-center gap-1.5", isBest && "animate-pulse")}>
                            {isBest && <Star className="size-3.5 fill-current" />}
                            {row.getValue(host)}
                          </span>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

        {/* Mobile fallback: one card per host, spec rows stacked as key/value */}
        <div className="mt-8 flex flex-col gap-4 md:hidden reveal reveal-delay-1 stagger-children">
          {selection.map((host, colIdx) => (
            <Card key={host.id}>
              <CardContent className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">{host.name}</h3>
                <dl className="divide-y divide-border">
                  {ROWS.map((row) => {
                    const isBest = row.getNumeric !== undefined && bestIndices[row.label] === colIdx;
                    return (
                      <div key={row.label} className="flex items-center justify-between gap-3 py-2 text-sm">
                        <dt className="text-muted-foreground">{row.label}</dt>
                        <dd className={cn("flex items-center gap-1.5 text-right", isBest && "text-accent")}>
                          {isBest && <Star className="size-3.5 fill-current" />}
                          {row.getValue(host)}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </main>
  );
}
