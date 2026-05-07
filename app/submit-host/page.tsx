import type { Metadata } from "next";
import SubmitHostClient from "./SubmitHostClient";

export const metadata: Metadata = {
  title: "Submit a Free Host - Get Listed on FreeHosts",
  description:
    "Want to get your free hosting service listed on FreeHosts? Learn the submission process, review our guidelines, and use our layout builder to submit your host today.",
  keywords: [
    "submit free host",
    "list hosting service",
    "add hosting to directory",
    "freehosts submission",
    "get listed freehosts",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://freehosts.space/submit-host",
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: "https://freehosts.space/submit-host",
    title: "Submit a Free Host - Get Listed on FreeHosts",
    description:
      "Join the community-curated directory of free hosting. Learn the submission process and get your host listed today.",
    images: [
      {
        url: "https://freehosts.space/Src/Images/banner.png",
        width: 1280,
        height: 720,
        alt: "FreeHosts - Submit a Host",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit a Free Host - Get Listed on FreeHosts",
    description:
      "Want to get your hosting service listed? Follow our guide and use our layout builder for a seamless submission experience.",
    images: ["https://freehosts.space/Src/Images/banner.png"],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://freehosts.space/submit-host#webpage",
  url: "https://freehosts.space/submit-host",
  name: "Submit a Free Host - Get Listed on FreeHosts",
  isPartOf: { "@id": "https://freehosts.space/#website" },
  inLanguage: "en",
  description:
    "Submit your free hosting service to the FreeHosts directory. Learn the process and get listed.",
};

export default function SubmitHostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SubmitHostClient />
    </>
  );
}
