const displayNames = new Intl.DisplayNames(['en'], { type: 'language' })

/**
 * Resolves a locale code (e.g. "EN", "PT-BR", "zh-Hans") to a human-readable
 * language name using the browser/Node Intl API — no hardcoded map needed.
 * Works with any locale the host data contains, now or in the future.
 */
export function getLanguageName(locale: string): string {
  if (!locale) return locale

  // Try the code as-is (lowercased for BCP 47 compliance), then just the
  // primary language subtag if the full tag fails.
  const candidates = [
    locale.toLowerCase(),
    locale.split(/[-_]/)[0].toLowerCase(),
  ]

  for (const candidate of candidates) {
    try {
      const name = displayNames.of(candidate)
      // Intl returns the tag itself when it can't resolve — skip those
      if (name && name.toLowerCase() !== candidate.toLowerCase()) {
        return name
      }
    } catch {
      // invalid tag — try next candidate
    }
  }

  // Fall back to the original code if nothing resolved
  return locale
}
