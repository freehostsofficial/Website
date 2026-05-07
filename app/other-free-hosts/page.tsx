import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, Info, List } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Other Free Hosting Platforms & Directories - FreeHosts",
  description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications. Curated by the FreeHosts community.",
  keywords: ["other free hosting platforms", "free hosting directories", "free minecraft hosting list", "hosting resource list"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: "https://freehosts.space/other-free-hosts" },
  openGraph: { locale: "en_US", siteName: "FreeHosts", type: "website", url: "https://freehosts.space/other-free-hosts", title: "Other Free Hosting Platforms & Directories - FreeHosts", description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications.", images: [{ url: "https://freehosts.space/Src/Images/banner.png", width: 1280, height: 720, alt: "FreeHosts - Other Free Hosting Platforms" }] },
  twitter: { card: "summary_large_image", title: "Other Free Hosting Platforms & Directories - FreeHosts", description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications.", images: [{ url: "https://freehosts.space/Src/Images/banner.png", alt: "FreeHosts - Other Free Hosting Platforms" }], site: "@freehosts_", creator: "@freehosts_" },
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
    "@context": "https://schema.org", "@type": "WebPage", "@id": "https://freehosts.space/other-free-hosts#webpage",
    url: "https://freehosts.space/other-free-hosts", name: "Other Free Hosting Platforms & Directories - FreeHosts",
    isPartOf: { "@id": "https://freehosts.space/#website" }, inLanguage: "en",
    description: "Discover other trusted platforms and directories that list free hosting services for websites, Minecraft servers, and applications.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="wrap">
        <div className="external-page-header">
          <h1 className="external-page-title">Other Free Hosting Platforms</h1>
          <p className="external-page-subtitle">Explore a curated collection of reliable platforms offering free hosting services for your websites, applications, and projects.</p>
        </div>

        <div className="external-info-banner">
          <Info size={18} className="external-info-banner-icon" aria-hidden="true" />
          <div className="external-info-banner-content">
            <h3>Important Information</h3>
            <p>The platforms listed below are independent services not managed by FreeHosts. We have included them as a helpful resource for our community. While we have carefully selected these options, we cannot guarantee their availability, quality, or reliability. Always review each platform terms of service before use.</p>
          </div>
        </div>

        <section className="external-category-section">
          <h2 className="external-category-title">
            <List size={18} aria-hidden="true" />
            Specialized Hosting Directories
          </h2>
          <p className="external-category-description">Comprehensive directories focused on specific types of hosting services.</p>

          <div className="external-hosts-grid">
            {externalHosts.map((host) => (
              <article className="external-host-card" key={host.name}>
                <div className="external-host-header">
                  <div className="external-host-icon-wrapper">
                    {host.image ? <Image src={host.image} alt={host.name} width={40} height={40} /> : host.initials}
                  </div>
                  <h3 className="external-host-name">{host.name}</h3>
                </div>
                <p className="external-host-description">{host.description}</p>
                <div className="external-host-links">
                  {host.links.map((link) => (
                    <a key={link.href} href={link.href} className="external-host-link" target="_blank" rel="noopener noreferrer" aria-label={`${host.name} ${link.label}`}>
                      {link.lucideIcon ? <link.lucideIcon size={16} aria-hidden="true" /> : link.faIcon ? <FontAwesomeIcon icon={link.faIcon} aria-hidden="true" /> : null}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
