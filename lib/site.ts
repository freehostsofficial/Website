// Single source of truth for site env with safe fallbacks.
// Never throws: every export resolves even when env is missing (build-safe).

function cleanOrigin(raw: string | undefined, fallback: string): string {
  const candidate = (raw ?? fallback).trim() || fallback;
  try {
    return new URL(candidate).origin;
  } catch {
    try {
      return new URL(`https://${candidate}`).origin;
    } catch {
      return fallback;
    }
  }
}

export const SITE_URL = cleanOrigin(process.env.APP_URL, "https://freehosts.eu");
export const RAW_SITE = (process.env.RAW_APP_URL ?? "freehosts.eu").trim() || "freehosts.eu";
export const EMAIL_DOMAIN_SAFE = (process.env.EMAIL_DOMAIN ?? "freehosts.eu").trim() || "freehosts.eu";
export const SUPPORT_EMAIL = `support@${EMAIL_DOMAIN_SAFE}`;
export const LEGAL_EMAIL = `legal@${EMAIL_DOMAIN_SAFE}`;
export const TRUST_PILOT_URL = process.env.TRUST_PILOT ?? "https://trustpilot.com/review/freehosts.eu";
export const API_BASE = process.env.API_URL?.replace(/\/$/, "");
export const DISCORD_INVITE = "https://discord.gg/QbeZ3b5CQd";

export function siteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// djb2 content hash (base36): cache-busting versions for immutable assets.
// Any input change flips the version, so the CDN can cache each URL forever.
export function contentHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}
