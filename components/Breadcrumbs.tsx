import Link from "./SiteLink";
import { safeJsonLd } from "../lib/safeJsonLd";

function breadcrumbSchema(siteUrl: string, crumbs: { name: string; path: string }[]) {
  const itemListElement = [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    ...crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: c.name,
      item: `${siteUrl}${c.path}`,
    })),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

export default function Breadcrumbs({
  siteUrl,
  items,
}: {
  siteUrl: string;
  items: { name: string; path: string }[];
}) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb-list">
          <li>
            <Link href="/">Home</Link>
          </li>
          {items.map((c, i) => (
            <li key={c.path}>
              <Link href={c.path} aria-current={i === items.length - 1 ? "page" : undefined}>
                {c.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema(siteUrl, items)) }}
      />
    </>
  );
}