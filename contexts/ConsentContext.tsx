'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Legal agreement (ToS + Privacy Policy). This is a contractual gate, not a
 * cookie/tracking choice, so it is allowed to block usage of the Services.
 */
export type LegalConsentState = 'unknown' | 'agreed' | 'declined';

/**
 * Cookie preferences. "Necessary" cookies are always on (they are exempt from
 * consent requirements under ePrivacy/GDPR because the site cannot function
 * without them). Everything else defaults to OFF until the user opts in.
 * This choice never blocks access to the site.
 */
export interface CookiePreferences {
  necessary: true;
  analytics: boolean;
}

export type CookieConsentStatus = 'unknown' | 'set';

interface ConsentContextValue {
  // Legal agreement (ToS / Privacy Policy)
  legalConsent: LegalConsentState;
  agreeToLegal: () => void;
  declineLegal: () => void;

  // Cookie preferences
  cookiePrefs: CookiePreferences;
  cookieConsentStatus: CookieConsentStatus;
  acceptAllCookies: () => void;
  rejectNonEssentialCookies: () => void;
  saveCookiePrefs: (prefs: Pick<CookiePreferences, 'analytics'>) => void;

  // UI state
  showCookieBanner: boolean;
  openCookiePreferences: () => void;
  closeCookieBanner: () => void;

  /** Called by FavoritesContext to surface the legal gate mid-session. */
  requestConsent: () => void;
}

const DEFAULT_COOKIE_PREFS: CookiePreferences = {
  necessary: true,
  analytics: false,
};

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

function writeCookie(name: string, value: string, maxAgeSeconds?: number): void {
  try {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    const maxAge = maxAgeSeconds ? `; Max-Age=${maxAgeSeconds}` : '';
    document.cookie = `${name}=${encodeURIComponent(value)}${maxAge}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // Cookie write failed; state still works in-memory for this session.
  }
}

function eraseCookie(name: string): void {
  try {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
  } catch {
    // ignore
  }
}

/** Best-effort removal of Matomo's own cookies when analytics is declined/withdrawn. */
function purgeMatomoCookies(): void {
  if (typeof document === 'undefined') return;
  const names = document.cookie
    .split('; ')
    .map((row) => row.split('=')[0])
    .filter((name) => name.startsWith('_pk_'));
  names.forEach(eraseCookie);
}

const LEGAL_COOKIE = 'fh_legal_consent';
const COOKIE_PREFS_COOKIE = 'fh_cookie_prefs';
const NINETY_DAYS = 90 * 24 * 60 * 60;

function readLegalConsent(): LegalConsentState {
  const value = readCookie(LEGAL_COOKIE);
  if (value === 'agreed') return 'agreed';
  if (value === 'declined') return 'declined';
  return 'unknown';
}

function readCookiePrefs(): { status: CookieConsentStatus; prefs: CookiePreferences } {
  const raw = readCookie(COOKIE_PREFS_COOKIE);
  if (!raw) return { status: 'unknown', prefs: DEFAULT_COOKIE_PREFS };
  try {
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    return {
      status: 'set',
      prefs: {
        necessary: true,
        analytics: parsed.analytics === true,
      },
    };
  } catch {
    return { status: 'unknown', prefs: DEFAULT_COOKIE_PREFS };
  }
}

function writeCookiePrefs(prefs: CookiePreferences): void {
  writeCookie(COOKIE_PREFS_COOKIE, JSON.stringify(prefs), NINETY_DAYS);
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const ConsentContext = createContext<ConsentContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  // Initialize to 'agreed'/'set' during SSR so nothing flashes on first paint.
  // The real values are read from cookies client-side in the effect below.
  const [legalConsent, setLegalConsent] = useState<LegalConsentState>('agreed');
  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences>(DEFAULT_COOKIE_PREFS);
  const [cookieConsentStatus, setCookieConsentStatus] = useState<CookieConsentStatus>('set');
  const [cookieBannerDismissed, setCookieBannerDismissed] = useState(false);

  useEffect(() => {
    setLegalConsent(readLegalConsent());
    const { status, prefs } = readCookiePrefs();
    setCookieConsentStatus(status);
    setCookiePrefs(prefs);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);

  const agreeToLegal = () => {
    writeCookie(LEGAL_COOKIE, 'agreed', NINETY_DAYS);
    setLegalConsent('agreed');
  };

  const declineLegal = () => {
    // Session-length only: no Max-Age, so it clears when the browser closes.
    writeCookie(LEGAL_COOKIE, 'declined');
    setLegalConsent('declined');
  };

  const requestConsent = () => {
    setLegalConsent('unknown');
  };

  const applyCookiePrefs = (prefs: CookiePreferences) => {
    writeCookiePrefs(prefs);
    setCookiePrefs(prefs);
    setCookieConsentStatus('set');
    if (!prefs.analytics) {
      purgeMatomoCookies();
    }
  };

  const acceptAllCookies = () => {
    applyCookiePrefs({ necessary: true, analytics: true });
    setCookieBannerDismissed(true);
  };

  const rejectNonEssentialCookies = () => {
    applyCookiePrefs({ necessary: true, analytics: false });
    setCookieBannerDismissed(true);
  };

  const saveCookiePrefs = (prefs: Pick<CookiePreferences, 'analytics'>) => {
    applyCookiePrefs({ necessary: true, analytics: prefs.analytics });
    setCookieBannerDismissed(true);
  };

  const openCookiePreferences = () => {
    setCookieBannerDismissed(false);
  };

  const closeCookieBanner = () => {
    setCookieBannerDismissed(true);
  };

  // The cookie banner shows once the legal gate is cleared, until the user
  // has made an explicit choice (or has re-opened preferences manually).
  // It never blocks the page underneath it.
  const showCookieBanner =
    legalConsent === 'agreed' && (cookieConsentStatus === 'unknown') && !cookieBannerDismissed;

  return (
    <ConsentContext.Provider
      value={{
        legalConsent,
        agreeToLegal,
        declineLegal,
        cookiePrefs,
        cookieConsentStatus,
        acceptAllCookies,
        rejectNonEssentialCookies,
        saveCookiePrefs,
        showCookieBanner,
        openCookiePreferences,
        closeCookieBanner,
        requestConsent,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (ctx === null) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return ctx;
}
