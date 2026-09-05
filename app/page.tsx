import type { Metadata } from "next";
import { Suspense } from "react";
import { cacheLife } from "next/cache";
import HomeClient from "./HomeClient";
import { safeJsonLd } from "../lib/safeJsonLd";
import { organizationJsonLd } from "../lib/pageMeta";
import { SITE_URL } from "../lib/site";

export const metadata: Metadata = {
  title: "FreeHosts - Free Hosting for Anything You Build",
  description:
    "Find reliable free hosting for websites, bots, apps, and Discord communities. Join our community directory to discover no-cost hosting solutions.",
  keywords: [
    "free hosting",
    "free web hosting",
    "free bot hosting",
    "free app hosting",
    "free discord bot hosting",
    "free server hosting",
    "hosting directory",
    "no cost hosting",
    "freehosts",
  ],
  alternates: {
    // Next normalises the homepage canonical to the origin without a
    // trailing slash regardless of this value; kept explicit for clarity.
    canonical: SITE_URL,
  },
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
    url: SITE_URL,
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

// Discord count freshness (5 min) lives here, not in a route segment:
// cached function, same TTL the old ISR revalidate + CDN tier provided.
const INVITE_URL =
  "https://discord.com/api/v9/invites/QbeZ3b5CQd?with_counts=true&with_expiration=true";

async function getDiscord(): Promise<{ name: string; count: number | null }> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  try {
    const res = await fetch(INVITE_URL, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Discord ${res.status}`);
    const data = (await res.json()) as {
      guild?: { name?: string };
      approximate_member_count?: number | null;
      approximate_presence_count?: number | null;
      members?: unknown[];
    };
    const count =
      data.approximate_member_count ??
      data.approximate_presence_count ??
      (Array.isArray(data.members) ? data.members.length : null);
    return {
      name: data.guild?.name ?? "Discord",
      count: typeof count === "number" ? count : null,
    };
  } catch {
    return { name: "Discord", count: null };
  }
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      url: SITE_URL,
      name: "FreeHosts",
      description: "A community-curated directory of free hosting providers for websites, bots, and apps.",
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: SITE_URL + "/hosts?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    organizationJsonLd(),
    {
      "@type": "WebPage",
      "@id": SITE_URL + "/#homepage",
      url: SITE_URL,
      name: "FreeHosts - Free Hosting for Anything You Build",
      isPartOf: { "@id": SITE_URL + "/#website" },
      about: { "@id": SITE_URL + "/#organization" },
      inLanguage: "en",
      description:
        "FreeHosts helps developers, students, and makers discover and compare reliable free hosting for websites, bots, and more.",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
        ],
      },
    },
  ],
};

export default async function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
      />
      {/* The Discord count rides a third-party API (up to 5s timeout on cold
          starts) — stream it instead of gating the whole shell's TTFB on it.
          Warm cache resolves inline with identical output; only a cold or
          slow fetch flashes the fallback's unavailable state. */}
      <Suspense fallback={<HomeClient initialDiscord={{ name: "Discord", count: null }} />}>
        <HomePageBody />
      </Suspense>
    </>
  );
}

async function HomePageBody() {
  const discord = await getDiscord();
  return <HomeClient initialDiscord={discord} />;
}
