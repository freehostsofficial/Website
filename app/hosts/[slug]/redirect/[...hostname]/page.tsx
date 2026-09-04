// Interstitial warning page, never publicly cacheable (per-user navigation,
// no-store is set via Cache-Control headers in next.config.ts).
export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { fetchHosts } from '../../../../../lib/hosts';
import { slugify } from '../../../../../lib/slugify';
import RedirectClient from './RedirectClient';

function extractDomain(urlOrPath: string): string {
  try {
    // Decode any percent-encoding first so bypass attempts like
    // evil%2ecom, evil%40discord.gg, or discord.gg%2F@evil.com are normalised
    // before we inspect the value.
    const decoded = decodeURIComponent(urlOrPath);

    // Always parse through the URL constructor for consistent, spec-compliant
    // hostname extraction — add a scheme if one is missing.
    const withScheme =
      decoded.startsWith('http://') || decoded.startsWith('https://')
        ? decoded
        : `https://${decoded}`;

    const url = new URL(withScheme);

    // url.hostname strips port, credentials (@), and path — exactly what we want.
    // Convert to ASCII (Punycode) to block IDN homograph attacks where a
    // visually identical Unicode character is used instead of the ASCII one.
    // e.g. "dіscord.gg" (Cyrillic і) must not match "discord.gg"
    const ascii = url.hostname.toLowerCase();

    // Reject if the hostname contains non-ASCII characters after normalisation
    // (means it's an IDN that wasn't punycode-encoded — treat as invalid)
    if (/[^\x00-\x7F]/.test(ascii)) return '';

    return ascii;
  } catch {
    // URL constructor threw — malformed input, reject it
    return '';
  }
}

function isValidRedirect(hostnameOrPath: string, allowedLinks: string[]): boolean {
  const targetDomain = extractDomain(hostnameOrPath);

  if (!targetDomain) return false;

  // Extract domains from all allowed links — exact match only
  const allowedDomains = allowedLinks.map(link => extractDomain(link)).filter(Boolean);

  return allowedDomains.some(allowed => targetDomain === allowed);
}

function buildTargetUrl(hostnameSegments: string[]): string {
  // Segments from Next.js are already decoded by the router.
  // Re-join with '/' to reconstruct the full path including any
  // query string that was encoded into the last segment by the client.
  const hostnameOrPath = hostnameSegments
    .map(s => decodeURIComponent(s))
    .join('/');

  try {
    const withScheme =
      hostnameOrPath.startsWith('http://') || hostnameOrPath.startsWith('https://')
        ? hostnameOrPath
        : `https://${hostnameOrPath}`;

    const url = new URL(withScheme);
    url.searchParams.set('ref', process.env.RAW_APP_URL ?? "freehosts.eu");
    return url.toString();
  } catch {
    // Malformed URL — should never reach here since isValidRedirect already
    // validated it, but fall back to a safe no-op
    return '#';
  }
}

type Props = { params: Promise<{ slug: string; hostname: string[] }> };

export default async function Page({ params }: Props) {
  const { slug, hostname: hostnameSegments } = await params;
  
  if (!slug || !hostnameSegments || hostnameSegments.length === 0) {
    notFound();
  }
  
  // Fetch the host to validate the redirect
  const host = (await fetchHosts()).find(h => slugify(h.name) === slug) ?? null;
  
  if (!host) {
    notFound();
  }
  
  const hostnameOrPath = hostnameSegments.map(s => decodeURIComponent(s)).join('/');
  const backUrl = `/hosts/${slug}`;

  // Validate that the redirect URL is in the host's allowed links
  const valid = isValidRedirect(hostnameOrPath, host.links);

  if (!valid) {
    // Show the invalid redirect warning page — do NOT redirect away,
    // so the user can see what URL was attempted and understand the risk.
    return (
      <RedirectClient
        targetUrl=""
        hostnameOrPath={hostnameOrPath}
        backUrl={backUrl}
        invalid
      />
    );
  }

  const targetUrl = buildTargetUrl(hostnameSegments);

  return <RedirectClient targetUrl={targetUrl} hostnameOrPath={hostnameOrPath} backUrl={backUrl} />;
}
