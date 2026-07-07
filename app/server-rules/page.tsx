import type { Metadata } from "next";
import ServerRulesContent from "./ServerRulesContent";

export const metadata: Metadata = {
  title: "Discord Server Rules & Community Guidelines - FreeHosts",
  description:
    "Read the official FreeHosts Discord server rules and community guidelines. We maintain a safe, respectful, and productive environment for all members.",
  keywords: [
    "freehosts server rules",
    "freehosts discord rules",
    "freehosts community guidelines",
    "hosting community rules",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: process.env.APP_URL + "/server-rules",
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: process.env.APP_URL + "/server-rules",
    title: "Discord Server Rules & Community Guidelines - FreeHosts",
    description:
      "Our official server rules ensure a positive experience for everyone in the FreeHosts community. Review them here.",
    images: [
      {
        url: process.env.APP_URL + "/Src/Images/banner.png",
        width: 1280,
        height: 720,
        alt: "FreeHosts - Server Rules",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Server Rules & Community Guidelines - FreeHosts",
    description:
      "All members must follow our community guidelines to remain part of the FreeHosts network.",
    images: [process.env.APP_URL + "/Src/Images/banner.png"],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": process.env.APP_URL + "/server-rules#webpage",
  url: process.env.APP_URL + "/server-rules",
  name: "Discord Server Rules & Community Guidelines - FreeHosts",
  isPartOf: { "@id": process.env.APP_URL + "/#website" },
  inLanguage: "en",
  description:
    "Official Discord server rules and community guidelines for the FreeHosts community.",
};

export default function ServerRulesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="wrap section">
        <ServerRulesContent />
      </main>
    </>
  );
}
