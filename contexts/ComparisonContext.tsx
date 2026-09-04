'use client';

import React, { createContext, useContext } from 'react';
import { type Host } from '../lib/hosts';
import { showToast } from '../lib/toast';
import { isPreferenceAllowed, COMPARISON_STORAGE_KEY } from '../lib/cookies';
import { usePersistentState } from '../hooks/usePersistentState';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ComparisonContextValue {
  selection: Host[];
  addHost: (host: Host) => void;
  removeHost: (id: number) => void;
  clearAll: () => void;
  isSelected: (id: number) => boolean;
  isFull: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = COMPARISON_STORAGE_KEY;
const MAX_COMPARISON = 4;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function load(): Host[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as Host[];
    }
    return [];
  } catch {
    return [];
  }
}

function save(selection: Host[]): void {
  // Preferences category: without opt-in, comparison works in-memory only.
  if (!isPreferenceAllowed('comparison')) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  } catch {
    // sessionStorage unavailable (private browsing, quota exceeded);
    // comparison state still works in-memory for the session.
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ComparisonContext = createContext<ComparisonContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = usePersistentState<Host[]>([], load, save);

  const addHost = (host: Host): void => {
    setSelection((prev) => {
      // No-op if already selected
      if (prev.some((h) => h.id === host.id)) return prev;
      // No-op if at max capacity — show toast
      if (prev.length >= MAX_COMPARISON) {
        showToast('Maximum of 4 hosts can be compared at once.', 'error');
        return prev;
      }
      return [...prev, host];
    });
  };

  const removeHost = (id: number): void => {
    setSelection((prev) => prev.filter((h) => h.id !== id));
  };

  const clearAll = (): void => {
    setSelection([]);
  };

  const isSelected = (id: number): boolean => selection.some((h) => h.id === id);

  const isFull = selection.length >= MAX_COMPARISON;

  return (
    <ComparisonContext.Provider
      value={{ selection, addHost, removeHost, clearAll, isSelected, isFull }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useComparison(): ComparisonContextValue {
  const ctx = useContext(ComparisonContext);
  if (ctx === null) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return ctx;
}
