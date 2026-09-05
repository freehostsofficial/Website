"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useConsent } from "@/contexts/ConsentContext";

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL ?? "";
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? "";

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

// window._paq outlives this component: consent opt-out removes the script
// element but not the queue (or the already-loaded library), and effects
// re-run across Activity show/hide + remounts. Pushing setTrackerUrl /
// setSiteId more than once per page-load makes Matomo warn about duplicate
// registration — so the config push is deduplicated at module scope, while
// the script element lifecycle below stays per-mount.
let configuredTrackerUrl: string | null = null;

export default function MatomoTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { selection } = useConsent();
  // String, not the searchParams object: its identity changes between renders
  // without navigation, which re-fired this effect and double-tracked the page.
  const qs = searchParams?.toString() ?? "";
  // ponytail: ref guard, StrictMode/dev double-effects also land here
  const lastTracked = useRef<string | null>(null);
  // Tracked script element so it can be removed on unmount / opt-out.
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const warnedMissingEnv = useRef(false);

  const statisticsEnabled = selection?.statistics ?? false;

  // Script lifecycle: present only while statistics consent is granted.
  useEffect(() => {
    if (!statisticsEnabled) {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
      return;
    }
    if (!MATOMO_URL || !MATOMO_SITE_ID) {
      if (!warnedMissingEnv.current) {
        warnedMissingEnv.current = true;
        console.warn(
          "[matomo] statistics consented but NEXT_PUBLIC_MATOMO_URL / NEXT_PUBLIC_MATOMO_SITE_ID is missing — tracker not loaded."
        );
      }
      return;
    }
    window._paq = window._paq || [];
    if (!scriptRef.current && !document.querySelector(`script[src="${MATOMO_URL}/matomo.js"]`)) {
      if (configuredTrackerUrl !== MATOMO_URL) {
        window._paq.push(["setTrackerUrl", `${MATOMO_URL}/matomo.php`]);
        window._paq.push(["setSiteId", MATOMO_SITE_ID]);
        configuredTrackerUrl = MATOMO_URL;
      }
      const s = document.createElement("script");
      s.async = true;
      s.src = `${MATOMO_URL}/matomo.js`;
      document.head.appendChild(s);
      scriptRef.current = s;
    }
  }, [statisticsEnabled]);

  // Unmount: leave no third-party script behind.
  useEffect(() => () => {
    if (scriptRef.current) {
      scriptRef.current.remove();
      scriptRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Statistics category only — never loads without explicit opt-in.
    if (!statisticsEnabled) return;
    if (!MATOMO_URL || !MATOMO_SITE_ID) return;
    window._paq = window._paq || [];
    const route = qs ? `${pathname}?${qs}` : pathname;
    if (lastTracked.current === route) return;
    lastTracked.current = route;
    window._paq.push(["setCustomUrl", window.location.href]);
    window._paq.push(["trackPageView"]);
  }, [pathname, qs, statisticsEnabled]);

  return null;
}
