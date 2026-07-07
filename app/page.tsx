import type { Metadata } from "next";
import HomeClient from "./HomeClient";

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
    canonical: process.env.APP_URL,
  },
};

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
    {
      "@type": "Organization",
      "@id": process.env.APP_URL + "/#organization",
      name: "FreeHosts",
      url: process.env.APP_URL,
      logo: {
        "@type": "ImageObject",
        url: process.env.APP_URL + "/Src/icons/icon.png",
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
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@" + process.env.EMAIL_DOMAIN,
        contactType: "customer support",
        availableLanguage: "English",
      },
    },
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeClient />
    </>
  );
}
