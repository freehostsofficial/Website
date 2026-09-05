import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Agent content negotiation (see skill: markdown-negotiation).
//
// Requests whose Accept header explicitly includes `text/markdown` are
// rewritten to /api/md/<path>, which returns a Markdown representation with
// `Content-Type: text/markdown`. Everything else passes through to HTML.
//
// Security headers and Cache-Control tiers live in next.config.ts; this
// proxy only negotiates the representation.

function wantsMarkdown(request: NextRequest): boolean {
  // Internal HTML fetch performed by /api/md itself — never rewrite.
  if (request.nextUrl.searchParams.has("__md")) return false;
  const accept = request.headers.get("accept") ?? "";
  return accept.toLowerCase().includes("text/markdown");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "GET" && wantsMarkdown(request)) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/md${pathname === "/" ? "" : pathname}`;
    url.searchParams.delete("__md");
    const res = NextResponse.rewrite(url);
    res.headers.set("Vary", "Accept");
    return res;
  }

  // Plain HTML responses vary by Accept too, so shared caches keep the two
  // representations separate instead of serving HTML to markdown requesters.
  const res = NextResponse.next();
  res.headers.set("Vary", "Accept");
  return res;
}

export const config = {
  matcher: [
    // Page routes only: skip APIs, Next internals, files (sitemap.xml,
    // robots.txt, icons…), well-known, and the OG image route (returns image/png).
    "/((?!.well-known|api|_next|hosts/og|.*\\..*).*)",
  ],
};
