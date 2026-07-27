import type { Metadata, Viewport } from "next";
import React, { Suspense } from "react";
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
import CookieConsentBanner from "../components/CookieConsentBanner";
import ComparisonPanel from "../components/ComparisonPanel";
import ConsentGate from "../components/ConsentGate";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Prevent FontAwesome from injecting its CSS at runtime (causes FOUC)
config.autoAddCss = false;

import "./src/css/globals.css";
import "./src/css/animations.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
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

              <SiteHeader trustpilotUrl={process.env.TRUST_PILOT} />

              <ComparisonPanel />

              <ConsentGate>
                <GdprConsentBanner className="consent-banner" />

                <div className="skippable">
                    {children}
                </div>
              </ConsentGate>

              {/* Matomo self-gates on explicit analytics consent; it does not
                  depend on the legal ToS/Privacy gate above. */}
              <Suspense fallback={null}>
                <MatomoTracker />
              </Suspense>

              {/* Cookie preferences: independent of the legal gate, never
                  blocks the page, and can be reopened anytime via the footer. */}
              <CookieConsentBanner />

              <SiteFooter trustpilotUrl={process.env.TRUST_PILOT} emailDomain={process.env.EMAIL_DOMAIN} />

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
