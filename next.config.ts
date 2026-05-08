/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      // ── Security headers on every response ──────────────────────────────
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self + inline theme script + Matomo + unsafe-eval for React Dev
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://matomo.codelabworks.is-a.dev https://*.cloudflareinsights.com",
              // Styles: self + inline + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: self + Google Fonts CDN
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + data URIs (favicons/inline) + any https image
              "img-src 'self' data: https:",
              // Fetch/XHR: self + API + Matomo + Discord + Cloudflare
              "connect-src 'self' https://matomo.codelabworks.is-a.dev https://discord.com https://*.discord.com https://*.cloudflareinsights.com",
              // Frames: none
              "frame-src 'none'",
              // Objects: none
              "object-src 'none'",
              // Base URI: self only (prevents base-tag injection)
              "base-uri 'self'",
              // Form actions: self only
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // ── Host listing / detail pages ──────────────────────────────────────
      {
        source: '/hosts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/other-free-hosts',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
