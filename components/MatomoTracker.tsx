"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackAppRouter } from "@socialgouv/matomo-next";
import { useConsent } from "@/contexts/ConsentContext";

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL ?? "";
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? "";

export default function MatomoTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { cookiePrefs, legalConsent } = useConsent();

  // Matomo only ever loads if the user has explicitly opted in to analytics
  // cookies AND agreed to the legal terms. No implicit / assumed consent.
  const analyticsAllowed = legalConsent === 'agreed' && cookiePrefs.analytics;

  useEffect(() => {
    if (!MATOMO_URL || !MATOMO_SITE_ID) return;
    if (!analyticsAllowed) return;
    // trackAppRouter handles init on first call and page tracking on subsequent calls
    trackAppRouter({
      url: MATOMO_URL,
      siteId: MATOMO_SITE_ID,
      pathname,
      searchParams,
    });
  }, [pathname, searchParams, analyticsAllowed]);

  return null;
}
