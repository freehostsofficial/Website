'use client';

import React, { useContext } from 'react';
import { ConsentContext } from '@/contexts/ConsentContext';
import { usePathname } from 'next/navigation';

export default function ConsentGate({ children }: { children: React.ReactNode }) {
  const context = useContext(ConsentContext);
  const legalConsent = context?.legalConsent ?? 'unknown';

  // Always allow crawlers full access
  const isCrawler = React.useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('googlebot') || ua.includes('bingbot') || ua.includes('yandexbot') || 
           ua.includes('duckduckbot') || ua.includes('baiduspider') || ua.includes('slackbot') ||
           ua.includes('discordbot') || ua.includes('twitterbot') || ua.includes('telegrambot') ||
           ua.includes('anthropic-ai') || ua.includes('claude') || ua.includes('gptbot') ||
           ua.includes('chatgpt') || ua.includes('bot') || ua.includes('spider') || ua.includes('crawl');
  }, []);

  const pathname = usePathname();

  // "agreed" (or a crawler) sees the whole site. This gate is only about the
  // ToS/Privacy Policy agreement — a contractual gate, not a cookie/tracking
  // choice — so it's allowed to block usage. It has nothing to do with
  // analytics consent, which is handled separately by CookieConsentBanner
  // and never blocks anything.
  const accepted = legalConsent === 'agreed' || isCrawler;

  // Skippable: pages that must remain readable without agreeing, so people
  // can actually read the ToS/Privacy Policy before deciding.
  const skippable = !accepted && (pathname === '/tos' || pathname === '/privacy-policy' || pathname === '/cookies');

  // Show only the content wrapper on skippable (legal) pages so users can
  // read ToS/Privacy/Cookies without the consent overlay blocking them.
  // Filter out nothing on every other page — text must never be hidden.
  // The GdprConsentBanner handles its own visibility (returns null when
  // legalConsent === 'agreed') and its backdrop sits on top of content.
  return <>{React.Children.toArray(children).filter((child) => {
    if (!React.isValidElement<{ className?: string }>(child)) return true;
    const className = child.props.className ?? "";
    // Keep the content wrapper (skippable) when on skippable pages.
    if (skippable) return className.includes("skippable");
    // When accepted, hide the consent banner (it returns null anyway).
    if (accepted) return !className.includes("consent-banner");
    // Not accepted: show everything — content behind the consent overlay.
    return true;
  })}</>;
}
