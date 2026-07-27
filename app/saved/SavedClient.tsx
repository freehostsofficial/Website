"use client";

import { useEffect, useState } from "react";
import { type Host } from "../../lib/cache";
import Link from "@/components/NoPrefetchLink";
import { Star } from "lucide-react";
import { useFavorites } from "../../contexts/FavoritesContext";
import { HostCard } from "@/components/primitives/HostCard";
import { Button } from "@/components/ui/button";

interface SavedClientProps {
  allHosts: Host[];
}

export default function SavedClient({ allHosts }: SavedClientProps) {
  const { favorites } = useFavorites();
  // Suppress rendering until after hydration so we don't flash the empty
  // state while the cookie-based favorites are being loaded client-side.
  const [hasMounted, setHasMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Derive saved hosts by filtering allHosts to those whose id is in favorites.
  // IDs not found in allHosts are silently omitted.
  const savedHosts = allHosts.filter((host) => favorites.includes(host.id));

  const heroSubtitle = !hasMounted
    ? "Your favorited hosting providers, all in one place."
    : savedHosts.length === 0
      ? "Your favorited hosting providers, all in one place."
      : savedHosts.length === 1
        ? "You have 1 saved host."
        : `You have ${savedHosts.length} saved hosts.`;

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <section className="text-center">
        <h1>Saved Hosts</h1>
        <p className="mt-2 text-muted-foreground">{heroSubtitle}</p>
      </section>

      {!hasMounted ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
      ) : savedHosts.length === 0 ? (
        <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-lg border border-border bg-card p-10 text-center">
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
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedHosts.map((host) => (
            <HostCard key={host.id} host={host} />
          ))}
        </div>
      )}
    </main>
  );
}
