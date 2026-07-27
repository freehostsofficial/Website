import Link from "@/components/NoPrefetchLink";
import { Cpu, GitCompare, Globe2, HardDrive, MemoryStick, Star } from "lucide-react";

import { type Host } from "@/lib/cache";
import { slugify } from "@/lib/slugify";
import { getLanguageName } from "@/lib/getLanguageName";
import { useComparison } from "@/contexts/ComparisonContext";
import { useFavorites } from "@/contexts/FavoritesContext";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function formatHostSize(mb?: number): string {
  if (!mb) return "Unknown";
  if (mb >= 1024) return (mb / 1024).toFixed(1) + "GB";
  return Math.round(mb) + "MB";
}

export function HostCard({ host, isNew = false }: { host: Host; isNew?: boolean }) {
  const { isSelected, addHost, removeHost, isFull } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();
  const ramDisplay = host.ramMB ? formatHostSize(host.ramMB) : host.ram || "Unknown";
  const storageDisplay = host.diskMB ? formatHostSize(host.diskMB) : host.disk || "Unknown";
  const totalReviews = (host.approvals || 0) + (host.disapprovals || 0);
  const rating = totalReviews > 0 ? Math.round(((host.approvals || 0) / totalReviews) * 100) : 0;
  const iconLetter = host.name ? host.name.charAt(0).toUpperCase() : "?";
  const isOnline = host.status?.toLowerCase() === "online";
  const typeDisplay = host.type
    ? host.type.split(",").map((t) => t.trim().replace(/\s*\([^)]*\)/g, "").trim())
    : [];

  const isDomainHost = host.targets?.some((t) => t.toLowerCase().includes("domain"));
  const isSubdomainHost = host.targets?.some((t) => t.toLowerCase().includes("subdomain"));
  const combinedText = `${host.info || ""}\n${host.description || ""}\n${host.free_plan || ""}`;
  const allExtractedDomains = isDomainHost
    ? Array.from(
        new Set(
          combinedText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => /^\s*[-–•*\s]*[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+[\r\n]*$/.test(l))
            .map((l) => l.replace(/^[-–•*\s]+/, "").trim().split(/\s/)[0]),
        ),
      )
    : [];
  const extractedDomains = allExtractedDomains.slice(0, 10);
  const hasMoreDomains = allExtractedDomains.length > 10;

  return (
    <Card className="relative gap-3 py-4">
      {isNew && (
        <Badge className="absolute top-3 right-3" variant="success">
          NEW
        </Badge>
      )}

      <div className="flex items-start gap-3 px-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary text-base font-semibold">
          {iconLetter}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate pr-10 text-base font-semibold">{host.name}</h3>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <Badge variant={isOnline ? "success" : "destructive"}>{host.status || "Unknown"}</Badge>
            {typeDisplay.map((type) => (
              <Badge key={type} variant="secondary">
                {type}
              </Badge>
            ))}
            {(host.locale || []).map((locale) => (
              <Badge key={locale} variant="outline" className="gap-1">
                <Globe2 className="size-3" />
                {getLanguageName(locale)}
              </Badge>
            ))}
            {(host.targets || []).flatMap((target) =>
              target
                .split(",")
                .map((t) => {
                  const d = t.trim();
                  return d ? (
                    <Badge key={d} variant="outline">
                      {d}
                    </Badge>
                  ) : null;
                })
                .filter(Boolean),
            )}
          </div>
          {host.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{host.description}</p>
          )}
        </div>
      </div>

      {isDomainHost && extractedDomains.length > 0 ? (
        <div className="mx-4 flex flex-col gap-1.5 rounded-md border border-border bg-secondary/40 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-accent">
            <Globe2 className="size-3" />
            Extensions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {extractedDomains.map((domain) => (
              <Badge key={domain} variant="outline" className="text-accent">
                {domain.replace(/^[-\s•*]+/, "")}
              </Badge>
            ))}
          </div>
          {hasMoreDomains && (
            <div className="text-[11px] text-muted-foreground italic">
              + {allExtractedDomains.length - 10} more available
            </div>
          )}
        </div>
      ) : isSubdomainHost ? null : (
        <div className="mx-4 grid grid-cols-3 gap-2">
          <SpecBox icon={<Cpu className="size-4" />} value={host.cpu || "Unknown"} label="CPU" />
          <SpecBox icon={<MemoryStick className="size-4" />} value={ramDisplay} label="Memory" />
          <SpecBox icon={<HardDrive className="size-4" />} value={storageDisplay} label="Storage" />
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border px-4 pt-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold">{rating}%</span>
            <span className="text-xs text-muted-foreground">{totalReviews} reviews</span>
          </div>
          <div className="mt-1 h-1 w-full max-w-24 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-accent" style={{ width: `${rating}%` }} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant={isSelected(host.id) ? "default" : "outline"}
            size="icon"
            className="size-8"
            onClick={() => (isSelected(host.id) ? removeHost(host.id) : addHost(host))}
            disabled={isFull && !isSelected(host.id)}
            aria-pressed={isSelected(host.id)}
            aria-label={isSelected(host.id) ? `Remove ${host.name} from comparison` : `Add ${host.name} to comparison`}
          >
            <GitCompare className="size-3.5" />
          </Button>
          <Button
            variant={isFavorite(host.id) ? "default" : "outline"}
            size="icon"
            className="size-8"
            onClick={() => toggleFavorite(host.id)}
            aria-pressed={isFavorite(host.id)}
            aria-label={isFavorite(host.id) ? `Remove ${host.name} from favorites` : `Add ${host.name} to favorites`}
          >
            <Star className="size-3.5" fill={isFavorite(host.id) ? "currentColor" : "none"} />
          </Button>
          <Button asChild size="sm">
            <Link href={`/hosts/${slugify(host.name)}`}>View</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function SpecBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md border border-border bg-secondary/30 py-2.5 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <span className="truncate text-sm font-medium">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
