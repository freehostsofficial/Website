/**
 * Resolves a locale code (e.g. "EN", "PT-BR") to a human-readable language name.
 */
const dn = new Intl.DisplayNames(['en'], { type: 'language' })

export function getLanguageName(locale: string): string {
  if (!locale) return locale
  const c = [locale.toLowerCase(), locale.toUpperCase(), locale.split(/[-_]/)[0].toLowerCase()]
  for (const candidate of c) {
    try {
      const name = dn.of(candidate)
      if (name && name.toLowerCase() !== candidate.toLowerCase()) return name
    } catch { }
  }
  return locale
}
