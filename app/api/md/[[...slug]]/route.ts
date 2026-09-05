import { NextResponse } from "next/server";
import { cacheLife } from "next/cache";
import { htmlToMarkdown, estimateTokens } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";

// Agent content negotiation endpoint. The proxy rewrites page requests
// carrying `Accept: text/markdown` here; this handler fetches the page's own
// HTML server-side (?__md=1 bypasses the proxy rewrite) and converts it.
//
// Response mirrors Cloudflare's "Markdown for Agents" shape: text/markdown
// body + x-markdown-tokens header.

// Same-origin HTML, cached 30 min: matches the HOSTS_CACHE s-maxage in
// next.config.ts so the CDN and the data cache agree on staleness —
// no output-older-than-input gap.
async function getPageHtml(sourceUrl: string): Promise<{ status: number; html: string }> {
  "use cache";
  cacheLife({ stale: 1800, revalidate: 1800, expire: 86400 });
  const res = await fetch(sourceUrl, {
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(15000),
  });
  return { status: res.status, html: await res.text() };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const originalPath = "/" + (slug ?? []).join("/");

  const incoming = new URL(request.url);
  const qs = new URLSearchParams(incoming.search);
  qs.delete("__md");
  qs.set("__md", "1");
  const origin = SITE_URL;
  const sourceUrl = `${origin}${originalPath}?${qs.toString()}`;

  let html: string;
  let status = 200;
  try {
    ({ status, html } = await getPageHtml(sourceUrl));
  } catch {
    return new NextResponse("# Service unavailable\n", {
      status: 502,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  if (status === 404) {
    return new NextResponse(`# Not found\n\nNo page exists at ${originalPath}.\n`, {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Vary": "Accept",
      },
    });
  }

  if (status < 200 || status >= 300) {
    return new Response(`# Error\n\nUpstream returned ${status} for ${originalPath}.\n`, {
      status,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "no-store",
        "Vary": "Accept",
      },
    });
  }

  const pageUrl = `${origin}${originalPath}`;
  const markdown = htmlToMarkdown(html, pageUrl);

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Vary": "Accept",
      "x-markdown-tokens": String(estimateTokens(markdown)),
      // Cache-Control comes from next.config.ts (/api/md/:path* source) —
      // the single place CDN tiers are defined.
    },
  });
}
