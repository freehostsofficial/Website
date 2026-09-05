// Shared domain-name extraction from free-text host fields (was pasted in
// HostCard's DomainSection + the OG image route with slight variations).

/** Bare domain-looking tokens, deduped. Handles one-per-line and inline lists. */
export function extractDomainNames(text: string): string[] {
  if (!text) return [];
  const candidates = text
    .split(/[\n,;]+/)
    .flatMap((l) => l.trim().split(/\s+/))
    .map((l) => l.replace(/^[-–•*]+/, '').trim().replace(/[.,;:!?)]+$/, ''))
    .filter((l) => /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/.test(l) && !/^\d+\.\d+$/.test(l));
  return Array.from(new Set(candidates));
}
