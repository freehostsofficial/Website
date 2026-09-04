'use client';

import React, { createContext, useContext } from 'react';
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
  // session but are never written to a cookie.
  const [favorites, setFavorites] = usePersistentState<number[]>(
    [],
    load,
    (ids) => {
      if (isPreferenceAllowed('favorites')) writeCookie(COOKIE, JSON.stringify(ids), MAX_AGE);
    },
  );

  const isFavorite = (id: number): boolean => favorites.includes(id);

  const toggleFavorite = (id: number): void => {
    setFavorites((prev) => applyToggle(prev, id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
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
