"use client";

import { usePathname } from "next/navigation";

/**
 * Client component — renders breadcrumb structured data based on the current
 * pathname. Using usePathname() avoids calling headers() in the layout, which
 * would force every page into dynamic rendering and prevent static generation.
 */
export default function GlobalStructuredData() {
  const pathname = usePathname() ?? "";

  // No breadcrumbs needed on the home page
  if (!pathname || pathname === "/") return null;

  const pathParts = pathname.split("/").filter(Boolean);

  const breadcrumbItems: {
    "@type": string;
    position: number;
    name: string;
    item: string;
  }[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: process.env.APP_URL ?? "https://freehosts.space"
    },
  ];

  // Human-readable label map for known routes
  const labelMap: Record<string, string> = {
    hosts: "Hosting Directory",
    about: "About",
    staff: "Staff",
    faq: "FAQ",
    "submit-host": "Submit a Host",
    "submit-layout": "Submit Layout",
    "submission-rules": "Submission Rules",
    "server-rules": "Server Rules",
    "other-free-hosts": "Other Free Hosts",
    tos: "Terms of Service",
    "privacy-policy": "Privacy Policy",
  };

  let currentPath = "";
  pathParts.forEach((part, index) => {
    currentPath += `/${part}`;

    // Use the label map if available, otherwise title-case the slug
    const name =
      labelMap[part] ??
      part
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    breadcrumbItems.push({
      "@type": "ListItem",
      position: index + 2,
      name,
      item: `${process.env.APP_URL}${currentPath}`,
    });
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
