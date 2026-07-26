'use client';

import React, { useContext } from 'react';
import { ConsentContext } from '@/contexts/ConsentContext';
import { usePathname } from 'next/navigation';

export default function ConsentGate({ children }: { children: React.ReactNode }) {
  const context = useContext(ConsentContext);
  const consentState = context?.consentState ?? 'unknown';
  const pathname = usePathname();
  const isCrawler = React.useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('googlebot') || ua.includes('bingbot') || ua.includes('yandexbot') || 
           ua.includes('duckduckbot') || ua.includes('baiduspider') || ua.includes('slackbot') ||
           ua.includes('discordbot') || ua.includes('twitterbot') || ua.includes('telegrambot') ||
           ua.includes('anthropic-ai') || ua.includes('claude') || ua.includes('gptbot') ||
           ua.includes('chatgpt') || ua.includes('bot') || ua.includes('spider') || ua.includes('crawl');
  }, []);

  const accepted = consentState === 'accepted' || isCrawler;
  const skippable = !accepted && (pathname === '/tos' || pathname === '/privacy-policy');

  const displayChildren = React.Children.toArray(children).filter((child) => {
    if (!React.isValidElement<{ className?: string }>(child)) return accepted;
    const className = child.props.className ?? '';
    if (accepted || skippable) return !className.includes('consent-banner');
    return className.includes('consent-banner');
  });

  return <>{displayChildren}</>;
}
