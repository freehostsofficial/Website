// Minimal HTML → Markdown converter for agent content negotiation.
//
// No dependencies on purpose: it only ever parses HTML this same app renders,
// so a small purpose-built walker beats a generic library. Output mirrors
// Cloudflare's "Markdown for Agents" shape: YAML frontmatter (title,
// description, image) + body Markdown + JSON-LD as a fenced json block.

const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&ldquo;": "\u201C",
  "&rdquo;": "\u201D",
  "&lsquo;": "\u2018",
  "&rsquo;": "\u2019",
  "&mdash;": "\u2014",
  "&ndash;": "\u2013",
  "&hellip;": "\u2026",
};

export function decodeEntities(text: string): string {
  return text.replace(/&(?:amp|lt|gt|quot|#39|apos|nbsp|ldquo|rdquo|lsquo|rsquo|mdash|ndash|hellip);/g, (m) => ENTITY_MAP[m] ?? m);
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

function absolutize(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

/** Inline-level conversion: links, emphasis, code, images, line breaks. */
function inlineMd(html: string, base: string): string {
  let out = html;
  // Images first (they contain no nested markup we care about).
  out = out.replace(/<img\b[^>]*>/gi, (tag) => {
    const alt = /alt="([^"]*)"/i.exec(tag)?.[1] ?? "";
    const src = /src="([^"]*)"/i.exec(tag)?.[1] ?? "";
    if (!src || src.startsWith("data:")) return alt;
    return `![${stripTags(alt)}](${absolutize(src, base)})`;
  });
  out = out.replace(/<br\s*\/?>/gi, "\n");
  out = out.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner) => `**${stripTags(inner)}**`);
  out = out.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner) => `*${stripTags(inner)}*`);
  out = out.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, inner) => `\`${stripTags(inner)}\``);
  out = out.replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, inner) => {
    const text = stripTags(inner);
    if (!text) return "";
    return `[${text}](${absolutize(href, base)})`;
  });
  return stripTags(out);
}

function tableMd(tableHtml: string, base: string): string {
  const rows: string[][] = [];
  const rowRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRe.exec(tableHtml)) !== null) {
    const cells: string[] = [];
    const cellRe = /<(th|td)\b[^>]*>([\s\S]*?)<\/\1>/gi;
    let cellMatch: RegExpExecArray | null;
    while ((cellMatch = cellRe.exec(rowMatch[1])) !== null) {
      cells.push(inlineMd(cellMatch[2], base).replace(/\|/g, "\\|"));
    }
    if (cells.length > 0) rows.push(cells);
  }
  if (rows.length === 0) return "";
  const header = rows[0];
  const lines = [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.slice(1).map((r) => `| ${r.join(" | ")} |`),
  ];
  return lines.join("\n");
}

/** Block-level conversion over the main content HTML. */
function bodyMd(contentHtml: string, base: string): string {
  let html = contentHtml;
  // Drop interactive / non-content controls but keep their labels where present.
  html = html.replace(/<(input|textarea|select|button)\b[^>]*>([\s\S]*?)<\/\1>/gi, "$2");
  html = html.replace(/<(input|img)\b[^>]*\/?>/gi, "");
  html = html.replace(/<form\b[^>]*>|<\/form>/gi, "");

  const blocks: string[] = [];
  // Walk block elements in pattern order (matches this site's content flow).
  const push = (md: string) => {
    const clean = md.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (clean) blocks.push(clean);
  };

  // Headings
  html = html.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
    push(`${"#".repeat(Number(level))} ${inlineMd(inner, base)}`);
    return "";
  });
  // Code blocks
  html = html.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, inner) => {
    push(`\`\`\`\n${stripTags(inner)}\n\`\`\``);
    return "";
  });
  // Tables
  html = html.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (_, inner) => {
    push(tableMd(inner, base));
    return "";
  });
  // Blockquotes
  html = html.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const quoted = inlineMd(inner, base).split("\n").map((l: string) => `> ${l}`).join("\n");
    push(quoted);
    return "";
  });
  // Lists (one nesting level, the depth this site's content uses)
  html = html.replace(/<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, inner) => {
    const items: string[] = [];
    const liRe = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
    let li: RegExpExecArray | null;
    let i = 0;
    while ((li = liRe.exec(inner)) !== null) {
      i += 1;
      const text = inlineMd(li[1].replace(/<(ul|ol)\b[^>]*>[\s\S]*?<\/\1>/gi, ""), base);
      items.push(tag === "ol" ? `${i}. ${text}` : `- ${text}`);
    }
    push(items.join("\n"));
    return "";
  });
  // Horizontal rules
  html = html.replace(/<hr\b[^>]*\/?>/gi, () => {
    push("---");
    return "";
  });
  // Paragraphs
  html = html.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
    push(inlineMd(inner, base));
    return "";
  });
  // Whatever block text remains (divs/sections already unwrapped of headings etc.)
  const rest = stripTags(html);
  if (rest) push(rest);

  // Drop empty leftovers, keep document order (approximate: headings/tables/
  // lists emitted in pattern order, which matches this site's content flow).
  return blocks.join("\n\n");
}

function extractMeta(html: string, base: string): { title: string; description: string; image: string } {
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "";
  const meta = (attr: string, name: string) =>
    new RegExp(`<meta\\s+${attr}="${name}"\\s+content="([^"]*)"`, "i").exec(html)?.[1] ?? "";
  const description = meta("name", "description") || meta("property", "og:description");
  const imageRaw = meta("property", "og:image");
  return {
    title: stripTags(title),
    description: stripTags(description),
    image: imageRaw ? absolutize(imageRaw, base) : "",
  };
}

function extractJsonLd(html: string): string[] {
  const out: string[] = [];
  const re = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const json = decodeEntities(m[1]).trim();
    if (json) out.push(json);
  }
  return out;
}

function mainContent(html: string): string {
  // Prefer <main>, fall back to <body>.
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1];
  const scope = main ?? /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(html)?.[1] ?? html;
  // Strip chrome: navigation, header/footer, scripts, styles, consent UI,
  // modals, previews, and theme/client-only helpers.
  return scope
    .replace(/<header\b[^>]*>[\s\S]*?<\/header\s*>/gi, "")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer\s*>/gi, "")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav\s*>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript\s*>/gi, "");
}

/** Rough token estimate (mirrors the ~4 chars/token rule of thumb). */
export function estimateTokens(markdown: string): number {
  return Math.max(1, Math.ceil(markdown.length / 4));
}

export function htmlToMarkdown(html: string, pageUrl: string): string {
  const meta = extractMeta(html, pageUrl);
  const body = bodyMd(mainContent(html), pageUrl);
  const jsonLd = extractJsonLd(html);

  const parts: string[] = [];
  const frontmatter: string[] = [];
  if (meta.title) frontmatter.push(`title: ${meta.title}`);
  if (meta.description) frontmatter.push(`description: ${meta.description}`);
  if (meta.image) frontmatter.push(`image: ${meta.image}`);
  if (frontmatter.length > 0) parts.push(`---\n${frontmatter.join("\n")}\n---`);
  if (body) parts.push(body);
  if (jsonLd.length > 0) parts.push(`\`\`\`json\n${jsonLd.join("\n")}\n\`\`\``);
  if (parts.length === 0) parts.push(`# ${pageUrl}`);
  return parts.join("\n\n") + "\n";
}
