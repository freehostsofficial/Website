"use client";

import { useEffect, useState } from "react";
import { type Host } from "../../lib/cache";
import Link from "@/components/NoPrefetchLink";
import { Star, Sparkles, Compass, Bookmark } from "lucide-react";
import { useFavorites } from "../../contexts/FavoritesContext";
import { HostCard } from "@/components/primitives/HostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/TiltCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

interface SavedClientProps {
  allHosts: Host[];
}

export default function SavedClient({ allHosts }: SavedClientProps) {
  const { favorites } = useFavorites();
  const [hasMounted, setHasMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const savedHosts = allHosts.filter((host) => favorites.includes(host.id));

  const heroSubtitle = !hasMounted
    ? "Your favorited hosting providers, all in one place."
    : savedHosts.length === 0
      ? "Your favorited hosting providers, all in one place."
      : savedHosts.length === 1
        ? "You have 1 saved host."
        : `You have ${savedHosts.length} saved hosts.`;

  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center gap-3 text-center reveal">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Bookmark className="size-6" />
            </div>
            <h1>Saved Hosts</h1>
            <p className="max-w-2xl text-muted-foreground body-large">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          {!hasMounted ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-56 skeleton-shimmer rounded-xl border border-border bg-card" />
              ))}
            </div>
          ) : savedHosts.length === 0 ? (
            <SpotlightCard className="mx-auto flex max-w-md flex-col items-center gap-4 p-10 text-center">
              <Star className="size-10 text-muted-foreground" />
              <h2 className="text-lg">No saved hosts yet</h2>
              <p className="text-sm text-muted-foreground">
                Browse the hosting directory and click the{" "}
                <Star className="inline size-3.5 align-middle" /> star icon on any host card
                to save it here.
              </p>
              <Button asChild>
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
