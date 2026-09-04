import { NextResponse } from "next/server";

// Server-side Discord presence proxy.
//
// Why this exists: the homepage shows a live member count. Fetching
// discord.com directly from the browser would expose every visitor's IP
// address to Discord (US) before any consent choice. Proxying server-side
// means Discord only ever sees our server, so no visitor data leaves the EU
// for this widget and no consent is needed for it.
//
// Cached for 5 minutes — member counts don't need to be fresher than that.

export const revalidate = 300;

const INVITE_URL =
  "https://discord.com/api/v9/invites/QbeZ3b5CQd?with_counts=true&with_expiration=true";
const WIDGET_URL =
  "https://discord.com/api/guilds/1221389187719102514/widget.json";

type DiscordPayload = {
  guild?: { name?: string };
  name?: string;
  approximate_member_count?: number | null;
  approximate_presence_count?: number | null;
  presence_count?: number | null;
  members?: unknown[];
};

async function fetchJson(url: string): Promise<DiscordPayload | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as DiscordPayload;
  } catch {
    return null;
  }
}

export async function GET() {
  // Source 1: invite endpoint (member count).
  const invite = await fetchJson(INVITE_URL);
  if (invite) {
    const count =
      invite.approximate_member_count ??
      invite.approximate_presence_count ??
      (Array.isArray(invite.members) ? invite.members.length : null);
    if (count !== null && count !== undefined) {
      return NextResponse.json({
        name: invite.guild?.name ?? "Discord",
        count,
      });
    }
  }

  // Source 2: widget endpoint (presence count fallback).
  const widget = await fetchJson(WIDGET_URL);
  if (widget) {
    const count =
      widget.presence_count ??
      (Array.isArray(widget.members) ? widget.members.length : null);
    return NextResponse.json({ name: widget.name ?? "Discord", count });
  }

  return NextResponse.json({ name: "Discord", count: null });
}
