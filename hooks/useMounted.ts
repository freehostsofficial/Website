'use client';

import { useSyncExternalStore } from 'react';

// True only after hydration. Mount-hydration flows (cookie reads, banner
// auto-open, skeletons) derive from this instead of setState-in-effect:
// server renders false, client flips to true with no effect and no mismatch.
const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useMounted(): boolean {
  return useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
}
