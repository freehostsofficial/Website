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
    canonical: "https://freehosts.space/tos",
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: "https://freehosts.space/tos",
    title: "Terms of Service - FreeHosts",
    description:
      "Read the FreeHosts Terms of Service. Understand your rights and responsibilities when using our free hosting directory.",
    images: [
      {
        url: "https://freehosts.space/Src/Images/banner.png",
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
    images: ["https://freehosts.space/Src/Images/banner.png"],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://freehosts.space/tos#webpage",
  url: "https://freehosts.space/tos",
  name: "Terms of Service - FreeHosts",
  isPartOf: { "@id": "https://freehosts.space/#website" },
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
