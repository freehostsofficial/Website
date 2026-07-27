import type { Metadata } from "next";
import CookiePolicyContent from "./CookiePolicyContent";

export const metadata: Metadata = {
  title: "Cookie Policy - FreeHosts",
  description:
    "Read the FreeHosts Cookie Policy. See exactly which cookies we use, including necessary, functional, and Matomo analytics cookies, and how to control them.",
  keywords: ["freehosts cookie policy", "hosting directory cookies", "freehosts matomo cookies"],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: process.env.APP_URL + "/cookies",
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: process.env.APP_URL + "/cookies",
    title: "Cookie Policy - FreeHosts",
    description:
      "See exactly which cookies FreeHosts uses and how to control them.",
    images: [
      {
        url: process.env.APP_URL + "/Src/Images/banner.png",
        width: 1280,
        height: 720,
        alt: "FreeHosts - Cookie Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy - FreeHosts",
    description: "See exactly which cookies FreeHosts uses and how to control them.",
    images: [process.env.APP_URL + "/Src/Images/banner.png"],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": process.env.APP_URL + "/cookies#webpage",
  url: process.env.APP_URL + "/cookies",
  name: "Cookie Policy - FreeHosts",
  isPartOf: { "@id": process.env.APP_URL + "/#website" },
  inLanguage: "en",
  description: "See exactly which cookies FreeHosts uses and how to control them.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <CookiePolicyContent />
      </main>
    </>
  );
}
