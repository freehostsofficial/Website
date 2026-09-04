import { NextResponse } from "next/server";
import { htmlToMarkdown, estimateTokens } from "@/lib/markdown";

// Agent content negotiation endpoint. The middleware rewrites page requests
// carrying `Accept: text/markdown` here; this handler fetches the page's own
// HTML server-side (?__md=1 bypasses the middleware rewrite) and converts it.
//
// Response mirrors Cloudflare's "Markdown for Agents" shape: text/markdown
// body + x-markdown-tokens header.

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const originalPath = "/" + (slug ?? []).join("/");

  const incoming = new URL(request.url);
  const origin = `${incoming.protocol}//${incoming.host}`;
  const sourceUrl = `${origin}${originalPath}?__md=1`;

  let html: string;
  let status = 200;
  try {
    const res = await fetch(sourceUrl, {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(15000),
      next: { revalidate: 300 },
    });
    status = res.status;
    html = await res.text();
  } catch {
    return new NextResponse("# Service unavailable\n", {
      status: 502,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
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

  const pageUrl = `${origin}${originalPath}`;
  const markdown = htmlToMarkdown(html, pageUrl);

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Vary": "Accept",
      "x-markdown-tokens": String(estimateTokens(markdown)),
      // Same freshness as the directory HTML tiers in next.config.ts.
      "Cache-Control": "public, max-age=1800, s-maxage=43200, stale-while-revalidate=604800",
    },
  });
}
