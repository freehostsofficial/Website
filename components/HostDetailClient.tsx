"use client";

import React, { useState, useCallback } from "react";
import Link from "@/components/NoPrefetchLink";
import { type Host } from "../lib/cache";
import { slugify } from "../lib/slugify";
import { getLanguageName } from "../lib/getLanguageName";
import {
  ArrowLeft,
  Check,
  Copy,
  Cpu,
  Crosshair,
  ExternalLink,
  Gift,
  HardDrive,
  Info,
  Languages,
  Link as LinkIcon,
  MemoryStick,
  Settings,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { showToast } from "./Toast";
import { useFavorites } from "../contexts/FavoritesContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface HostDetailClientProps {
  host: Host;
  related?: Host[];
}

export default function HostDetailClient({ host, related = [] }: HostDetailClientProps) {
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const totalReviews = (host.approvals || 0) + (host.disapprovals || 0);
  const rating = totalReviews > 0 ? Math.round(((host.approvals || 0) / totalReviews) * 100) : 0;
  const isOnline = host.status?.toLowerCase() === "online";
  const typeDisplay = host.type
    ? host.type.split(",").map((t) => t.trim().replace(/\s*\([^)]*\)/g, "").trim()).join(", ")
    : "Unknown";

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Failed to copy link", "error");
    }
  }, []);

  function formatInfoLines(text?: string): React.ReactNode {
    if (!text) return null;
    const lines = text.split("\n").filter((l) => l.trim());
    const items: React.ReactNode[] = [];
    let subItems: React.ReactNode[] = [];

    const flushSub = () => {
      if (subItems.length > 0) {
        items.push(
          <ul key={`sub-${items.length}`} className="ml-4 list-disc space-y-1">
            {subItems}
          </ul>,
        );
        subItems = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("-")) {
        subItems.push(<li key={i}>{trimmed.substring(1).trim()}</li>);
      } else {
        flushSub();
        items.push(<li key={i}>{trimmed}</li>);
      }
    });
    flushSub();

    return <ul className="space-y-1.5">{items}</ul>;
  }

  function formatSize(mb?: number): string {
    if (!mb) return "Unknown";
    if (mb >= 1024) return (mb / 1024).toFixed(1) + "GB";
    return Math.round(mb) + "MB";
  }

  const handleRedirect = useCallback(
    (url: string) => {
      if (typeof window === "undefined") return;

      const normalised = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;

      let redirectPath: string;
      try {
        const urlObj = new URL(normalised);
        const pathAndQuery = urlObj.pathname !== "/" ? urlObj.pathname + urlObj.search : urlObj.search;
        redirectPath = urlObj.hostname + pathAndQuery;
      } catch {
        redirectPath = url.replace(/^https?:\/\//, "");
      }

      const encodedPath = redirectPath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");

      window.open(`/hosts/${slugify(host.name)}/redirect/${encodedPath}`, "_blank", "noopener,noreferrer");
    },
    [host.name],
  );

  const showSpecs = !host.targets?.some((t) => t.toLowerCase().includes("subdomain"));

  return (
    <>
      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Link href="/hosts">
            <ArrowLeft className="size-4" />
            Back to All Hosts
          </Link>
        </Button>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1>{host.name}</h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="secondary">{typeDisplay}</Badge>
              <Badge variant={isOnline ? "success" : "destructive"}>{host.status}</Badge>
              {(host.locale || []).map((locale) => (
                <Badge key={locale} variant="outline">
                  {getLanguageName(locale)}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              variant={isFavorite(host.id) ? "default" : "outline"}
              size="icon"
              onClick={() => toggleFavorite(host.id)}
              aria-pressed={isFavorite(host.id)}
              aria-label={isFavorite(host.id) ? `Remove ${host.name} from favorites` : `Add ${host.name} to favorites`}
              title={isFavorite(host.id) ? "Remove from saved" : "Save host"}
            >
              <Star className="size-4" fill={isFavorite(host.id) ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              aria-label="Copy link to this host"
              title={copied ? "Copied!" : "Copy link"}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* ── Main content ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-8 lg:order-1">
            {host.info && host.info.trim() && (
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Info className="size-4" />
                  Information
                </h3>
                <div className="mt-2 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  {formatInfoLines(host.info)}
                </div>
              </section>
            )}

            {host.free_plan && host.free_plan.trim() && (
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Gift className="size-4" />
                  Free Plan
                </h3>
                <div className="mt-2 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  {formatInfoLines(host.free_plan)}
                </div>
              </section>
            )}

            {showSpecs && (
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Settings className="size-4" />
                  Key Specifications
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <SpecBox icon={<Cpu className="size-5" />} label="CPU" value={host.cpu || "Unknown"} />
                  <SpecBox
                    icon={<MemoryStick className="size-5" />}
                    label="RAM"
                    value={host.ramMB ? formatSize(host.ramMB) : host.ram || "Unknown"}
                  />
                  <SpecBox
                    icon={<HardDrive className="size-5" />}
                    label="Storage"
                    value={host.diskMB ? formatSize(host.diskMB) : host.disk || "Unknown"}
                  />
                  <SpecBox
                    icon={<Languages className="size-5" />}
                    label="Languages"
                    value={(host.locale || []).map((l) => getLanguageName(l)).join(", ") || "Unknown"}
                  />
                </div>
              </section>
            )}

            {host.targets && host.targets.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Crosshair className="size-4" />
                  Targets
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(host.targets || []).flatMap((target) =>
                    target
                      .split(",")
                      .map((t) => {
                        const d = t.trim();
                        return d ? (
                          <Badge key={d} variant="secondary" className="px-3 py-1 text-sm">
                            {d}
                          </Badge>
                        ) : null;
                      })
                      .filter(Boolean),
                  )}
                </div>
              </section>
            )}

            {host.links && host.links.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <LinkIcon className="size-4" />
                  Links
                </h3>
                <div className="mt-2 flex flex-col gap-2">
                  {(host.links || []).map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRedirect(link);
                      }}
                      className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
                    >
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                      {link}
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar: sticky on desktop ───────────────────────────── */}
          <div className="lg:order-2">
            <Card className="lg:sticky lg:top-20">
              <CardContent className="flex flex-col items-center gap-4 text-center">
                <div>
                  <div className="font-mono text-4xl font-bold">{rating}%</div>
                  <p className="text-xs text-muted-foreground">Based on {totalReviews} reviews</p>
                </div>
                <div className="grid w-full grid-cols-2 gap-3">
                  <div className="rounded-md border border-border py-3">
                    <div className="font-mono text-lg font-semibold text-accent">{host.approvals || 0}</div>
                    <div className="text-xs text-muted-foreground">Upvotes</div>
                  </div>
                  <div className="rounded-md border border-border py-3">
                    <div className="font-mono text-lg font-semibold text-destructive">{host.disapprovals || 0}</div>
                    <div className="text-xs text-muted-foreground">Downvotes</div>
                  </div>
                </div>
                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1 gap-1.5" onClick={() => setShowDiscordModal(true)}>
                    <ThumbsUp className="size-3.5" />
                    Upvote
                  </Button>
                  <Button variant="outline" className="flex-1 gap-1.5" onClick={() => setShowDiscordModal(true)}>
                    <ThumbsDown className="size-3.5" />
                    Downvote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related hosts */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg">Similar Hosting Providers</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => {
                const rOnline = r.status?.toLowerCase() === "online";
                const rRating =
                  r.approvals + r.disapprovals > 0
                    ? Math.round((r.approvals / (r.approvals + r.disapprovals)) * 100)
                    : null;

                const isDomainHost = r.targets?.some((t) => t.toLowerCase().includes("domain"));
                const combinedText = `${r.info || ""}\n${r.description || ""}\n${r.free_plan || ""}`;
                const allExtractedDomains = isDomainHost
                  ? Array.from(
                      new Set(
                        combinedText
                          .split("\n")
                          .map((l) => l.trim())
                          .filter(
                            (l) =>
                              l.includes(".") &&
                              !l.includes(":") &&
                              !l.toLowerCase().includes("available domains") &&
                              !l.toLowerCase().includes("available extensions"),
                          ),
                      ),
                    )
                  : [];
                const extractedDomains = allExtractedDomains.slice(0, 5);
                const hasMoreDomains = allExtractedDomains.length > 5;
                const isSubdomainHost = r.targets?.some((t) => t.toLowerCase().includes("subdomain"));

                return (
                  <Link key={r.id} href={`/hosts/${slugify(r.name)}`} className="block">
                    <Card className="h-full gap-3 py-4 transition-colors hover:border-foreground/30">
                      <CardContent className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-semibold">
                            {r.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm font-medium">{r.name}</span>
                              <Badge variant={rOnline ? "success" : "destructive"} className="text-[10px]">
                                {r.status || "Unknown"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {isDomainHost && extractedDomains.length > 0 ? (
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 font-medium text-accent">
                              <LinkIcon className="size-3" />
                              Extensions
                            </div>
                            {extractedDomains.map((domain) => (
                              <div key={domain}>• {domain.replace(/^[-\s•*]+/, "")}</div>
                            ))}
                            {hasMoreDomains && <div className="italic">+ more available</div>}
                          </div>
                        ) : isSubdomainHost ? (
                          <p className="text-xs text-muted-foreground italic">Free subdomain hosting</p>
                        ) : (
                          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Cpu className="size-3.5" />
                              {r.cpu || "Unknown"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MemoryStick className="size-3.5" />
                              {r.ramMB ? formatSize(r.ramMB) : r.ram || "Free"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <HardDrive className="size-3.5" />
                              {r.diskMB ? formatSize(r.diskMB) : r.disk || "Unknown"}
                            </span>
                          </div>
                        )}

                        <div className="mt-1 flex items-center gap-1.5">
                          {r.targets?.slice(0, 3).map((t) => (
                            <Badge key={t} variant="outline" className="text-[10px]">
                              {t.split(",")[0]}
                            </Badge>
                          ))}
                          {rRating !== null && (
                            <span className={cn("ml-auto font-mono text-xs font-semibold text-accent")}>
                              {rRating}%
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Dialog open={showDiscordModal} onOpenChange={setShowDiscordModal}>
        <DialogContent className="text-center sm:max-w-sm">
          <DialogHeader className="items-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
              <FontAwesomeIcon icon={faDiscord} className="size-5" />
            </div>
            <DialogTitle>Discord Required</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            You can only vote and review hosts in the Discord server!
          </p>
          <Button onClick={() => setShowDiscordModal(false)}>Got it</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SpecBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card py-4 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
