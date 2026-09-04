// Shared cookie helpers (were duplicated in FavoritesContext + ConsentContext).

export function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

export function writeCookie(name: string, value: string, maxAgeSeconds?: number): void {
  try {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    const age = maxAgeSeconds !== undefined ? `; Max-Age=${maxAgeSeconds}` : '';
    document.cookie = `${name}=${encodeURIComponent(value)}${age}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // Cookie write failed (e.g., cookies disabled); state still works in-memory.
  }
}

export function deleteCookie(name: string): void {
  try {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
  } catch {
    // ignore — storage unavailable
  }
}

// ─── Consent-specific storage ───────────────────────────────────────────────
// Per-category consent model for the cookie banner. Non-essential storage
// keys live here so disabling a category reliably clears everything.

export interface PreferenceSelection {
  theme: boolean;
  favorites: boolean;
  comparison: boolean;
}

export interface ConsentSelection {
  preferences: PreferenceSelection;
  statistics: boolean;
}

export const CONSENT_COOKIE = 'fh_consent';
export const CONSENT_VERSION = 2;
export const FAVORITES_COOKIE = 'fh_favorites';
export const THEME_STORAGE_KEY = 'fh_theme';
export const COMPARISON_STORAGE_KEY = 'fh_comparison';

const ALL_OFF: ConsentSelection = {
  preferences: { theme: false, favorites: false, comparison: false },
  statistics: false,
};

const ALL_ON: ConsentSelection = {
  preferences: { theme: true, favorites: true, comparison: true },
  statistics: true,
};

function isPreferenceSelection(value: unknown): value is PreferenceSelection {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.theme === 'boolean' &&
    typeof v.favorites === 'boolean' &&
    typeof v.comparison === 'boolean'
  );
}

/** Stored choice, or null when the visitor hasn't decided yet. */
export function readConsentSelection(): ConsentSelection | null {
  const raw = readCookie(CONSENT_COOKIE);
  if (!raw) return null;
  // Legacy single-value cookie from the old accept/decline banner.
  if (raw === 'accepted') return ALL_ON;
  if (raw === 'declined') return ALL_OFF;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const p = parsed as { v?: unknown; preferences?: unknown; statistics?: unknown };
    // v1: one boolean for the whole preferences category — expand to per-cookie.
    if (p.v === 1 && typeof p.preferences === 'boolean' && typeof p.statistics === 'boolean') {
      const on = p.preferences;
      return {
        preferences: { theme: on, favorites: on, comparison: on },
        statistics: p.statistics,
      };
    }
    if (
      p.v === CONSENT_VERSION &&
      isPreferenceSelection(p.preferences) &&
      typeof p.statistics === 'boolean'
    ) {
      return { preferences: p.preferences, statistics: p.statistics };
    }
    return null;
  } catch {
    return null;
  }
}

/** Synchronous check used at write time so declined cookies are never persisted. */
export function isPreferenceAllowed(key: keyof PreferenceSelection): boolean {
  return readConsentSelection()?.preferences[key] ?? false;
}

/** Wipe everything a declined cookie may have stored. */
export function clearNonEssentialStorage(selection: ConsentSelection): void {
  if (!selection.preferences.favorites) deleteCookie(FAVORITES_COOKIE);
  if (!selection.preferences.theme) {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      // storage unavailable
    }
  }
  if (!selection.preferences.comparison) {
    try {
      sessionStorage.removeItem(COMPARISON_STORAGE_KEY);
    } catch {
      // storage unavailable
    }
  }
}
