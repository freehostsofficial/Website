// Lightweight category index: slug + last-modified only.
//
// app/sitemap.ts and generateStaticParams import THIS file — not
// lib/categories (≈53KB of guide copy). The full guide bodies load only on
// category pages via dynamic import. Keep slugs/updated in sync with
// lib/categories.ts (a mismatch 404s visibly via notFound()).
export const categoryIndex: { slug: string; updated: string }[] = [
  { slug: 'free-website-hosting', updated: '2026-08-20' },
  { slug: 'free-app-hosting', updated: '2026-08-20' },
  { slug: 'free-game-server-hosting', updated: '2026-08-20' },
  { slug: 'free-discord-bot-hosting', updated: '2026-08-20' },
  { slug: 'free-database-hosting', updated: '2026-08-20' },
  { slug: 'free-vps-hosting', updated: '2026-08-26' },
  { slug: 'free-nodejs-hosting', updated: '2026-08-26' },
  { slug: 'free-python-hosting', updated: '2026-08-26' },
  { slug: 'free-static-site-hosting', updated: '2026-08-26' },
  { slug: 'free-wordpress-hosting', updated: '2026-08-26' },
];
