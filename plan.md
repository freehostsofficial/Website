# FreeHosts Redesign Plan

### Minimalist, black-theme rebuild on shadcn/ui

-----

## 1. Where the site is today

Codebase audit (Next.js 16 / React 19 / Tailwind v4, no component library):

- **~13,200 lines** of hand-written CSS across `globals.css`, `styles.css`, `hosts.css` — no design tokens, no reusable primitives, everything is bespoke classnames (`.what-is-hosting-shell`, `.hosting-highlight-icon`, etc.)
- **19 routes**: home, hosts listing, host detail (`[slug]`), compare, staff, FAQ, about, saved (favorites), submit-host, submit-layout, server-rules, submission-rules, privacy-policy, cookies, tos, other-free-hosts, plus redirect/OG-image routes
- **17 shared components**: comparison panel, host detail client, cookie/GDPR consent banners, toast, sidebar, snow effect, theme provider, back-to-top, etc.
- Icons via **FontAwesome + lucide-react** (mixed)
- Client-side contexts for comparison, consent, favorites
- Matomo analytics, GDPR/cookie consent flows, sitemap, structured data — all functional and **must survive the redesign untouched**

This is a real migration, not a reskin: moving from bespoke CSS to a token-driven shadcn/ui system.

-----

## 2. Design direction

**Look:** minimal, high-contrast, near-black canvas — content and data (host specs, prices, comparisons) carry the page, not decoration. shadcn’s “New York” style (tighter radii, denser defaults) suits a comparison/directory site better than the softer “Default” style.

**Token system** (shadcn CSS variables, OKLCH):

|Token             |Value                                                                                                                                                                      |Use                   |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
|`background`      |`#0A0A0A`                                                                                                                                                                  |page canvas           |
|`card`            |`#121212`                                                                                                                                                                  |panels, host cards    |
|`border`          |`#242424`                                                                                                                                                                  |hairline dividers only|
|`foreground`      |`#FAFAFA`                                                                                                                                                                  |primary text          |
|`muted-foreground`|`#8A8A8A`                                                                                                                                                                  |secondary text        |
|`primary`         |`#FAFAFA` (inverted button)                                                                                                                                                |primary actions       |
|`accent`          |one restrained color (candidate: signal-green `#3ECF6D` for “online/free” status, or keep it fully achromatic and reserve color only for status badges — uptime, free/paid)|                      |
|`destructive`     |`#E5484D`                                                                                                                                                                  |errors, “down” status |
|`radius`          |`0.5rem` (sm), scale down — sharper corners than default shadcn                                                                                                            |                      |

Rationale for a mostly-achromatic palette: the product’s job is comparison (specs, RAM, uptime %), so the one place color should appear is **status/state** (host online, free tier, verified staff), not chrome. This avoids the generic “black bg + one random accent” AI-default look — the accent is functional, not decorative.

**Typography:** a single geometric/grotesk sans for UI (Geist, already in use, or Inter), monospace (Geist Mono / JetBrains Mono) for specs, IPs, RAM/CPU numbers, and prices — makes data scannable and reinforces the technical audience.

**Layout:** hairline-bordered cards, generous whitespace, sticky compact nav, dense data tables for comparisons (shadcn `Table` + `DataTable` pattern), no gradients/glow/decorative blur — replacing current radial-gradient card treatments.

**Reference points from current dark/black web design (2026):** the sites that read as premium rather than “default AI dark mode” share a few traits — commit fully to near-black rather than a dark-gray-that-wishes-it-was-a-toggle; use dark grays (`#121212`–`#1a1a1a`) for surfaces instead of pure `#000` so cards read as elevated; keep animation to one or two orchestrated moments (a hover state, a reveal) instead of scattered motion; and let a single accent do real work (status, not decoration). Stripped-down navigation (logo + 4–5 links, no mega-menus) is a consistent pattern across the best examples — fits a directory site well.

-----

## 2a. Responsive strategy (mobile + desktop)

Since this is a directory/comparison product, mobile and desktop genuinely need different information density, not just a squeezed layout:

**Breakpoints** (Tailwind defaults): `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.

|Surface                 |Mobile (< 768px)                                                                                       |Desktop (≥ 1024px)                                             |
|------------------------|-------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
|Nav                     |Hamburger → `Sheet` slide-over, logo + one primary CTA visible                                         |Full inline nav, logo left, links center/right                 |
|Hosts listing           |Single-column `Card` stack, filters collapse into a `Sheet`/drawer triggered by a “Filters” button     |Sidebar filters persistent left column + multi-column card grid|
|Comparison table        |Card-per-host stacked view (a real table is unreadable at narrow widths), or horizontal-scroll fallback|Full shadcn `Table`, all hosts as columns, sticky first column |
|Host detail             |Single column, spec table stacks to key/value rows                                                     |Two-column: content left, sticky spec/CTA card right           |
|Forms (submit-host etc.)|Full-width single column, larger tap targets (min 44px)                                                |Constrained max-width (~640px) centered form                   |

**Non-negotiables for “best looking” on both:**

- Fluid type scale (`clamp()`) for headings so they don’t feel oversized on mobile or timid on desktop
- Touch targets ≥ 44×44px on mobile; hover states only apply above `md` (avoid “sticky hover” on touch)
- Comparison table is the highest-risk component for mobile — test it specifically
- Responsive images via Next.js `Image`, no layout shift
- Verify contrast ratios at both breakpoints — dark backgrounds are less forgiving on mobile screens in daylight

-----

## 3. Target architecture

```
components/
  ui/          # unmodified shadcn primitives (button, card, table, dialog, badge, sheet, tabs...)
  primitives/  # lightly themed wrappers (StatusBadge, SpecPill, PriceTag)
  blocks/      # page-level compositions (HostCard, ComparisonTable, ConsentBanner, StaffGrid)
lib/
  tokens.ts    # shared design constants (already have lib/, extend it)
```

- Install shadcn CLI, initialize with New York style + the token set above
- Add only the primitives actually needed first (button, card, badge, table, dialog, sheet, tabs, input, select, dropdown-menu, tooltip, skeleton, toast/sonner) — pull more in as pages need them, not the full catalog
- Replace FontAwesome with lucide-react only (shadcn’s default, cuts a whole icon library)
- Existing contexts (`ComparisonContext`, `ConsentContext`, `FavoritesContext`) stay — only their consuming UI changes

-----

## 4. Phased plan

**Phase 0 — Foundations (1 session)**

- `npx shadcn init`, configure `components.json`, set CSS variables in `globals.css`, delete legacy `styles.css`/`hosts.css` incrementally
- Rebuild `layout.tsx` shell: header/nav, footer, theme provider (force dark, no light/dark toggle needed if it’s black-only — confirm)
- Establish `Button`, `Card`, `Badge`, `Input` as the base kit

**Phase 1 — Core navigation + home**

- New nav (logo, Hosts, Compare, Staff, FAQ, Submit)
- Home (`HomeClient.tsx`): hero, “what is hosting” section, featured hosts — rebuilt with `Card`/`Badge` primitives instead of custom gradient shells

**Phase 2 — Data-heavy pages (highest complexity)**

- `hosts` listing + filters → shadcn `Select`/`Checkbox` filter bar + `Card` grid
- `hosts/[slug]` detail page → spec table, status badges
- `compare` → shadcn `Table`-based comparison, replacing `ComparisonPanel.tsx` styling
- `staff` → avatar grid using `Card`

**Phase 3 — Forms + utility pages**

- `submit-host`, `submit-layout` → shadcn `Form` (react-hook-form + zod pattern) with `Input`/`Textarea`/`Select`
- `faq` → `Accordion`
- `saved` (favorites) → same `Card` grid as hosts listing

**Phase 4 — Legal/static + system UI**

- `tos`, `privacy-policy`, `cookies`, `server-rules`, `submission-rules`, `about` → shared `prose`-style content wrapper, minimal styling
- Consent banners (`CookieConsentBanner`, `GdprConsentBanner`) → `Sheet`/`Dialog` primitives
- `Toast`, `BackToTop`, `not-found` → shadcn `Sonner`/`Toast`, simple button

**Phase 5 — Polish + QA**

- Remove `SnowEffect` or restyle for the minimal theme (decorative motion likely cut — conflicts with minimalist brief)
- Accessibility pass: focus states, contrast on `#0A0A0A`/`#FAFAFA` (verify AA/AAA), reduced-motion
- Responsive pass, mobile nav (`Sheet`)
- Verify Matomo, GDPR flows, sitemap, OG image route, structured data all still fire correctly after markup changes

-----

## 5. Key decisions to confirm before building

- **Accent color**: fully achromatic vs. one functional accent for status (recommend the latter — pure grayscale makes “free/paid” and “online/offline” states unreadable)
- **Snow effect**: keep as a seasonal easter egg, or cut for the minimalist direction?
- **Icon set**: fully migrate off FontAwesome to lucide-react, or keep FA for brand logos (Discord, etc.)?
- **Rollout**: ship all at once, or page-by-page behind a feature flag so the listing/directory (highest traffic) doesn’t regress SEO mid-migration?

-----

## 6. Effort estimate

|Phase|Scope                   |Rough size                               |
|-----|------------------------|-----------------------------------------|
|0    |Tooling + tokens + shell|Small                                    |
|1    |Nav + home              |Small–Medium                             |
|2    |Hosts/compare/staff     |Large (core value, most custom CSS today)|
|3    |Forms                   |Medium                                   |
|4    |Legal + system UI       |Small–Medium                             |
|5    |QA/polish               |Medium                                   |

Recommend starting with **Phase 0 + Phase 1** as a first buildable milestone so we can validate the token system and component patterns on real pages before touching the data-heavy comparison/listing pages.