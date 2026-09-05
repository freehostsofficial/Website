import type { NextConfig } from "next";

// Single source of truth for response headers on Vercel.
//
// - Security headers apply to every route (global source).
// - Cache-Control is tiered per route below. Every path also matches the
//   /:path* default, and the LAST matching source wins per header key — so
//   the default is first and the specific tiers override it.
// - The OG image route (/hosts/og/:slug) and the markdown route (/api/md)
//   get their Cache-Control here too: next.config.ts is the single source
//   for CDN tiers, routes must not set Cache-Control themselves.
// - /saved renders identical HTML for everyone (favorites filter client-side),
//   so it shares the directory tier instead of no-store.
// - / and /redirect/* are dynamic per request: browsers must not store them
//   (max-age=0) but the edge may serve them for 5 min (EDGE_SHORT).
// React dev uses eval() for callstack reconstruction — allow it locally
// only. Production never evaluates and keeps the strict policy.
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
  "https://matomo.codelabworks.is-a.dev",
].join(" ");

const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // AI usage preferences (contentsignals.org) — mirrors robots.txt.
  // Origin is authoritative: Cloudflare preserves this on converted responses.
  { key: "Content-Signal", value: "ai-train=no, search=yes, ai-input=yes" },
  // Agent discovery (RFC 8288): machine-readable resources for crawlers/AI.
  // Targets must exist — never point these at unwritten files.
  {
    key: "Link",
    value: '</.well-known/api-catalog>; rel="api-catalog", </llms.txt>; rel="service-doc"',
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // NOTE: no Google Fonts / Cloudflare Insights entries on purpose —
      // fonts are self-hosted via next/font and no beacon is loaded.
      // Re-add a source here only together with the code that loads it.
      "script-src " + scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://matomo.codelabworks.is-a.dev",
        "frame-src 'none'",
        // Modern clickjacking protection. X-Frame-Options: SAMEORIGIN is
        // kept alongside for browsers without frame-ancestors support.
        "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

// Dynamic per-request HTML: browsers always revalidate, edge absorbs traffic
// for 5 min (matches the Discord count freshness on /).
const EDGE_SHORT =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=3600";
// Host directory: fresh HTML for 30 min, edge re-checks origin every 30 min
// (s-maxage matches the pages' ISR revalidate so the edge never serves older
// HTML than a direct origin hit could produce).
const HOSTS_CACHE =
  "public, max-age=1800, s-maxage=1800, stale-while-revalidate=604800";
// OG images: content-hashed (?v=) per host version, regenerated at most
// every 12 h (ISR revalidate=43200 in route.ts). The hash changes exactly
// when the image would, so each URL is immutable forever.
const OG_CACHE =
  "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800, immutable";
// Sitemap: crawlers poll often; hourly CDN regeneration is plenty.
const SITEMAP_CACHE =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=43200";
// Default for content pages: fresh HTML for a day, CDN-served for 30 days.
const CONTENT_CACHE =
  "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=2592000";

const nextConfig: NextConfig = {
  // Cache Components: `dynamic`/`revalidate`/`fetchCache` segment exports
  // are replaced by `use cache` + `cacheLife` (see lib/hosts.ts, app/page.tsx).
  cacheComponents: true,
  images: {
    // next/image serves AVIF first, WebP fallback, PNG last resort.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const cache = (value: string) => [{ key: "Cache-Control", value }];
    return [
      {
        // Default for content pages. Deliberately FIRST: every source below
        // also matches /:path*, and the last matching source wins per key.
        source: "/:path*",
        headers: [...SECURITY_HEADERS, ...cache(CONTENT_CACHE)],
      },
      {
        // Explicit: without this the /:path* default above would let browsers
        // cache dynamic homepage HTML for a day.
        source: "/",
        headers: [...SECURITY_HEADERS, ...cache(EDGE_SHORT)],
      },
      {
        // Identical HTML for every visitor (favorites filter client-side).
        source: "/saved",
        headers: [...SECURITY_HEADERS, ...cache(HOSTS_CACHE)],
      },
      {
        // Interstitial is deterministic per URL; allowlist stays fresh: if a
        // host removes a link, the stale "valid" page lingers ≤5 min and the
        // click-through still shows the real target URL.
        source: "/hosts/:slug/redirect/:path*",
        headers: [...SECURITY_HEADERS, ...cache(EDGE_SHORT)],
      },
      {
        source: "/hosts",
        headers: [...SECURITY_HEADERS, ...cache(HOSTS_CACHE)],
      },
      {
        source: "/hosts/:slug",
        headers: [...SECURITY_HEADERS, ...cache(HOSTS_CACHE)],
      },
      {
        // Same host data as /hosts — must share its tier, not CONTENT_CACHE.
        source: "/alternatives/:slug",
        headers: [...SECURITY_HEADERS, ...cache(HOSTS_CACHE)],
      },
      {
        // Same host data as /hosts — must share its tier, not CONTENT_CACHE.
        source: "/vs/:slug",
        headers: [...SECURITY_HEADERS, ...cache(HOSTS_CACHE)],
      },
      {
        // Interactive comparison table backed by the same host data as
        // /hosts — shares the HOSTS_CACHE tier.
        source: "/compare",
        headers: [...SECURITY_HEADERS, ...cache(HOSTS_CACHE)],
      },
      {
        // Category pages are curated content over the same host data —
        // shares the HOSTS_CACHE tier.
        source: "/categories/:path*",
        headers: [...SECURITY_HEADERS, ...cache(HOSTS_CACHE)],
      },
      {
        // Agent markdown: HTML is fetched with next:{revalidate:1800} so the
        // data-cache TTL matches this CDN s-maxage — no stale-output gap.
        source: "/api/md/:path*",
        headers: [...SECURITY_HEADERS, ...cache(HOSTS_CACHE)],
      },
      {
        // OG images are content-hashed (?v=) — immutable per version.
        // s-maxage is long; a data change mints a new URL instead.
        source: "/hosts/og/:slug",
        headers: [...SECURITY_HEADERS, ...cache(OG_CACHE)],
      },
      {
        source: "/sitemap.xml",
        headers: [...SECURITY_HEADERS, ...cache(SITEMAP_CACHE)],
      },
      {
        // Sharded sitemaps from generateSitemaps (/sitemap/<id>.xml).
        source: "/sitemap/:path*",
        headers: [...SECURITY_HEADERS, ...cache(SITEMAP_CACHE)],
      },
      {
        source: "/Src/:path*",
        headers: [
          ...SECURITY_HEADERS,
          ...cache("public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=604800, immutable"),
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          ...SECURITY_HEADERS,
          ...cache("public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"),
        ],
      },
    ];
  },
};

export default nextConfig;
