// Static locale-code → language-name map.
//
// Deliberately NOT Intl.DisplayNames: server (full-ICU Node) and browsers
// (varying ICU builds) resolve ambiguous codes differently — e.g. "KR"
// rendered "Kanuri" on the server but "KR" on the client, breaking hydration
// on every locale <option>. A static map is byte-identical everywhere.
// Codes here are the *country* languages hosts mean (KR = Korean).
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  ru: "Russian",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  kr: "Korean",
  nl: "Dutch",
  ph: "Filipino",
  pl: "Polish",
  pt: "Portuguese",
  uk: "Ukrainian",
  cn: "Chinese",
  ua: "Ukrainian",
  tr: "Turkish",
  hi: "Hindi",
  ar: "Arabic",
  ja: "Japanese",
  zh: "Chinese",
  ko: "Korean",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  el: "Greek",
  he: "Hebrew",
  hu: "Hungarian",
  cs: "Czech",
  sk: "Slovak",
  ro: "Romanian",
  bg: "Bulgarian",
  hr: "Croatian",
  sr: "Serbian",
  id: "Indonesian",
  ms: "Malay",
  th: "Thai",
  vi: "Vietnamese",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali",
  mr: "Marathi",
  ur: "Urdu",
  fa: "Persian",
  sw: "Swahili",
  ca: "Catalan",
  eu: "Basque",
  gl: "Galician",
};

/**
 * Resolves a locale code (e.g. "EN", "PT-BR") to a human-readable language
 * name. Unknown codes fall back to the uppercased code itself — always
 * deterministic, server and client render the same string.
 */
export function getLanguageName(locale: string): string {
  if (!locale) return locale;
  const primary = locale.split(/[-_]/)[0].toLowerCase();
  return LANGUAGE_NAMES[primary] ?? primary.toUpperCase();
}
