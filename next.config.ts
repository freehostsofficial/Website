import type { NextConfig } from "next";

// Single source of truth for response headers on Vercel.
//
// - Security headers apply to every route (global source).
// - Cache-Control is tiered per route below. Every path also matches the
//   /:path* default, and the LAST matching source wins per header key — so
//   the default is first and the specific tiers override it.
// - The OG image route (/hosts/og/:slug) sets its own Cache-Control on the
//   ImageResponse AND has a matching source below with the same value:
//   config headers override route headers, so both must agree.
// - /saved + /redirect/* are private and match no public source.
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
      "script-src 'self' 'unsafe-inline' https://matomo.codelabworks.is-a.dev",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://matomo.codelabworks.is-a.dev",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const NO_STORE = "private, no-store";
// Host directory: fresh HTML for 30 min, CDN-served for 12h.
const HOSTS_CACHE =
  "public, max-age=1800, s-maxage=43200, stale-while-revalidate=604800";
// Sitemap: crawlers poll often; hourly CDN regeneration is plenty.
const SITEMAP_CACHE =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=43200, no-transform";
// Default for content pages: fresh HTML for a day, CDN-served for 30 days.
const CONTENT_CACHE =
  "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=2592000";

const nextConfig: NextConfig = {
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
        source: "/saved",
        headers: [...SECURITY_HEADERS, ...cache(NO_STORE)],
      },
      {
        source: "/hosts/:slug/redirect/:path*",
        headers: [...SECURITY_HEADERS, ...cache(NO_STORE)],
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
        // Same value the route sets on its ImageResponse (config wins on
        // merge, so the two must agree — verified with curl, single header).
        source: "/hosts/og/:slug",
        headers: [...SECURITY_HEADERS, ...cache(HOSTS_CACHE)],
      },
      {
        source: "/sitemap.xml",
        headers: [...SECURITY_HEADERS, ...cache(SITEMAP_CACHE)],
      },
      {
        source: "/Src/:path*",
        headers: [
          ...SECURITY_HEADERS,
          ...cache("public, max-age=2592000, stale-while-revalidate=604800"),
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          ...SECURITY_HEADERS,
          ...cache("public, max-age=86400, stale-while-revalidate=604800"),
        ],
      },
    ];
  },
};

export default nextConfig;
