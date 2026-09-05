import Breadcrumbs from "@/components/Breadcrumbs";
import { safeJsonLd } from "../lib/safeJsonLd";
import { webPageJsonLd } from "../lib/pageMeta";
import { SITE_URL } from "../lib/site";

export const FALLBACK_DATE_MODIFIED = "2026-08-26";

// Shared wrapper for the legal/prose pages (was identical script +
// Breadcrumbs + main in tos, privacy-policy, server-rules, submission-rules).
export default function ProsePage({
  path,
  crumb,
  name,
  description,
  mainClassName,
  dateModified = FALLBACK_DATE_MODIFIED,
  children,
}: {
  path: string;
  crumb: string;
  name: string;
  description: string;
  mainClassName?: string;
  dateModified?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageJsonLd(path, name, description, dateModified)) }}
      />
      <Breadcrumbs siteUrl={SITE_URL} items={[{ name: crumb, path }]} />
      <main className={mainClassName}>{children}</main>
    </>
  );
}
