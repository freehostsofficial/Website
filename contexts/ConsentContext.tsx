'use client';

import React, { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react';
import {
  writeCookie,
  readConsentSelection,
  clearNonEssentialStorage,
  CONSENT_COOKIE,
  CONSENT_VERSION,
  type ConsentSelection,
} from '../lib/cookies';
import { useMounted } from '../hooks/useMounted';

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

// Module-level consent store: read once per client (lazily on first
// subscribe/getSnapshot), shared by every consumer. No mount effect, no
// setState-in-effect — useSyncExternalStore reconciles server (null) with
// the stored choice. `undefined` = not read yet.
let consentCache: ConsentSelection | null | undefined;
const consentListeners = new Set<() => void>();

function getConsentSnapshot(): ConsentSelection | null {
  if (consentCache === undefined) {
    consentCache = typeof window === 'undefined' ? null : load();
  }
  return consentCache;
}

function subscribeConsent(onChange: () => void): () => void {
  consentListeners.add(onChange);
  const onStorage = () => {
    consentCache = load();
    for (const l of [...consentListeners]) l();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    consentListeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function getConsentServerSnapshot(): ConsentSelection | null {
  return null;
}

function notifyConsent(): void {
  for (const l of [...consentListeners]) l();
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const ConsentContext = createContext<ConsentContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  // SSR default null + closed banner: returners with a stored choice never
  // see a flash, first-timers get the notice after hydration (fixed overlay,
  // so no layout shift either way). `manualOpen` overrides the automatic
  // rule (null = automatic: open only when mounted with no stored choice).
  const selection = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentServerSnapshot);
  const mounted = useMounted();
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const [bannerView, setBannerView] = useState<BannerView>('main');
  const bannerOpen = manualOpen ?? (mounted && selection === null);

  const persist = useCallback((next: ConsentSelection) => {
    writeCookie(
      CONSENT_COOKIE,
      JSON.stringify({ v: CONSENT_VERSION, ts: new Date().toISOString(), ...next }),
      MAX_AGE,
    );
    // A declined category must not keep anything it stored before.
    clearNonEssentialStorage(next);
    // Legacy single-value cookie, if present, is overwritten above (same name).
    consentCache = next;
    notifyConsent();
    setManualOpen(null);
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
    setManualOpen(true);
  }, []);

  const closeBanner = useCallback(() => setManualOpen(false), []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      selection,
      acceptAll,
      rejectAll,
      saveSelection,
      bannerOpen,
      bannerView,
      openBanner,
      closeBanner,
    }),
    [selection, acceptAll, rejectAll, saveSelection, bannerOpen, bannerView, openBanner, closeBanner],
  );

  return (
    <ConsentContext.Provider
      value={value}
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
