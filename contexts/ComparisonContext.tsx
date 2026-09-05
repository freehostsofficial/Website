'use client';

import React, { createContext, useCallback, useContext, useMemo } from 'react';
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

function isStoredHost(value: unknown): value is Host {
  if (typeof value !== 'object' || value === null) return false;
  const h = value as Record<string, unknown>;
  return typeof h.id === 'number' && typeof h.name === 'string';
}

function load(): Host[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(isStoredHost);
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

  const addHost = useCallback((host: Host): void => {
    // Decided here, outside the updater (updaters must stay pure — no
    // side effects like toasts inside setState).
    if (selection.some((h) => h.id === host.id)) return;
    if (selection.length >= MAX_COMPARISON) {
      showToast('Maximum of 4 hosts can be compared at once.', 'error');
      return;
    }
    setSelection((prev) =>
      prev.some((h) => h.id === host.id) ? prev : [...prev, host],
    );
  }, [selection, setSelection]);

  const removeHost = useCallback((id: number): void => {
    setSelection((prev) => prev.filter((h) => h.id !== id));
  }, [setSelection]);

  const clearAll = useCallback((): void => {
    setSelection([]);
  }, [setSelection]);

  const isSelected = useCallback(
    (id: number): boolean => selection.some((h) => h.id === id),
    [selection],
  );

  const value = useMemo<ComparisonContextValue>(
    () => ({
      selection,
      addHost,
      removeHost,
      clearAll,
      isSelected,
      isFull: selection.length >= MAX_COMPARISON,
    }),
    [selection, addHost, removeHost, clearAll, isSelected],
  );

  return (
    <ComparisonContext.Provider
      value={value}
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
