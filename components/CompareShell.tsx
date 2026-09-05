import Breadcrumbs from '@/components/Breadcrumbs';
import { safeJsonLd } from '../lib/safeJsonLd';
import { webPageJsonLd } from '../lib/pageMeta';
import { SITE_URL } from '../lib/site';
import FaqCta from './FaqCta';

export const FALLBACK_DATE_MODIFIED = "2026-08-26";

// Shared shell for the comparison-style pages (was duplicated in
// vs/[slug] + alternatives/[slug]: WebPage JSON-LD + Breadcrumbs +
// main wrapper + faq-hero + faq-cta).
export default function CompareShell({
  pageUrl,
  name,
  description,
  dateModified = FALLBACK_DATE_MODIFIED,
  crumbs,
  eyebrow,
  heroStats = [],
  heroTitle,
  heroLead,
  ctaTitle,
  ctaText,
  ctaButtons,
  children,
}: {
  pageUrl: string;
  name: string;
  description: string;
  dateModified?: string;
  crumbs: { name: string; path: string }[];
  eyebrow?: string;
  heroStats?: { value: string; label: string }[];
  heroTitle: string;
  heroLead: React.ReactNode;
  ctaTitle: string;
  ctaText: React.ReactNode;
  ctaButtons: { href: string; label: string; primary?: boolean }[];
  children: React.ReactNode;
}) {
  const path = pageUrl.replace(SITE_URL, '') || '/';
  const webPageSchema = webPageJsonLd(path, name, description, dateModified);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageSchema) }} />
      <Breadcrumbs siteUrl={SITE_URL} items={crumbs} />
      <main className="wrap about-content">
        <section className="faq-hero">
          {eyebrow && <p className="cmp-eyebrow">{eyebrow}</p>}
          <h1>{heroTitle}</h1>
          <p>{heroLead}</p>
          {heroStats.length > 0 && (
            <ul className="cmp-chips" aria-label="Page highlights">
              {heroStats.map((s) => (
                <li key={s.label} className="cmp-chip">
                  <span className="cmp-chip-value">{s.value}</span>{' '}
                  <span className="cmp-chip-label">{s.label}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        {children}
        <FaqCta title={ctaTitle} text={ctaText} buttons={ctaButtons} />
      </main>
    </>
  );
}
