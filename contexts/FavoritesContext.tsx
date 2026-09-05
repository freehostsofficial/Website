'use client';

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { readCookie, writeCookie, isPreferenceAllowed, FAVORITES_COOKIE } from '../lib/cookies';
import { usePersistentState } from '../hooks/usePersistentState';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FavoritesContextValue {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COOKIE = FAVORITES_COOKIE;
const MAX_AGE = 90 * 24 * 60 * 60; // 90 days in seconds

function load(): number[] {
  try {
    const raw = readCookie(COOKIE);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.every((x) => typeof x === 'number' && Number.isFinite(x))
    ) {
      return parsed as number[];
    }
    return [];
  } catch {
    return [];
  }
}

function applyToggle(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // Preferences category: without opt-in, favorites work in-memory for the
  // session but are never written to a cookie. The store only saves on
  // user-action sets (never on mount), so no hydration guard is needed.
  const [favorites, setFavorites] = usePersistentState<number[]>(
    [],
    load,
    (ids) => {
      if (isPreferenceAllowed('favorites')) writeCookie(COOKIE, JSON.stringify(ids), MAX_AGE);
    },
  );

  const isFavorite = useCallback(
    (id: number): boolean => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback((id: number): void => {
    setFavorites((prev) => applyToggle(prev, id));
  }, [setFavorites]);

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (ctx === null) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
