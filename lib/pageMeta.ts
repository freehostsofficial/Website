import type { Metadata } from "next";

// Shared metadata + WebPage JSON-LD for the standard static/content pages
// (was ~50 lines copy-pasted in tos, privacy-policy, server-rules,
// submission-rules, and near-identical variants in faq, methodology, etc.).
const BANNER = "/Src/Images/banner.png";

interface PageMetaInput {
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterDescription?: string;
  keywords?: string[];
  imageAlt?: string;
  twitterImageAlt?: string;
  index?: boolean;
}

export function pageMeta({
  path,
  title,
  description,
  ogTitle = title,
  ogDescription = description,
  twitterDescription = ogDescription,
  keywords,
  imageAlt,
  twitterImageAlt,
  index = true,
}: PageMetaInput): Metadata {
  const base = process.env.APP_URL;
  const banner = base + BANNER;
  return {
    title,
    description,
    keywords,
    robots: {
      index,
      follow: true,
      googleBot: { index, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: { canonical: base + path },
    openGraph: {
      locale: "en_US",
      siteName: "FreeHosts",
      type: "website",
      url: base + path,
      title: ogTitle,
      description: ogDescription,
      images: [{ url: banner, width: 1280, height: 720, alt: imageAlt ?? ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: twitterDescription,
      images: twitterImageAlt ? [{ url: banner, alt: twitterImageAlt }] : [banner],
      site: "@freehosts_",
      creator: "@freehosts_",
    },
  };
}

export function webPageJsonLd(path: string, name: string, description: string, dateModified?: string) {
  const base = process.env.APP_URL;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": base + path + "#webpage",
    url: base + path,
    name,
    isPartOf: { "@id": base + "/#website" },
    inLanguage: "en",
    description,
    ...(dateModified ? { dateModified } : {}),
  };
}

// Shared Organization node (was copy-pasted in app/page.tsx + app/about/page.tsx).
export function organizationJsonLd() {
  const base = process.env.APP_URL;
  return {
    "@type": "Organization",
    "@id": base + "/#organization",
    name: "FreeHosts",
    url: base,
    logo: {
      "@type": "ImageObject",
      url: base + "/Src/icons/icon.png",
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://x.com/freehosts_",
      "https://www.instagram.com/freehosts/",
      "https://github.com/freehostsofficial",
      "https://discord.gg/QbeZ3b5CQd",
    ],
    description:
      "FreeHosts is a community-curated directory of free hosting providers and services.",
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "support@" + process.env.EMAIL_DOMAIN,
        contactType: "customer support",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        url: "https://discord.gg/QbeZ3b5CQd",
        contactType: "community support",
        availableLanguage: "English",
      },
    ],
  };
}
