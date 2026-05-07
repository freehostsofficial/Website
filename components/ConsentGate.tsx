'use client';

import React, { useContext } from 'react';
import { ConsentContext } from '@/contexts/ConsentContext';

export default function ConsentGate({ children }: { children: React.ReactNode }) {
  const context = useContext(ConsentContext);
  const consentState = context?.consentState ?? 'unknown';

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

  if (isCrawler || consentState === 'accepted') {
    return children;
  }

  // Fake background page for human visitors
  return (
    <div style={{ 
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url(/Src/Images/preview-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(12px) saturate(0.8)',
      transform: 'scale(1.1)',
      opacity: 0.7,
      pointerEvents: 'none'
    }} />
  );
}
