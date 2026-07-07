import type { Metadata } from "next";
import TosContent from "./TosContent";

export const metadata: Metadata = {
  title: "Terms of Service - FreeHosts",
  description:
    "Read the FreeHosts Terms of Service. Understand your rights and responsibilities when using our free hosting directory and community.",
  keywords: ["freehosts terms of service", "freehosts tos", "hosting directory terms"],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: process.env.APP_URL + "/tos",
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: process.env.APP_URL + "/tos",
    title: "Terms of Service - FreeHosts",
    description:
      "Read the FreeHosts Terms of Service. Understand your rights and responsibilities when using our free hosting directory.",
    images: [
      {
        url: process.env.APP_URL + "/Src/Images/banner.png",
        width: 1280,
        height: 720,
        alt: "FreeHosts - Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service - FreeHosts",
    description:
      "Read the FreeHosts Terms of Service. Understand your rights and responsibilities when using our free hosting directory.",
    images: [process.env.APP_URL + "/Src/Images/banner.png"],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": process.env.APP_URL + "/tos#webpage",
  url: process.env.APP_URL + "/tos",
  name: "Terms of Service - FreeHosts",
  isPartOf: { "@id": process.env.APP_URL + "/#website" },
  inLanguage: "en",
  description:
    "Read the FreeHosts Terms of Service. Understand your rights and responsibilities when using our free hosting directory.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <TosContent />
      </main>
    </>
  );
}
