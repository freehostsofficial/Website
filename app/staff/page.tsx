import type { Metadata } from "next";
import StaffClient from "./StaffClient";
import { staffData } from "./data";

export const metadata: Metadata = {
  title: "Meet the FreeHosts Team - Staff & Contributors",
  description:
    "Meet the volunteers behind FreeHosts — owners, developers, moderators, and host publishers who keep this free hosting directory running.",
  keywords: [
    "freehosts staff",
    "freehosts team",
    "freehosts contributors",
    "hosting directory team",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://freehosts.space/staff",
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: "https://freehosts.space/staff",
    title: "Meet the FreeHosts Team - Staff & Contributors",
    description:
      "Meet the volunteers behind FreeHosts — owners, developers, moderators, and host publishers who keep this free hosting directory running.",
    images: [
      {
        url: "https://freehosts.space/Src/Images/banner.png",
        width: 1280,
        height: 720,
        alt: "FreeHosts - Meet the Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet the FreeHosts Team - Staff & Contributors",
    description:
      "Meet the volunteers behind FreeHosts — owners, developers, moderators, and host publishers who keep this free hosting directory running.",
    images: [
      {
        url: "https://freehosts.space/Src/Images/banner.png",
        alt: "FreeHosts - Meet the Team",
      },
    ],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

export default function StaffPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://freehosts.space/staff#webpage",
    url: "https://freehosts.space/staff",
    name: "Meet the FreeHosts Team - Staff & Contributors",
    isPartOf: { "@id": "https://freehosts.space/#website" },
    inLanguage: "en",
    description:
      "Meet the volunteers behind FreeHosts — owners, developers, moderators, and host publishers.",
  };

  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "FreeHosts Team Members",
    description: "The staff and contributors who run the FreeHosts community directory.",
    url: "https://freehosts.space/staff",
    numberOfItems: Object.keys(staffData).length,
    itemListElement: Object.entries(staffData).map(([, member], index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: member.name ?? "FreeHosts Team Member",
        jobTitle: Array.isArray(member.roles)
          ? member.roles[0]
          : member.roles,
        worksFor: {
          "@id": "https://freehosts.space/#organization",
        },
        ...(member.links?.github
          ? { url: member.links.github }
          : {}),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      <StaffClient />
    </>
  );
}
