'use client';

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

// Persistent client state without setState-in-effect.
//
// Hydration contract (the load-bearing invariant): the store starts at
// `initial` on BOTH server and client first render, and getServerSnapshot
// returns exactly that — so hydration always matches. The stored value
// converges asynchronously after mount (inside subscribe, never during
// render): if it differs, subscribers re-render with no mismatch error.
// Saves happen inside the set handler (a user-action event), never on
// mount — so no first-render guard is needed either.
interface Store<T> {
  current: T;
  listeners: Set<() => void>;
}

function snapshotsEqual<T>(a: T, b: T): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    // Unserializable (shouldn't happen — persisted state must be JSON) —
    // treat as changed so the stored value still converges.
    return false;
  }
}

export function usePersistentState<T>(
  initial: T,
  load: () => T,
  save?: (value: T) => void,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Lazy singleton from the first-render `initial` (a render value, not a
  // ref — safe to read here). Same value server and client hydrate with.
  const storeRef = useRef<Store<T> | null>(null);
  if (storeRef.current === null) {
    storeRef.current = { current: initial, listeners: new Set() };
  }
  const loadRef = useRef(load);
  const saveRef = useRef(save);

  // Fresh closures every render (no stale reads in listeners/setter).
  useEffect(() => {
    loadRef.current = load;
    saveRef.current = save;
  });

  const subscribe = useCallback((onChange: () => void) => {
    const store = storeRef.current!;
    // Post-hydration convergence (client only — subscribe never runs on the
    // server). Async so it never runs during render; notifies only when the
    // stored value actually differs from the initial render.
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      let loaded: T;
      try {
        loaded = loadRef.current();
      } catch {
        // corrupt storage — keep the initial value in-memory.
        return;
      }
      if (snapshotsEqual(loaded, store.current)) return;
      store.current = loaded;
      for (const l of [...store.listeners]) l();
    }, 0);
    // Cross-tab sync: another tab's write reloads this tab's snapshot.
    const onStorage = () => {
      try {
        store.current = loadRef.current();
      } catch {
        // corrupt storage — keep current value in-memory.
      }
      for (const l of [...store.listeners]) l();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      store.listeners.delete(onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const getSnapshot = useCallback(() => storeRef.current!.current, []);
  // Must be the server value, not the stored one — returning storage here
  // hydrates cookie/state into the first client render and mismatches.
  const getServerSnapshot = useCallback(() => storeRef.current!.current, []);
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback<React.Dispatch<React.SetStateAction<T>>>((action) => {
    const store = storeRef.current!;
    const next = typeof action === 'function' ? (action as (prev: T) => T)(store.current) : action;
    if (Object.is(next, store.current)) return;
    store.current = next;
    try {
      saveRef.current?.(next);
    } catch {
      // persist failed — state still works in-memory for the session.
    }
    for (const l of [...store.listeners]) l();
  }, []);

  return [value, setValue];
}
