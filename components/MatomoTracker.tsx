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

export default function MatomoTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { selection } = useConsent();
  // String, not the searchParams object: its identity changes between renders
  // without navigation, which re-fired this effect and double-tracked the page.
  const qs = searchParams?.toString() ?? "";
  // ponytail: ref guard, StrictMode/dev double-effects also land here
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // Statistics category only — never loads without explicit opt-in.
    if (!selection?.statistics) return;
    if (!MATOMO_URL || !MATOMO_SITE_ID) return;
    window._paq = window._paq || [];
    if (!document.querySelector(`script[src="${MATOMO_URL}/matomo.js"]`)) {
      window._paq.push(["setTrackerUrl", `${MATOMO_URL}/matomo.php`]);
      window._paq.push(["setSiteId", MATOMO_SITE_ID]);
      const s = document.createElement("script");
      s.async = true;
      s.src = `${MATOMO_URL}/matomo.js`;
      document.head.appendChild(s);
    }
    const url = qs ? `${pathname}?${qs}` : pathname;
    if (lastTracked.current === url) return;
    lastTracked.current = url;
    window._paq.push(["setCustomUrl", url]);
    window._paq.push(["trackPageView"]);
  }, [pathname, qs, selection]);

  return null;
}
