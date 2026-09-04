'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import {
  writeCookie,
  readConsentSelection,
  clearNonEssentialStorage,
  CONSENT_COOKIE,
  CONSENT_VERSION,
  type ConsentSelection,
} from '../lib/cookies';

// ─── Types ────────────────────────────────────────────────────────────────────

export type { ConsentSelection };
export type BannerView = 'main' | 'customize';

interface ConsentContextValue {
  /** Stored choice, or null when the visitor hasn't decided yet. */
  selection: ConsentSelection | null;
  acceptAll: () => void;
  rejectAll: () => void;
  saveSelection: (selection: ConsentSelection) => void;
  bannerOpen: boolean;
  bannerView: BannerView;
  openBanner: (view?: BannerView) => void;
  closeBanner: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// 180 days: consent must be renewable, not eternal (CNIL guidance).
const MAX_AGE = 180 * 24 * 60 * 60;

function load(): ConsentSelection | null {
  return readConsentSelection();
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const ConsentContext = createContext<ConsentContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  // SSR default null = banner hidden: returners with a stored choice never
  // see a flash, first-timers get the notice after hydration (fixed overlay,
  // so no layout shift either way).
  const [selection, setSelection] = useState<ConsentSelection | null>(null);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [bannerView, setBannerView] = useState<BannerView>('main');

  // Mount-hydrate from the cookie (same pattern as usePersistentState).
  useEffect(() => {
    const stored = load();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelection(stored);
    if (stored === null) setBannerOpen(true);
  }, []);

  const persist = useCallback((next: ConsentSelection) => {
    writeCookie(
      CONSENT_COOKIE,
      JSON.stringify({ v: CONSENT_VERSION, ts: new Date().toISOString(), ...next }),
      MAX_AGE,
    );
    // A declined category must not keep anything it stored before.
    clearNonEssentialStorage(next);
    // Legacy single-value cookie, if present, is overwritten above (same name).
    setSelection(next);
    setBannerOpen(false);
  }, []);

  const acceptAll = useCallback(
    () =>
      persist({
        preferences: { theme: true, favorites: true, comparison: true },
        statistics: true,
      }),
    [persist],
  );

  const rejectAll = useCallback(
    () =>
      persist({
        preferences: { theme: false, favorites: false, comparison: false },
        statistics: false,
      }),
    [persist],
  );

  const saveSelection = useCallback(
    (next: ConsentSelection) => persist({ ...next }),
    [persist],
  );

  const openBanner = useCallback((view: BannerView = 'main') => {
    setBannerView(view);
    setBannerOpen(true);
  }, []);

  const closeBanner = useCallback(() => setBannerOpen(false), []);

  return (
    <ConsentContext.Provider
      value={{
        selection,
        acceptAll,
        rejectAll,
        saveSelection,
        bannerOpen,
        bannerView,
        openBanner,
        closeBanner,
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
