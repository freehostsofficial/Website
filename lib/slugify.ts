/**
 * Converts a host name to a URL-safe slug.
 * Pure function, edge-runtime safe.
 *
 * Steps:
 * 1. Lowercase
 * 2. Replace whitespace sequences with a single hyphen
 * 3. Remove characters that are not [a-z0-9-]
 * 4. Collapse consecutive hyphens into one
 * 5. Strip leading/trailing hyphens
 */
export function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'host';
}
