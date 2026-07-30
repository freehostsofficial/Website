"use client";

import { useEffect, useMemo, useState } from "react";
import { type Host } from "../../lib/cache";
import Link from "next/link";
import { ArrowDownAZ, Clock, Star, Sparkles, Compass, Bookmark } from "lucide-react";
import { useFavorites } from "../../contexts/FavoritesContext";
import { HostCard } from "@/components/primitives/HostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/TiltCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface SavedClientProps {
  allHosts: Host[];
}

type SortMode = "recent" | "name";

export default function SavedClient({ allHosts }: SavedClientProps) {
  const { favorites } = useFavorites();
  const [hasMounted, setHasMounted] = useState(false);
  const [sort, setSort] = useState<SortMode>("recent");
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const savedHosts = useMemo(() => {
    const filtered = allHosts.filter((host) => favorites.includes(host.id));
    if (sort === "name") {
      return [...filtered].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return filtered;
  }, [allHosts, favorites, sort]);

  const heroSubtitle = !hasMounted
    ? "Your favorited hosting providers, all in one place."
    : savedHosts.length === 0
      ? "Your favorited hosting providers, all in one place."
      : savedHosts.length === 1
        ? "You have 1 saved host."
        : `You have ${savedHosts.length} saved hosts.`;

  return (
    <main>
      <section className="relative overflow-hidden noise-overlay border-b border-border">
        <div className="dot-grid relative">
          <div className="pointer-events-none absolute -top-40 left-1/4 size-96 opacity-20 blob-morph" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-80 opacity-15 blob-morph" style={{ animationDelay: "4s" }} />
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
            <div className="flex flex-col items-center gap-3 text-center reveal">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Bookmark className="size-7" />
              </div>
              <h1>Saved Hosts</h1>
              <p className="max-w-2xl text-muted-foreground body-large">
                {heroSubtitle}
              </p>
              {hasMounted && savedHosts.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AnimatedCounter to={savedHosts.length} suffix=" saved" className="font-semibold text-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          {savedHosts.length > 0 && (
            <div className="mb-6 flex items-center justify-between reveal">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={sort === "recent" ? "default" : "outline"}
                  className="gap-1.5"
                  onClick={() => setSort("recent")}
                >
                  <Clock className="size-3.5" />
                  Recently Saved
                </Button>
                <Button
                  size="sm"
                  variant={sort === "name" ? "default" : "outline"}
                  className="gap-1.5"
                  onClick={() => setSort("name")}
                >
                  <ArrowDownAZ className="size-3.5" />
                  Name (A-Z)
                </Button>
              </div>
            </div>
          )}

          {!hasMounted ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-56 skeleton-shimmer rounded-xl border border-border bg-card" />
              ))}
            </div>
          ) : savedHosts.length === 0 ? (
            <SpotlightCard className="mx-auto flex max-w-md flex-col items-center gap-4 p-10 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Star className="size-7" />
              </div>
              <h2 className="text-lg">No saved hosts yet</h2>
              <p className="text-sm text-muted-foreground">
                Browse the hosting directory and click the{" "}
                <Star className="inline size-3.5 align-middle" /> star icon on any host card
                to save it here.
              </p>
              <Button asChild className="transition-all duration-200 hover:scale-105 active:scale-95">
                <Link href="/hosts">Browse Hosts</Link>
              </Button>
            </SpotlightCard>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {savedHosts.map((host) => (
                <div key={host.id} className="h-full">
                  <TiltCard maxTilt={6} glare={false} className="h-full">
                    <HostCard host={host} />
                  </TiltCard>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
