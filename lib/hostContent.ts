import flagAe from "flag-icons/flags/4x3/ae.svg";
import flagAr from "flag-icons/flags/4x3/ar.svg";
import flagAt from "flag-icons/flags/4x3/at.svg";
import flagAu from "flag-icons/flags/4x3/au.svg";
import flagBe from "flag-icons/flags/4x3/be.svg";
import flagBr from "flag-icons/flags/4x3/br.svg";
import flagCa from "flag-icons/flags/4x3/ca.svg";
import flagCh from "flag-icons/flags/4x3/ch.svg";
import flagCl from "flag-icons/flags/4x3/cl.svg";
import flagCn from "flag-icons/flags/4x3/cn.svg";
import flagCo from "flag-icons/flags/4x3/co.svg";
import flagCz from "flag-icons/flags/4x3/cz.svg";
import flagDe from "flag-icons/flags/4x3/de.svg";
import flagDk from "flag-icons/flags/4x3/dk.svg";
import flagEg from "flag-icons/flags/4x3/eg.svg";
import flagEs from "flag-icons/flags/4x3/es.svg";
import flagEu from "flag-icons/flags/4x3/eu.svg";
import flagFi from "flag-icons/flags/4x3/fi.svg";
import flagFr from "flag-icons/flags/4x3/fr.svg";
import flagGb from "flag-icons/flags/4x3/gb.svg";
import flagGr from "flag-icons/flags/4x3/gr.svg";
import flagHk from "flag-icons/flags/4x3/hk.svg";
import flagHu from "flag-icons/flags/4x3/hu.svg";
import flagId from "flag-icons/flags/4x3/id.svg";
import flagIe from "flag-icons/flags/4x3/ie.svg";
import flagIl from "flag-icons/flags/4x3/il.svg";
import flagIn from "flag-icons/flags/4x3/in.svg";
import flagIt from "flag-icons/flags/4x3/it.svg";
import flagJp from "flag-icons/flags/4x3/jp.svg";
import flagKe from "flag-icons/flags/4x3/ke.svg";
import flagKr from "flag-icons/flags/4x3/kr.svg";
import flagMx from "flag-icons/flags/4x3/mx.svg";
import flagMy from "flag-icons/flags/4x3/my.svg";
import flagNg from "flag-icons/flags/4x3/ng.svg";
import flagNl from "flag-icons/flags/4x3/nl.svg";
import flagNo from "flag-icons/flags/4x3/no.svg";
import flagNz from "flag-icons/flags/4x3/nz.svg";
import flagPe from "flag-icons/flags/4x3/pe.svg";
import flagPh from "flag-icons/flags/4x3/ph.svg";
import flagPl from "flag-icons/flags/4x3/pl.svg";
import flagPt from "flag-icons/flags/4x3/pt.svg";
import flagRo from "flag-icons/flags/4x3/ro.svg";
import flagRu from "flag-icons/flags/4x3/ru.svg";
import flagSe from "flag-icons/flags/4x3/se.svg";
import flagSg from "flag-icons/flags/4x3/sg.svg";
import flagTh from "flag-icons/flags/4x3/th.svg";
import flagTr from "flag-icons/flags/4x3/tr.svg";
import flagTw from "flag-icons/flags/4x3/tw.svg";
import flagUa from "flag-icons/flags/4x3/ua.svg";
import flagUs from "flag-icons/flags/4x3/us.svg";
import flagVn from "flag-icons/flags/4x3/vn.svg";
import flagZa from "flag-icons/flags/4x3/za.svg";

// Presentation selectors over real listing data: server locations,
// human-labelled links, detected features, per-host FAQ, and the free-plan
// gate. Pure functions, edge-runtime safe.
import { specSummary } from "./specs";
import type { Host } from "./hosts";

// ─── Server locations (detail page + cards) ─────────────────────────────
// Listings that name node locations do it as "Node Locations: X" (sometimes
// just "Locations:"). Returns cleaned place names, [] when unstated.
export function extractLocations(info?: string): string[] {
  if (!info) return [];
  const match = /(?:node\s+)?locations?\s*:\s*([^\n\r]+)/i.exec(info);
  if (!match) return [];
  return [...new Set(
    match[1]
      .split(/[,/&;]|(?:\s+and\s+)/i)
      .map((p) => p.replace(/^[(\[]|[)\].,;:!?]+$/g, "").trim())
      .filter((p) => p && p.length < 40 && !/https?:\/\//i.test(p) && !/renew|sleep|active|server|visit/i.test(p)),
  )].slice(0, 8);
}

export type HostLinkKind = "website" | "panel" | "discord" | "docs" | "github";

export interface ClassifiedLink {
  url: string;
  domain: string;
  kind: HostLinkKind;
  label: string;
}

const LINK_LABELS: Record<HostLinkKind, string> = {
  website: "Website",
  panel: "Panel",
  discord: "Discord",
  docs: "Docs",
  github: "GitHub",
};

function linkDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// Listings store bare URLs in arbitrary order (site/panel/discord shuffled
// per row). Classify each by domain shape so the page reads like a human
// labelled it — Website first, then Panel, Discord, Docs, GitHub.
export function classifyLinks(links: string[]): ClassifiedLink[] {
  const order: Record<HostLinkKind, number> = { website: 0, panel: 1, discord: 2, docs: 3, github: 4 };
  return links
    .map((url): ClassifiedLink => {
      const lower = url.toLowerCase();
      const host = linkDomain(url).toLowerCase();
      let kind: HostLinkKind = "website";
      if (/(^|\.)discord\.(gg|com)(\/|$)/.test(host) || lower.includes("discord.com/invite")) kind = "discord";
      else if (/github\.com/.test(host)) kind = "github";
      else if (/(^|\.)(panel|dash|client|app|billing|console|manage|cpanel|portal|accounts)\./.test(host)) kind = "panel";
      else if (/(^|\.)docs\.|pricing|billing|\/docs(\/|$)/.test(lower)) kind = "docs";
      return { url, domain: linkDomain(url), kind, label: LINK_LABELS[kind] };
    })
    .sort((a, b) => order[a.kind] - order[b.kind] || a.domain.localeCompare(b.domain));
}

// ─── Location flags (badges) ──────────────────────────────────────────────
// Place names/codes from listings → ISO → flag emoji. Unknown places get no
// flag (badge still renders) rather than a wrong one.
const PLACE_TO_ISO: Record<string, string> = {
  germany: "DE", deutschland: "DE", singapore: "SG", finland: "FI",
  poland: "PL", russia: "RU", france: "FR", netherlands: "NL", holland: "NL",
  canada: "CA", "united states": "US", usa: "US", "united kingdom": "GB",
  uk: "GB", england: "GB", spain: "ES", italy: "IT", "south korea": "KR",
  korea: "KR", india: "IN", ukraine: "UA", brazil: "BR", australia: "AU",
  japan: "JP", sweden: "SE", norway: "NO", denmark: "DK", belgium: "BE",
  austria: "AT", switzerland: "CH", czechia: "CZ", "czech republic": "CZ",
  portugal: "PT", greece: "GR", turkey: "TR", mexico: "MX", argentina: "AR",
  "south africa": "ZA", "new zealand": "NZ", ireland: "IE", romania: "RO",
  hungary: "HU", china: "CN", "hong kong": "HK", taiwan: "TW",
  indonesia: "ID", malaysia: "MY", philippines: "PH", thailand: "TH",
  vietnam: "VN", uae: "AE", dubai: "AE", israel: "IL", egypt: "EG",
  nigeria: "NG", kenya: "KE", chile: "CL", colombia: "CO", peru: "PE",
  ca: "CA", nl: "NL", de: "DE", fr: "FR", ru: "RU", fi: "FI", pl: "PL",
  es: "ES", it: "IT", us: "US", sg: "SG", kr: "KR", eu: "EU", se: "SE",
  no: "NO", dk: "DK", be: "BE", at: "AT", ch: "CH", cz: "CZ", pt: "PT",
  gr: "GR", tr: "TR", mx: "MX", br: "BR", au: "AU", jp: "JP", ua: "UA",
  in: "IN", ie: "IE", ro: "RO", hu: "HU", cn: "CN", hk: "HK", tw: "TW",
  id: "ID", my: "MY", ph: "PH", th: "TH", vn: "VN", ae: "AE", il: "IL",
  eg: "EG", ng: "NG",   ke: "KE", cl: "CL", co: "CO", pe: "PE", nz: "NZ", za: "ZA", ar: "AR",
};

/** Bundled flag artwork (flag-icons package, 4x3 SVGs) by ISO code.
 *  Local files — no external requests, works offline and on Windows. */
const FLAG_SRC: Record<string, unknown> = {
  AE: flagAe, AR: flagAr, AT: flagAt, AU: flagAu, BE: flagBe, BR: flagBr,
  CA: flagCa, CH: flagCh, CL: flagCl, CN: flagCn, CO: flagCo, CZ: flagCz,
  DE: flagDe, DK: flagDk, EG: flagEg, ES: flagEs, EU: flagEu, FI: flagFi,
  FR: flagFr, GB: flagGb, GR: flagGr, HK: flagHk, HU: flagHu, ID: flagId,
  IE: flagIe, IL: flagIl, IN: flagIn, IT: flagIt, JP: flagJp, KE: flagKe,
  KR: flagKr, MX: flagMx, MY: flagMy, NG: flagNg, NL: flagNl, NO: flagNo,
  NZ: flagNz, PE: flagPe, PH: flagPh, PL: flagPl, PT: flagPt, RO: flagRo,
  RU: flagRu, SE: flagSe, SG: flagSg, TH: flagTh, TR: flagTr, TW: flagTw,
  UA: flagUa, US: flagUs, VN: flagVn, ZA: flagZa,
};

function assetSrc(mod: unknown): string | null {
  if (typeof mod === "string") return mod;
  const src = (mod as { src?: unknown }).src;
  return typeof src === "string" ? src : null;
}

/** ISO code for a place name/code, or null when unmappable. */
export function locationISO(place: string): string | null {
  const key = place.trim().toLowerCase();
  if (!key) return null;
  const iso = PLACE_TO_ISO[key];
  if (iso && /^[A-Z]{2}$/.test(iso)) return iso;
  if (/^[a-z]{2}$/.test(key) && key !== "en") return key.toUpperCase();
  return null;
}

/** Bundled flag SVG URL for a place name/code, or null when unmappable. */
export function locationFlagSrc(place: string): string | null {
  const iso = locationISO(place);
  if (!iso) return null;
  return assetSrc(FLAG_SRC[iso]);
}
// ─── Free-plan gate (detail page) ─────────────────────────────────────────
// Most rows carry a bare label ("Gaming:", "Coding Plan") or nothing —
// rendering a whole section for that looks auto-generated. Only hosts whose
// plan text has real substance (multi-line or long) get the section.
export function hasSubstantiveFreePlan(freePlan?: string): boolean {
  const text = (freePlan ?? "").trim();
  return text.length > 20;
}

// ─── Feature detection (detail Features section) ──────────────────────────
// Evidence-only: a feature appears only when the listing's own text states
// it (info/free_plan) or when links/targets prove it (Discord link,
// database target). Never invent "Always Online" from silence.

export interface HostFeature {
  id: string;
  title: string;
  text: string;
}

function firstMatchingSentence(text: string, re: RegExp, maxLen = 150): string | null {
  const parts = text
    .split(/[.!?\n]+|\r+/)
    .map((s) => s.replace(/[`*_#>]+/g, "").replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 3);
  for (const s of parts) {
    if (re.test(s)) {
      const clean = s.replace(/^[-–•*]\s*/, "");
      return clean.length > maxLen ? `${clean.slice(0, maxLen - 1).trim()}…` : clean;
    }
  }
  return null;
}

type FeatureHost = Pick<Host, "info" | "free_plan" | "targets" | "links">;

function isAddressOnlyTargets(targets: unknown): boolean {
  const list = (Array.isArray(targets) ? targets : []).map((t) => String(t).toLowerCase());
  return list.length > 0 && list.every((t) => t.includes("domain"));
}

export function detectFeatures(host: FeatureHost): HostFeature[] {
  const text = `${host.info || ""}\n${host.free_plan || ""}`;
  const targets = (host.targets ?? []).map((t) => String(t));
  const links = host.links ?? [];
  const feats: HostFeature[] = [];
  const push = (id: string, title: string, body: string) => {
    if (!feats.some((f) => f.id === id)) feats.push({ id, title, text: body });
  };

  const renew = firstMatchingSentence(text, /renew/i);
  if (renew) {
    push("renew", "Renewable", renew);
  } else {
    const noRenew = firstMatchingSentence(text, /no renewal/i);
    if (noRenew) push("no-renew", "No Renewal Needed", noRenew);
  }

  const sleep = firstMatchingSentence(
    text,
    /sleep|hibernat|shut\s?down|turns?\s+off|goes?\s+offline|offline\s+(when|if|after)|no players?|\binactive\b|\bidle\b|not\s+24\/7|pause/i,
  );
  if (sleep) push("sleep", "Sleeps When Idle", sleep);

  const coins = firstMatchingSentence(text, /coins?|watching ads|\bearn\b/i);
  if (coins) push("coins", "Coin Rewards", coins);

  const slots = firstMatchingSentence(
    text,
    /only can create|max of \d+|maximum of \d+|one server|1 server|single server|servers?[^.]{0,24}(max|limit)|limit[^.]{0,24}servers?/i,
  );
  if (slots) push("slots", "Limited Slots", slots);

  const ports = firstMatchingSentence(text, /allocat|extra\s+ports?|additional\s+ports?|open\s+ports?/i);
  if (ports) push("ports", "Extra Ports", ports);

  const backups = firstMatchingSentence(text, /backups?/i);
  if (backups) push("backups", "Backups Included", backups);

  if (!isAddressOnlyTargets(host.targets)) {
    const sub = firstMatchingSentence(text, /subdomain/i);
    if (sub) push("subdomain", "Custom Subdomain", sub);
  }

  if (targets.some((t) => /database/i.test(t))) {
    const dbSentence = firstMatchingSentence(text, /database/i);
    push("databases", "Free Databases", dbSentence ?? "Database hosting is part of the free plan.");
  }

  if (links.some((l) => /discord\.(gg|com)/i.test(l))) {
    push("discord", "Discord Community", "Get help, updates and support on their Discord server.");
  }

  return feats.slice(0, 6);
}

// ─── Per-host FAQ (detail FAQ section + FAQPage JSON-LD) ───────────────────
// Same evidence rule: conditional questions appear only when the listing
// answers them; the four evergreen ones are always answerable from data.

export interface HostFaqItem {
  q: string;
  a: string;
}

export function buildHostFaq(host: Host): HostFaqItem[] {
  const items: HostFaqItem[] = [];
  const text = `${host.info || ""}\n${host.free_plan || ""}`;
  const specs = specSummary(host);
  const ts = host.created_at ? Date.parse(host.created_at) : NaN;
  const listedYear = Number.isFinite(ts) ? String(new Date(ts).getFullYear()) : null;
  const locations = extractLocations(host.info);
  const hasDiscord = (host.links ?? []).some((l) => /discord\.(gg|com)/i.test(l));

  items.push({
    q: `Is ${host.name} really free?`,
    a: `Yes — ${host.name} lists a free plan${specs ? ` with ${specs}` : ""}.${
      host.trusted ? " It also carries a Trusted badge in our directory." : ""
    }`,
  });

  items.push({
    q: "What do you get on the free plan?",
    a: specs
      ? `${specs}, as published by the provider.`
      : "The provider does not publish fixed numbers — check the plan details on their site linked above.",
  });

  const renew =
    firstMatchingSentence(text, /renew/i) ?? firstMatchingSentence(text, /no renewal/i);
  if (renew) items.push({ q: "Do I need to renew to stay active?", a: renew });

  const sleep = firstMatchingSentence(
    text,
    /sleep|hibernat|shut\s?down|turns?\s+off|goes?\s+offline|offline\s+(when|if|after)|no players?|\binactive\b|\bidle\b|not\s+24\/7|pause/i,
  );
  if (sleep) items.push({ q: "Will it stay online when idle?", a: sleep });

  if (locations.length > 0) {
    items.push({
      q: "Where are the servers located?",
      a: `The listing names ${locations.join(", ")}. Node lineups change, so confirm on their site if location matters to you.`,
    });
  }

  items.push({
    q: "How do I get started?",
    a: `Start on their website through the links on this page.${
      hasDiscord ? " Their Discord server is linked above for support and updates." : ""
    }`,
  });

  items.push({
    q: "Is this information still current?",
    a: `Listings reflect provider pages at review time${
      listedYear ? ` (this one was listed in ${listedYear})` : ""
    }. Free tiers change without notice, so confirm critical limits on the provider's site before committing.`,
  });

  return items;
}
