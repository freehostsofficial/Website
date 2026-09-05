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
  // Only strip real tags (letter after <), so "a < b" and bare ">" survive.
  return decodeEntities(html.replace(/<\/?[a-zA-Z][^<>]*>/g, "")).replace(/\s+/g, " ").trim();
}

function absolutize(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

/** Inline-level conversion: links, emphasis, code, images, line breaks. */
function attrValue(tag: string, name: string): string {
  const re = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'\\\`>=]+))`, "i");
  const m = re.exec(tag);
  return m?.[1] ?? m?.[2] ?? m?.[3] ?? "";
}

function inlineMd(html: string, base: string): string {
  let out = html;
  // Images first (they contain no nested markup we care about).
  out = out.replace(/<img\b[^<>]*>/gi, (tag) => {
    const alt = attrValue(tag, "alt");
    const src = attrValue(tag, "src");
    if (!src || src.startsWith("data:")) return alt;
    return `![${stripTags(alt)}](${absolutize(src, base)})`;
  });
  out = out.replace(/<br\s*\/?>/gi, "\n");
  out = out.replace(/<(strong|b)\b[^<>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner) => `**${stripTags(inner)}**`);
  out = out.replace(/<(em|i)\b[^<>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner) => `*${stripTags(inner)}*`);
  out = out.replace(/<code\b[^<>]*>([\s\S]*?)<\/code>/gi, (_, inner) => `\`${stripTags(inner)}\``);
  out = out.replace(/<a\b[^<>]*>([\s\S]*?)<\/a>/gi, (full, inner) => {
    const href = attrValue(full, "href");
    const text = stripTags(inner);
    if (!text || !href) return text;
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
function listMd(tag: string, inner: string, base: string): string {
  const items: string[] = [];
  const liRe = /<li\b[^<>]*>([\s\S]*?)<\/li>/gi;
  let li: RegExpExecArray | null;
  let i = 0;
  while ((li = liRe.exec(inner)) !== null) {
    i += 1;
    // Keep nested list text instead of dropping it: flatten to a continuation line.
    const nested = /<(ul|ol)\b[^<>]*>([\s\S]*?)<\/\1>/gi;
    let nestedText = "";
    const flat = li[1].replace(nested, (_m, _t, nInner) => {
      nestedText += `\n  ${listMd(_t, nInner, base).split("\n").join("\n  ")}`;
      return "";
    });
    const text = inlineMd(flat, base) + nestedText;
    items.push(tag === "ol" ? `${i}. ${text}` : `- ${text}`);
  }
  return items.join("\n");
}

function bodyMd(contentHtml: string, base: string): string {
  let html = contentHtml ?? "";
  // Void <input> has no closing tag — strip it alone. Keep labels of other controls.
  html = html.replace(/<input\b[^<>]*\/?>/gi, "");
  html = html.replace(/<(textarea|select|button)\b[^<>]*>([\s\S]*?)<\/\1>/gi, "$2");
  html = html.replace(/<form\b[^<>]*>|<\/form>/gi, "");

  const blocks: string[] = [];
  // Walk block elements in document order via a single scanner.
  const push = (md: string) => {
    const clean = md.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (clean) blocks.push(clean);
  };

  const blockRe = /<(h[1-6]|pre|table|blockquote|ul|ol|p|hr)\b[^<>]*>(?:([\s\S]*?)<\/\1>)?/gi;
  let m: RegExpExecArray | null;
  let lastIndex = 0;
  const flushText = (chunk: string) => {
    const text = stripTags(chunk);
    if (text) push(text);
  };
  while ((m = blockRe.exec(html)) !== null) {
    flushText(html.slice(lastIndex, m.index));
    const tag = m[1].toLowerCase();
    const inner = m[2] ?? "";
    const full = m[0];
    if (tag.startsWith("h")) {
      const level = Number(tag[1]);
      push(`${"#".repeat(level)} ${inlineMd(inner, base)}`);
    } else if (tag === "pre") {
      push(`\`\`\`\n${stripTags(inner)}\n\`\`\``);
    } else if (tag === "table") {
      push(tableMd(inner, base));
    } else if (tag === "blockquote") {
      const quoted = inlineMd(inner, base).split("\n").map((l: string) => `> ${l}`).join("\n");
      push(quoted);
    } else if (tag === "ul" || tag === "ol") {
      push(listMd(tag, inner, base));
    } else if (tag === "hr") {
      push("---");
    } else if (tag === "p") {
      push(inlineMd(inner, base));
    }
    void full;
    lastIndex = blockRe.lastIndex;
  }
  flushText(html.slice(lastIndex));

  return blocks.join("\n\n");
}

function extractMeta(html: string, base: string): { title: string; description: string; image: string } {
  const src = html ?? "";
  const title = /<title>([\s\S]*?)<\/title>/i.exec(src)?.[1] ?? "";
  const metaContent = (key: string, value: string): string => {
    // Matches <meta name="x" content="y"> in either attribute order, either quote style.
    const re = new RegExp(`<meta\\b[^<>]*?(?:${key}\\s*=\\s*(?:"${value}"|'${value}'|${value})[^<>]*?content\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))|content\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))[^<>]*?${key}\\s*=\\s*(?:"${value}"|'${value}'|${value}))`, "i");
    const mm = re.exec(src);
    return mm?.[1] ?? mm?.[2] ?? mm?.[3] ?? mm?.[4] ?? mm?.[5] ?? mm?.[6] ?? "";
  };
  const description = metaContent("name", "description") || metaContent("property", "og:description");
  const imageRaw = metaContent("property", "og:image");
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

function yamlString(value: string): string {
  return JSON.stringify(value);
}

export function htmlToMarkdown(html: string | null | undefined, pageUrl: string): string {
  if (!html) return `# ${pageUrl}\n`;
  const meta = extractMeta(html, pageUrl);
  const body = bodyMd(mainContent(html), pageUrl);
  const jsonLd = extractJsonLd(html);

  const parts: string[] = [];
  const frontmatter: string[] = [];
  if (meta.title) frontmatter.push(`title: ${yamlString(meta.title)}`);
  if (meta.description) frontmatter.push(`description: ${yamlString(meta.description)}`);
  if (meta.image) frontmatter.push(`image: ${yamlString(meta.image)}`);
  if (frontmatter.length > 0) parts.push(`---\n${frontmatter.join("\n")}\n---`);
  if (body) parts.push(body);
  if (jsonLd.length > 0) parts.push(`\`\`\`json\n${jsonLd.join("\n")}\n\`\`\``);
  if (parts.length === 0) parts.push(`# ${pageUrl}`);
  return parts.join("\n\n") + "\n";
}
