import type { Metadata } from "next";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy - FreeHosts",
  description:
    "Read the FreeHosts Privacy Policy. Learn how we collect, use, and protect your data when you use our free hosting directory and community.",
  keywords: ["freehosts privacy policy", "hosting directory privacy", "freehosts data policy"],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: process.env.APP_URL + "/privacy-policy",
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: process.env.APP_URL + "/privacy-policy",
    title: "Privacy Policy - FreeHosts",
    description:
      "Read the FreeHosts Privacy Policy. Learn how we collect, use, and protect your data.",
    images: [
      {
        url: process.env.APP_URL + "/Src/Images/banner.png",
        width: 1280,
        height: 720,
        alt: "FreeHosts - Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - FreeHosts",
    description:
      "Read the FreeHosts Privacy Policy. Learn how we collect, use, and protect your data.",
    images: [process.env.APP_URL + "/Src/Images/banner.png"],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": process.env.APP_URL + "/privacy-policy#webpage",
  url: process.env.APP_URL + "/privacy-policy",
  name: "Privacy Policy - FreeHosts",
  isPartOf: { "@id": process.env.APP_URL + "/#website" },
  inLanguage: "en",
  description:
    "Read the FreeHosts Privacy Policy. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <PrivacyPolicyContent />
      </main>
    </>
  );
}
