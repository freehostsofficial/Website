import type { Metadata, Viewport } from "next";
import React, { Suspense } from "react";
import Image from "next/image";
import Link from "@/components/NoPrefetchLink";
import RouteInitializer from "../components/RouteInitializer";
import GlobalStructuredData from "../components/GlobalStructuredData";
import MatomoTracker from "../components/MatomoTracker";
import PreviewCard from "../components/PreviewCard";
import ToastContainer from "../components/Toast";
import BackToTop from "../components/BackToTop";
import { ConsentProvider } from "../contexts/ConsentContext";
import { ComparisonProvider } from "../contexts/ComparisonContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import GdprConsentBanner from "../components/GdprConsentBanner";
import ComparisonPanel from "../components/ComparisonPanel";
import ConsentGate from "../components/ConsentGate";
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileText,
  GitCompare,
  Info,
  Link as LinkIcon,
  ListChecks,
  Lock,
  Mail,
  Menu,
  Pencil,
  Plus,
  Scale,
  Server,
  Shield,
  Star,
  Upload,
  Users,
  X,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Prevent FontAwesome from injecting its CSS at runtime (causes FOUC)
config.autoAddCss = false;

import "./src/css/globals.css";
import "./src/css/styles.css";
import "./src/css/hosts.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "https://freehosts.space"),
  title: {
    default: "FreeHosts - Free Hosting for Anything You Build",
    template: "%s | FreeHosts",
  },
  description:
    "Discover the best reliable free hosting for websites, discord bots, apps, and databases. Compare zero-cost providers and join our community to build without limits.",
  keywords: [
    "free hosting",
    "free web hosting",
    "free bot hosting",
    "free app hosting",
    "free discord bot hosting",
    "free server hosting",
    "hosting directory",
    "no cost hosting",
    "free nodejs hosting",
    "free database hosting",
  ],
  authors: [{ name: "FreeHosts", url: process.env.APP_URL }],
  creator: "FreeHosts",
  publisher: "FreeHosts",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: process.env.APP_URL,
    title: "FreeHosts - Discover Reliable Free Hosting for Websites, Bots & Apps",
    description:
      "Find reliable free hosting for websites, bots, apps, and Discord communities. Join our community directory to discover no-cost hosting solutions.",
    images: [
      {
        url: "/Src/Images/banner.png",
        width: 1280,
        height: 720,
        alt: "FreeHosts - Discover Free Hosting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeHosts - Free Hosting for Websites, Bots & Apps",
    description:
      "Find reliable free hosting for websites, bots, apps, and Discord communities. Join our community directory to discover no-cost hosting solutions.",
    images: ["/Src/Images/banner.png"],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

const submitLinks = [
  { href: "/submit-host", icon: <Plus size={18} aria-hidden="true" />, label: "Submit a Host" },
  { href: "/submit-layout", icon: <Pencil size={18} aria-hidden="true" />, label: "Submit Layout" },
  { href: "/submission-rules", icon: <ListChecks size={18} aria-hidden="true" />, label: "Submission Rules" },
];

const resourceLinks = [
  { href: "/about", icon: <Info size={18} aria-hidden="true" />, label: "About" },
  { href: "/staff", icon: <Users size={18} aria-hidden="true" />, label: "Staff" },
  { href: "/faq", icon: <CircleHelp size={18} aria-hidden="true" />, label: "FAQ" },
  { href: "/server-rules", icon: <Shield size={18} aria-hidden="true" />, label: "Server Rules" },
  { href: "/other-free-hosts", icon: <LinkIcon size={18} aria-hidden="true" />, label: "Other Free Hosts" },
];

const legalLinks = [
  { href: "/tos", icon: <FileText size={18} aria-hidden="true" />, label: "Terms of Service" },
  { href: "/privacy-policy", icon: <Lock size={18} aria-hidden="true" />, label: "Privacy Policy" },
];

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function NavDropdown({
  icon,
  label,
  links,
}: {
  icon: React.ReactNode;
  label: string;
  links: { href: string; icon: React.ReactNode; label: string }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {icon} {label}
            <ChevronDown size={14} aria-hidden="true" />
          </button>
        }
      />
      <DropdownMenuContent align="start" className="min-w-44">
        {links.map((link) => (
          <DropdownMenuItem key={link.href}
            render={<Link href={link.href} className="flex items-center gap-2" />}
          >
            {link.icon} {link.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" className={cn("dark font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700;800&family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href={process.env.APP_URL + "/sitemap.xml"}
        />
        <link rel="alternate" href={process.env.APP_URL} hrefLang="x-default" />
        <link rel="alternate" href={process.env.APP_URL} hrefLang="en" />
      </head>
      <body>
        <PreviewCard />
        <RouteInitializer />
        <GlobalStructuredData />

        <ConsentProvider>
          <ComparisonProvider>
            <FavoritesProvider>

              <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">

                  <Sheet>
                    <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />}>
                      <Menu size={18} />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
                      <div className="flex items-center gap-2 border-b border-border px-4 h-14">
                        <Image src="/Src/icons/icon-transparent.png" alt="FreeHosts" width={28} height={28} />
                        <span className="font-semibold">FreeHosts</span>
                        <SheetClose className="ml-auto" render={<Button variant="ghost" size="icon-sm" aria-label="Close menu" />}>
                          <X size={16} />
                        </SheetClose>
                      </div>
                      <nav className="flex flex-col gap-1 p-2">
                        <SheetClose render={<Link href="/hosts" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted" />}>
                          <Server size={18} /> Hosts
                        </SheetClose>
                        <SheetClose render={<Link href="/compare" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted" />}>
                          <GitCompare size={18} /> Compare
                        </SheetClose>
                        <SheetClose render={<Link href="/saved" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted" />}>
                          <Star size={18} /> Saved
                        </SheetClose>
                        <SheetClose render={<Link href="/#features" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted" />}>
                          <ListChecks size={18} /> Features
                        </SheetClose>
                        <div className="my-1 border-t border-border" />
                        <span className="px-3 py-1 text-xs font-medium text-muted-foreground">Submit</span>
                        {submitLinks.map((link) => (
                          <SheetClose key={link.href} render={<Link href={link.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted" />}>
                            {link.icon} {link.label}
                          </SheetClose>
                        ))}
                        <span className="px-3 py-1 mt-1 text-xs font-medium text-muted-foreground">Resources</span>
                        {resourceLinks.map((link) => (
                          <SheetClose key={link.href} render={<Link href={link.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted" />}>
                            {link.icon} {link.label}
                          </SheetClose>
                        ))}
                        <span className="px-3 py-1 mt-1 text-xs font-medium text-muted-foreground">Legal</span>
                        {legalLinks.map((link) => (
                          <SheetClose key={link.href} render={<Link href={link.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted" />}>
                            {link.icon} {link.label}
                          </SheetClose>
                        ))}
                      </nav>
                      <div className="mt-auto border-t border-border p-4">
                        <a
                          href="https://discord.gg/QbeZ3b5CQd"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#4752C4] transition-colors"
                        >
                          <FontAwesomeIcon icon={faDiscord} /> Join Discord
                        </a>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Link href="/" className="flex items-center gap-2 font-semibold shrink-0" aria-label="FreeHosts Home">
                    <Image src="/Src/icons/icon-transparent.png" alt="" width={28} height={28} />
                    <span className="hidden sm:inline">FreeHosts</span>
                  </Link>

                  <nav className="hidden lg:flex items-center gap-1 ml-6" role="navigation" aria-label="Main">
                    <Link href="/hosts" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Server size={16} /> Hosts
                    </Link>
                    <Link href="/compare" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <GitCompare size={16} /> Compare
                    </Link>
                    <Link href="/saved" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Star size={16} /> Saved
                    </Link>
                    <Link href="/#features" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ListChecks size={16} /> Features
                    </Link>
                    <NavDropdown icon={<Upload size={16} />} label="Submit" links={submitLinks} />
                    <NavDropdown icon={<BookOpen size={16} />} label="Resources" links={resourceLinks} />
                    <NavDropdown icon={<Scale size={16} />} label="Legal" links={legalLinks} />
                  </nav>

                  <div className="flex items-center gap-2 ml-auto">
                    <a href={process.env.TRUST_PILOT} target="_blank" rel="noopener noreferrer" aria-label="Trustpilot reviews" className="inline-flex items-center justify-center rounded-lg size-8 text-muted-foreground hover:text-foreground transition-colors">
                      <Star size={18} className="text-[#00b67a]" />
                    </a>
                    <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer" aria-label="Join Discord" className="inline-flex items-center justify-center rounded-lg size-8 text-muted-foreground hover:text-foreground transition-colors">
                      <FontAwesomeIcon icon={faDiscord} className="text-[#5865F2]" />
                    </a>
                  </div>
                </div>
              </header>

              <ComparisonPanel />

              <ConsentGate>
                <GdprConsentBanner className="consent-banner" />

                <div className="consentable">
                    <Suspense fallback={null}>
                      <MatomoTracker />
                    </Suspense>
                </div>
                <div className="skippable">
                    {children}
                </div>
              </ConsentGate>

              <footer className="site-footer">
                <div className="wrap footer-content">
                  <div className="footer-section footer-brand">
                    <div className="footer-logo">
                      <Image src="/Src/icons/icon.png" alt="FreeHosts" width={32} height={32} className="logo-img" />
                      <span>FreeHosts</span>
                    </div>
                    <p className="footer-tagline">Discover free hosting that just works.</p>
                    <div className="social-links">
                      <a
                        href="https://discord.gg/QbeZ3b5CQd"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Discord"
                      >
                        <FontAwesomeIcon icon={faDiscord} aria-hidden="true" />
                      </a>
                      <a
                        href="https://x.com/freehosts_"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                      >
                        <FontAwesomeIcon icon={faTwitter} aria-hidden="true" />
                      </a>
                      <a
                        href="https://www.instagram.com/freehosts/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                      >
                        <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                      </a>
                      <a
                        href="https://github.com/freehostsofficial"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="footer-section">
                    <h3 className="footer-section-title">Explore</h3>
                    <ul className="footer-list">
                      <li><Link href="/">Home</Link></li>
                      <li><Link href="/hosts">Browse Hosts</Link></li>
                      <li><Link href="/about">About Us</Link></li>
                      <li><Link href="/staff">Our Team</Link></li>
                      <li><Link href="/faq">FAQ</Link></li>
                      <li><a href={process.env.TRUST_PILOT} target="_blank" rel="noopener noreferrer">Trustpilot</a></li>
                    </ul>
                  </div>

                  <div className="footer-section">
                    <h3 className="footer-section-title">Submit</h3>
                    <ul className="footer-list">
                      <li><Link href="/submit-host">Submit a Host</Link></li>
                      <li><Link href="/submit-layout">Submit Layout</Link></li>
                      <li><Link href="/submission-rules">Submission Rules</Link></li>
                    </ul>
                  </div>

                  <div className="footer-section">
                    <h3 className="footer-section-title">Legal</h3>
                    <ul className="footer-list">
                      <li><Link href="/tos">Terms of Service</Link></li>
                      <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                      <li><Link href="/server-rules">Server Rules</Link></li>
                    </ul>
                  </div>

                  <div className="footer-section">
                    <h3 className="footer-section-title">Contact</h3>
                    <ul className="footer-list">
                      <li>
                        <a href={"mailto:support@" + process.env.EMAIL_DOMAIN} aria-label="Send an email to support">
                          <Mail size={16} aria-hidden="true" /> support@{process.env.EMAIL_DOMAIN}
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://discord.gg/QbeZ3b5CQd"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Join our Discord community"
                        >
                          <FontAwesomeIcon icon={faDiscord} aria-hidden="true" /> Join Discord
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="wrap footer-bottom">
                  <div className="copyright">
                    © 2024-<span id="year" suppressHydrationWarning>{year}</span> FreeHosts. All rights reserved.
                  </div>
                  <div className="footer-bottom-links">
                    <Link href="/tos">Terms</Link>
                    <span className="separator">•</span>
                    <Link href="/privacy-policy">Privacy</Link>
                    <span className="separator">•</span>
                    <a href={"mailto:support@" + process.env.EMAIL_DOMAIN}>Contact</a>
                  </div>
                </div>
              </footer>

              <div id="previewCard" className="preview-card" aria-hidden="true" />

            </FavoritesProvider>
          </ComparisonProvider>
        </ConsentProvider>

        <ToastContainer />
        <BackToTop />
      </body>
    </html>
  );
}
