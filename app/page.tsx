import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { safeJsonLd } from "../lib/safeJsonLd";
import { organizationJsonLd } from "../lib/pageMeta";

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
    canonical: process.env.APP_URL,
  },
};

// Dynamic: the Discord member count below is fetched server-side on each
// render (cached 5 min), so no /api route is needed and the visitor's
// browser never contacts Discord directly.
export const dynamic = "force-dynamic";

const INVITE_URL =
  "https://discord.com/api/v9/invites/QbeZ3b5CQd?with_counts=true&with_expiration=true";

async function getDiscord(): Promise<{ name: string; count: number | null }> {
  try {
    const res = await fetch(INVITE_URL, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 300 },
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
      "@id": process.env.APP_URL + "/#website",
      url: process.env.APP_URL,
      name: "FreeHosts",
      description: "A community-curated directory of free hosting providers for websites, bots, and apps.",
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: process.env.APP_URL + "/hosts?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    organizationJsonLd(),
    {
      "@type": "WebPage",
      "@id": process.env.APP_URL + "/#homepage",
      url: process.env.APP_URL,
      name: "FreeHosts - Free Hosting for Anything You Build",
      isPartOf: { "@id": process.env.APP_URL + "/#website" },
      about: { "@id": process.env.APP_URL + "/#organization" },
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
            item: process.env.APP_URL,
          },
        ],
      },
    },
  ],
};

export default async function HomePage() {
  const discord = await getDiscord();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
      />
      <HomeClient initialDiscord={discord} />
    </>
  );
}
