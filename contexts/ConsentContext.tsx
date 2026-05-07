'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConsentState = 'unknown' | 'accepted' | 'declined';

interface ConsentContextValue {
  consentState: ConsentState;
  acceptConsent: () => void;
  declineConsent: () => void;
  /** Called by FavoritesContext to surface the banner mid-session. */
  requestConsent: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readConsentCookie(): ConsentState {
  if (typeof document === 'undefined') return 'unknown';
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('fh_consent='));
  if (!match) return 'unknown';
  const value = match.split('=')[1];
  if (value === 'accepted') return 'accepted';
  if (value === 'declined') return 'declined';
  return 'unknown';
}

function writeConsentCookie(value: 'accepted' | 'declined'): void {
  try {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    if (value === 'accepted') {
      const maxAge = 90 * 24 * 60 * 60; // 90 days
      document.cookie = `fh_consent=accepted; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
    } else {
      // Session cookie — no Max-Age
      document.cookie = `fh_consent=declined; Path=/; SameSite=Lax${secure}`;
    }
  } catch {
    // Cookie write failed; state works in-memory.
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const ConsentContext = createContext<ConsentContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  // We initialize to 'accepted' during SSR so the banner is HIDDEN by default.
  // This prevents the banner from flashing on the server render.
  // Then, in the useEffect, we read the real cookie value and update the state.
  const [consentState, setConsentState] = useState<ConsentState>('accepted');

  useEffect(() => {
    // Read the actual cookie value on the client
    const stored = readConsentCookie();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsentState(stored);
  }, []);

  // Prevent scrolling when consent is required
  useEffect(() => {
    if (consentState === 'declined' || consentState === 'unknown') {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
      // Prevent all scroll events
      const preventScroll = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      };
      window.addEventListener('scroll', preventScroll, { capture: true, passive: false });
      window.addEventListener('wheel', preventScroll, { capture: true, passive: false });
      window.addEventListener('touchmove', preventScroll, { capture: true, passive: false });
      window.addEventListener('keydown', (e) => {
        if (['PageUp','PageDown','ArrowUp','ArrowDown','Space'].includes(e.code)) {
          e.preventDefault();
        }
      }, { capture: true });

      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overflow = '';
        window.removeEventListener('scroll', preventScroll, { capture: true });
        window.removeEventListener('wheel', preventScroll, { capture: true });
        window.removeEventListener('touchmove', preventScroll, { capture: true });
      };
    }
  }, [consentState]);

  const acceptConsent = () => {
    writeConsentCookie('accepted');
    setConsentState('accepted');
  };

  const declineConsent = () => {
    writeConsentCookie('declined');
    setConsentState('declined');
  };

  const requestConsent = () => {
    // If they request consent, we force it back to unknown so the banner shows
    setConsentState('unknown');
  };

  return (
    <ConsentContext.Provider
      value={{ consentState, acceptConsent, declineConsent, requestConsent }}
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
