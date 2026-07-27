import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, Info, List } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Other Free Hosting Platforms & Directories - FreeHosts",
  description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications. Curated by the FreeHosts community.",
  keywords: ["other free hosting platforms", "free hosting directories", "free minecraft hosting list", "hosting resource list"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: process.env.APP_URL + "/other-free-hosts" },
  openGraph: { locale: "en_US", siteName: "FreeHosts", type: "website", url: process.env.APP_URL + "/other-free-hosts", title: "Other Free Hosting Platforms & Directories - FreeHosts", description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications.", images: [{ url: process.env.APP_URL + "/Src/Images/banner.png", width: 1280, height: 720, alt: "FreeHosts - Other Free Hosting Platforms" }] },
  twitter: { card: "summary_large_image", title: "Other Free Hosting Platforms & Directories - FreeHosts", description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications.", images: [{ url: process.env.APP_URL + "/Src/Images/banner.png", alt: "FreeHosts - Other Free Hosting Platforms" }], site: "@freehosts_", creator: "@freehosts_" },
};

type HostLink = { href: string; lucideIcon?: LucideIcon; faIcon?: IconDefinition; label: string };

const externalHosts: { initials?: string; image?: string; name: string; description: string; links: HostLink[] }[] = [
  {
    image: "/Src/Images/free-minecraft-hostings.png",
    name: "Free Minecraft Hostings",
    description: "The best collection of free minecraft server hosting providers. Includings a tons of free minecraft hostings. Allow you to write your own experiences while using free hostings. Founded by the best handsome human in the entire world.",
    links: [
      { href: "https://freeminecrafthostings.com/", lucideIcon: ExternalLink, label: "Website" },
      { href: "https://discord.gg/sc2kauFE3D", faIcon: faDiscord, label: "Discord" },
    ],
  },
  {
    image: "/Src/Images/fmhl.png",
    name: "Free Minecraft Hosts List",
    description: "A comprehensive directory dedicated to free Minecraft server hosting providers, help you find the perfect host for your server.",
    links: [
      { href: "https://myuui.com/", lucideIcon: ExternalLink, label: "Website" },
      { href: "https://discord.gg/JzvVMZ9Zrm", faIcon: faDiscord, label: "Discord" },
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
      <main className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <div className="text-center reveal">
          <h1>Other Free Hosting Platforms</h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Explore a curated collection of reliable platforms offering free hosting
            services for your websites, applications, and projects.
          </p>
        </div>

        <div className="mt-8 flex gap-3 rounded-lg border border-border bg-card p-4 card-hover transition-all duration-300">
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

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-lg">
            <List className="size-4" />
            Specialized Hosting Directories
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Comprehensive directories focused on specific types of hosting services.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {externalHosts.map((host) => (
              <Card key={host.name} className="gap-3 py-4">
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
                          ) : link.faIcon ? (
                            <FontAwesomeIcon icon={link.faIcon} className="size-4" />
                          ) : null}
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
