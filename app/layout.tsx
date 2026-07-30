import type { Metadata, Viewport } from "next";
import React, { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import RouteInitializer from "../components/RouteInitializer";
import GlobalStructuredData from "../components/GlobalStructuredData";
import MatomoTracker from "../components/MatomoTracker";
import PreviewCard from "../components/PreviewCard";
import ToastContainer from "../components/Toast";
import BackToTop from "../components/BackToTop";
import { ConsentProvider } from "../contexts/ConsentContext";
import { ComparisonProvider } from "../contexts/ComparisonContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import GdprConsentBanner from "../components/GdprConsentBanner";
import CookieConsentBanner from "../components/CookieConsentBanner";
import ComparisonPanel from "../components/ComparisonPanel";
import ConsentGate from "../components/ConsentGate";
import RevealProvider from "../components/RevealProvider";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageBreadcrumbs from "../components/PageBreadcrumbs";
import ThemeScript from "../components/ThemeScript";
import LayoutContent from "../components/LayoutContent";
import { fetchHosts } from "../lib/cache";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;
library.add(fas, far, fab);

import "./src/css/globals.css";
import "./src/css/animations.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

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
  themeColor: "#0a0a0a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hosts = await fetchHosts();

  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href={process.env.APP_URL + "/sitemap.xml"}
        />
        <link rel="alternate" href={process.env.APP_URL} hrefLang="x-default" />
        <link rel="alternate" href={process.env.APP_URL} hrefLang="en" />
      </head>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <PreviewCard />
        <RouteInitializer />
        <GlobalStructuredData />
        <RevealProvider />

        <ThemeProvider>
          <ConsentProvider>
            <ComparisonProvider>
              <FavoritesProvider>

                <SiteHeader trustpilotUrl={process.env.TRUST_PILOT} hosts={hosts} />

                <ComparisonPanel />

                <ConsentGate>
                  <GdprConsentBanner className="consent-banner" />

                  <div className="skippable flex-1">
                    <Suspense fallback={null}>
                      <PageBreadcrumbs />
                    </Suspense>
                    <LayoutContent>
                      {children}
                    </LayoutContent>
                  </div>
                </ConsentGate>

                <Suspense fallback={null}>
                  <MatomoTracker />
                </Suspense>

                <CookieConsentBanner />

                <SiteFooter trustpilotUrl={process.env.TRUST_PILOT} emailDomain={process.env.EMAIL_DOMAIN} />

                <div id="previewCard" className="preview-card" aria-hidden="true" />

              </FavoritesProvider>
            </ComparisonProvider>
          </ConsentProvider>
        </ThemeProvider>

        <ToastContainer />
        <BackToTop />
      </body>
    </html>
  );
}
