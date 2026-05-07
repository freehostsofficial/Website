import type { Metadata } from "next";
import FaqClient from "./FaqClient";
import { faqItems } from "./data";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions About FreeHosts & Free Hosting",
  description:
    "Get answers to the most common questions about FreeHosts and free hosting services. Learn how to find, compare, and submit hosting providers.",
  keywords: [
    "freehosts faq",
    "free hosting questions",
    "hosting directory help",
    "freehosts help",
    "free hosting guide",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://freehosts.space/faq",
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: "https://freehosts.space/faq",
    title: "FAQ - Frequently Asked Questions About FreeHosts & Free Hosting",
    description:
      "Get answers to the most common questions about FreeHosts and free hosting services.",
    images: [
      {
        url: "https://freehosts.space/Src/Images/banner.png",
        width: 1280,
        height: 720,
        alt: "FreeHosts FAQ - Common Questions About FreeHosts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - Frequently Asked Questions About FreeHosts & Free Hosting",
    description:
      "Get answers to the most common questions about FreeHosts and free hosting services.",
    images: [
      {
        url: "https://freehosts.space/Src/Images/banner.png",
        alt: "FreeHosts FAQ - Common Questions About FreeHosts",
      },
    ],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://freehosts.space/faq#webpage",
  url: "https://freehosts.space/faq",
  name: "FAQ - Frequently Asked Questions About FreeHosts & Free Hosting",
  isPartOf: { "@id": "https://freehosts.space/#website" },
  inLanguage: "en",
  description:
    "Get answers to the most common questions about FreeHosts and free hosting services. Learn how to find, compare, and submit hosting providers.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClient />
    </>
  );
}
