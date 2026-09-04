// Shared URL guards.

/** The href if it's an http(s) URL, otherwise the fallback. Never throws. */
export function safeHttpUrl(href: string, fallback = '#'): string {
  try {
    const parsed = new URL(href);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return href;
  } catch {
    // malformed URL — fall through
  }
  return fallback;
}

/** `true` only for http(s) URLs — javascript:/data: never pass. */
export function isHttpUrl(href: string): boolean {
  return safeHttpUrl(href, '') !== '';
}
