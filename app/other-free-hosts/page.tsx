import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, Globe, Info, List, Sparkles } from "lucide-react";
import { DiscordIcon } from "@/components/icons";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/TiltCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export const metadata: Metadata = {
  title: "Other Free Hosting Platforms & Directories - FreeHosts",
  description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications. Curated by the FreeHosts community.",
  keywords: ["other free hosting platforms", "free hosting directories", "free minecraft hosting list", "hosting resource list"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: process.env.APP_URL + "/other-free-hosts" },
  openGraph: { locale: "en_US", siteName: "FreeHosts", type: "website", url: process.env.APP_URL + "/other-free-hosts", title: "Other Free Hosting Platforms & Directories - FreeHosts", description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications.", images: [{ url: process.env.APP_URL + "/Src/Images/banner.png", width: 1280, height: 720, alt: "FreeHosts - Other Free Hosting Platforms" }] },
  twitter: { card: "summary_large_image", title: "Other Free Hosting Platforms & Directories - FreeHosts", description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications.", images: [{ url: process.env.APP_URL + "/Src/Images/banner.png", alt: "FreeHosts - Other Free Hosting Platforms" }], site: "@freehosts_", creator: "@freehosts_" },
};

type HostLink = { href: string; lucideIcon?: LucideIcon; component?: React.ComponentType<{ className?: string }>; label: string };

const externalHosts: { initials?: string; image?: string; name: string; description: string; links: HostLink[] }[] = [
  {
    image: "/Src/Images/free-minecraft-hostings.png",
    name: "Free Minecraft Hostings",
    description: "The best collection of free minecraft server hosting providers. Includings a tons of free minecraft hostings. Allow you to write your own experiences while using free hostings. Founded by the best handsome human in the entire world.",
    links: [
      { href: "https://freeminecrafthostings.com/", lucideIcon: ExternalLink, label: "Website" },
      { href: "https://discord.gg/sc2kauFE3D", component: DiscordIcon, label: "Discord" },
    ],
  },
  {
    image: "/Src/Images/fmhl.png",
    name: "Free Minecraft Hosts List",
    description: "A comprehensive directory dedicated to free Minecraft server hosting providers, help you find the perfect host for your server.",
    links: [
      { href: "https://myuui.com/", lucideIcon: ExternalLink, label: "Website" },
      { href: "https://discord.gg/JzvVMZ9Zrm", component: DiscordIcon, label: "Discord" },
    ],
  },
  {
    image: "/Src/Images/flhl.png",
    name: "Free Low Minecraft Hostings",
    description: "A specialized free hostings catalog which is intended for new and non-recommended hosting providers, with a brief description of reputation to warn against fraud.",
    links: [
      { href: "https://flhl.whiteik.xyz/", lucideIcon: ExternalLink, label: "Website" },
    ],
  },
];

export default function OtherFreeHostsPage() {
  const structuredData = {
    "@context": "https://schema.org", "@type": "WebPage", "@id": process.env.APP_URL + "/other-free-hosts#webpage",
    url: process.env.APP_URL + "/other-free-hosts", name: "Other Free Hosting Platforms & Directories - FreeHosts",
    isPartOf: { "@id": process.env.APP_URL + "/#website" }, inLanguage: "en",
    description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="relative overflow-hidden noise-overlay border-b border-border">
        <div className="dot-grid relative">
          <div className="pointer-events-none absolute -top-40 left-1/4 size-96 opacity-20 blob-morph" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-80 opacity-15 blob-morph" style={{ animationDelay: "4s" }} />
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
            <div className="flex flex-col items-center gap-3 text-center reveal">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Globe className="size-7" />
              </div>
              <h1>Other Free Hosts</h1>
              <p className="max-w-2xl text-muted-foreground body-large">
                Explore a curated collection of reliable platforms offering free hosting
                services for your websites, applications, and projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <SpotlightCard className="reveal">
            <div className="flex gap-3 rounded-lg border border-border bg-card p-4 card-hover transition-all duration-300">
              <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-semibold">Important Information</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  The platforms listed below are independent services not managed by
                  FreeHosts. We have included them as a helpful resource for our
                  community. While we have carefully selected these options, we cannot
                  guarantee their availability, quality, or reliability. Always review
                  each platform terms of service before use.
                </p>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="reveal">
            <Badge variant="outline" className="gap-1.5 border-accent/50 text-accent border-rotate">
              <List className="size-3.5" />
              Specialized Hosting Directories
            </Badge>
            <h2 className="mt-4">Specialized Hosting Directories</h2>
            <p className="mt-2 text-muted-foreground body-large">Comprehensive directories focused on specific types of hosting services.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {externalHosts.map((host) => (
              <TiltCard key={host.name} maxTilt={6} glare={false} className="h-full">
                <Card className="h-full gap-3 py-4 card-hover card-glow transition-all duration-300">
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary">
                        {host.image ? (
                          <Image src={host.image} alt={host.name} width={40} height={40} />
                        ) : (
                          host.initials
                        )}
                      </div>
                      <h3 className="text-sm font-semibold">{host.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{host.description}</p>
                    <div className="mt-1 flex gap-2">
                      {host.links.map((link) => (
                        <Button key={link.href} asChild variant="outline" size="icon">
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${host.name} ${link.label}`}
                          >
                            {link.lucideIcon ? (
                              <link.lucideIcon className="size-4" />
                            ) : link.component ? (
                              React.createElement(link.component, { className: "size-4" })
                            ) : null}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
