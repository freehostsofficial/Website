import type { Metadata, Viewport } from "next";
import { Geist as GeistFont, Inter as InterFont } from "next/font/google";
import React, { Suspense } from "react";
import Image from "next/image";
import Link from "@/components/SiteLink";
import ClientChrome from "../components/ClientChrome";
import MatomoTracker from "../components/MatomoTracker";
import ThemeProvider from "../components/ThemeProvider";
import BackToTop from "../components/BackToTop";
import ToastContainer from "../components/Toast";
import { ConsentProvider } from "../contexts/ConsentContext";
import { ComparisonProvider } from "../contexts/ComparisonContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import GdprConsentBanner from "../components/GdprConsentBanner";
import ComparisonPanel from "../components/ComparisonPanel";
import CookieSettingsButton from "../components/CookieSettingsButton";
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
  Moon,
  Pencil,
  Plus,
  Scale,
  Server,
  Shield,
  Star,
  Sun,
  Upload,
  Users,
  X,
} from "lucide-react";
import { DiscordIcon, GithubIcon, InstagramIcon, TwitterIcon } from "../components/BrandIcons";
import { THEME_INIT_SNIPPET } from "../lib/theme";

import "./src/css/globals.css";
import "./src/css/styles.css";
import "./src/css/hosts.css";

const geist = GeistFont({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-geist",
});

const inter = InterFont({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL),
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
  icons: {
    icon: "/Src/icons/icon.png",
    apple: "/Src/icons/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#071028",
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
  { href: "/methodology", icon: <ListChecks size={18} aria-hidden="true" />, label: "How We Review" },
  { href: "/server-rules", icon: <Shield size={18} aria-hidden="true" />, label: "Server Rules" },
  { href: "/other-free-hosts", icon: <LinkIcon size={18} aria-hidden="true" />, label: "Other Free Hosts" },
];

const legalLinks = [
  { href: "/tos", icon: <FileText size={18} aria-hidden="true" />, label: "Terms of Service" },
  { href: "/privacy-policy", icon: <Lock size={18} aria-hidden="true" />, label: "Privacy Policy" },
  { href: "/cookies", icon: <Lock size={18} aria-hidden="true" />, label: "Cookie Policy" },
  { href: "/acceptable-use-policy", icon: <FileText size={18} aria-hidden="true" />, label: "Acceptable Use" },
  { href: "/disclaimer", icon: <FileText size={18} aria-hidden="true" />, label: "Disclaimer" },
];

function DropdownLinks({
  links,
}: {
  links: { href: string; icon: React.ReactNode; label: string }[];
}) {
  return (
    <>
      {links.map((link) => (
        <Link href={link.href} key={link.href}>
          {link.icon} {link.label}
        </Link>
      ))}
    </>
  );
}

function Dropdown({
  icon,
  label,
  links,
}: {
  icon: React.ReactNode;
  label: string;
  links: { href: string; icon: React.ReactNode; label: string }[];
}) {
  return (
    <div className="nav-item">
      <span className="nav-link has-dropdown">
        {icon} {label}
        <ChevronDown size={14} className="dropdown-arrow" aria-hidden="true" />
      </span>
      <div className="dropdown-menu">
        <DropdownLinks links={links} />
      </div>
    </div>
  );
}

function SidebarDropdown({
  icon,
  label,
  links,
}: {
  icon: React.ReactNode;
  label: string;
  links: { href: string; icon: React.ReactNode; label: string }[];
}) {
  return (
    <div className="sidebar-dropdown">
      <button className="sidebar-dropdown-toggle" type="button">
        {icon}
        <span>{label}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div className="sidebar-dropdown-menu">
        <DropdownLinks links={links} />
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geist.variable} ${inter.variable}`}
    >
      <head>
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
        {/* Inline script: apply theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_INIT_SNIPPET,
          }}
        />
        <a href="#fh-page-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider />
        <ClientChrome />

        <ConsentProvider>
          <ComparisonProvider>
            <FavoritesProvider>

              <header className="site-header">
                <div className="wrap header-inner">
                  <button
                    id="sidebarToggle"
                    className="icon-btn mobile-only"
                    aria-label="Open menu"
                  >
                    <Menu size={18} aria-hidden="true" />
                  </button>

                  <Link className="logo" href="/" aria-label="FreeHosts Home">
                    <Image src="/Src/icons/icon-transparent.png" alt="FreeHosts" width={32} height={32} className="logo-img" />
                    FreeHosts
                  </Link>

                  <nav className="nav" role="navigation" aria-label="Main">
                    <div className="nav-item">
                      <Link href="/hosts" className="nav-link">
                        <Server size={18} aria-hidden="true" /> Hosts
                      </Link>
                    </div>
                    <div className="nav-item">
                      <Link href="/compare" className="nav-link"><GitCompare size={18} aria-hidden="true" /> Compare</Link>
                    </div>
                    <div className="nav-item">
                      <Link href="/saved" className="nav-link"><Star size={18} aria-hidden="true" /> Saved</Link>
                    </div>
                    <div className="nav-item">
                      <Link href="/#features" className="nav-link">
                        <ListChecks size={18} aria-hidden="true" /> Features
                      </Link>
                    </div>
                    <Dropdown icon={<Upload size={18} aria-hidden="true" />} label="Submit" links={submitLinks} />
                    <Dropdown icon={<BookOpen size={18} aria-hidden="true" />} label="Resources" links={resourceLinks} />
                    <Dropdown icon={<Scale size={18} aria-hidden="true" />} label="Legal" links={legalLinks} />
                  </nav>

                  <div className="actions" id="headerActions">
                    <button
                      data-theme-toggle
                      className="icon-btn"
                      aria-pressed="false"
                      aria-label="Toggle theme"
                    >
                      <Moon size={22} aria-hidden="true" className="theme-icon-dark" />
                      <Sun size={22} aria-hidden="true" className="theme-icon-light" />
                    </button>
                    <a
                      className="icon-btn"
                      href={process.env.TRUST_PILOT}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View our Trustpilot reviews"
                      title="Trustpilot"
                    >
                      <Star size={22} aria-hidden="true" style={{ color: '#00b67a' }} />
                    </a>
                    <a
                      className="icon-btn"
                      id="discordBtn"
                      href="https://discord.gg/QbeZ3b5CQd"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Join our Discord community"
                      title="Join Discord"
                    >
                      <DiscordIcon aria-hidden="true" style={{ color: '#5865F2' }} />
                    </a>
                  </div>
                </div>
              </header>

              <aside className="sidebar" id="sidebar" aria-hidden="true">
                <div className="sidebar-top">
                  <Link className="logo" href="/">
                    <Image src="/Src/icons/icon-transparent.png" alt="FreeHosts" width={32} height={32} className="logo-img" />
                    FreeHosts
                  </Link>
                  <button id="sidebarClose" className="icon-btn" aria-label="Close menu">
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>

                <nav className="sidebar-nav" role="navigation">
                  <Link href="/hosts" className="sidebar-link">
                    <Server size={20} aria-hidden="true" /> Hosts
                  </Link>
                  <Link href="/compare" className="sidebar-link"><GitCompare size={20} aria-hidden="true" /> Compare</Link>
                  <Link href="/saved" className="sidebar-link"><Star size={20} aria-hidden="true" /> Saved</Link>
                  <Link href="/#features" className="sidebar-link">
                    <ListChecks size={20} aria-hidden="true" /> Features
                  </Link>
                  <SidebarDropdown icon={<Upload size={20} aria-hidden="true" />} label="Submit Host" links={submitLinks} />
                  <SidebarDropdown icon={<BookOpen size={20} aria-hidden="true" />} label="Resources" links={resourceLinks} />
                  <SidebarDropdown icon={<Scale size={20} aria-hidden="true" />} label="Legal" links={legalLinks} />
                </nav>

                <div className="sidebar-footer">
                  <a
                    className="btn primary full"
                    id="discordBtnSidebar"
                    href="https://discord.gg/QbeZ3b5CQd"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DiscordIcon aria-hidden="true" /> Join Discord
                  </a>
                </div>
              </aside>

              <div className="overlay" id="overlay" tabIndex={-1} aria-hidden="true" />

              <ComparisonPanel />

              <div id="fh-page-content">
                {children}
              </div>
              <Suspense fallback={null}>
                <MatomoTracker />
              </Suspense>
              <GdprConsentBanner />

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
                        <DiscordIcon aria-hidden="true" />
                      </a>
                      <a
                        href="https://x.com/freehosts_"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                      >
                        <TwitterIcon aria-hidden="true" />
                      </a>
                      <a
                        href="https://www.instagram.com/freehosts/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                      >
                        <InstagramIcon aria-hidden="true" />
                      </a>
                      <a
                        href="https://github.com/freehostsofficial"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <GithubIcon aria-hidden="true" />
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
                      <li><Link href="/cookies">Cookie Policy</Link></li>
                      <li><Link href="/acceptable-use-policy">Acceptable Use</Link></li>
                      <li><Link href="/disclaimer">Disclaimer</Link></li>
                      <li><Link href="/server-rules">Server Rules</Link></li>
                      <li><CookieSettingsButton /></li>
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
                          <DiscordIcon aria-hidden="true" /> Join Discord
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

            </FavoritesProvider>
          </ComparisonProvider>
        </ConsentProvider>

        <ToastContainer />
        <BackToTop />
      </body>
    </html>
  );
}
