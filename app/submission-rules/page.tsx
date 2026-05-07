import type { Metadata } from "next";
import SubmissionRulesContent from "./SubmissionRulesContent";

export const metadata: Metadata = {
  title: "Host Submission Rules & Guidelines - FreeHosts",
  description:
    "Read the official submission rules before listing your hosting service on FreeHosts. Learn what's required, what's accepted, and how to format your submission.",
  keywords: [
    "freehosts submission rules",
    "how to submit a host",
    "hosting directory submission guidelines",
    "free hosting listing requirements",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://freehosts.space/submission-rules",
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: "https://freehosts.space/submission-rules",
    title: "Host Submission Rules & Guidelines - FreeHosts",
    description:
      "Read the official submission rules before listing your hosting service on FreeHosts.",
    images: [
      {
        url: "https://freehosts.space/Src/Images/banner.png",
        width: 1280,
        height: 720,
        alt: "FreeHosts - Submission Rules",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Host Submission Rules & Guidelines - FreeHosts",
    description:
      "Read the official submission rules before listing your hosting service on FreeHosts.",
    images: ["https://freehosts.space/Src/Images/banner.png"],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://freehosts.space/submission-rules#webpage",
  url: "https://freehosts.space/submission-rules",
  name: "Host Submission Rules & Guidelines - FreeHosts",
  isPartOf: { "@id": "https://freehosts.space/#website" },
  inLanguage: "en",
  description:
    "Official rules and guidelines for submitting a hosting service to the FreeHosts directory.",
};

export default function SubmissionRulesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="wrap">
        <SubmissionRulesContent />
      </main>
    </>
  );
}
