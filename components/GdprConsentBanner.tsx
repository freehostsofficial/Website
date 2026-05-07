'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '@/contexts/ConsentContext';
import { ShieldCheck, Lock, ChevronRight, X, FileText, AlertTriangle } from 'lucide-react';

export default function GdprConsentBanner() {
  const { acceptConsent, declineConsent, consentState } = useConsent();
  const pathname = usePathname();

  // Skip showing for crawlers/search engines
  const isCrawler = React.useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('googlebot') || ua.includes('bingbot') || ua.includes('yandexbot') || 
           ua.includes('duckduckbot') || ua.includes('baiduspider') || ua.includes('slackbot') ||
           ua.includes('discordbot') || ua.includes('twitterbot') || ua.includes('telegrambot') ||
           ua.includes('anthropic-ai') || ua.includes('claude') || ua.includes('gptbot') ||
           ua.includes('chatgpt') || ua.includes('bot') || ua.includes('spider') || ua.includes('crawl');
  }, []);

  if (isCrawler) return null;

  // Anti tampering protection
  useEffect(() => {
    const protectElements = () => {
      const banner = document.querySelector<HTMLElement>('.gdpr-banner-container');
      const backdrop = document.querySelector<HTMLElement>('.gdpr-backdrop');

      if (banner && backdrop) {
        // Force banner to always be topmost
        banner.style.setProperty('z-index', '999999999', 'important');
        banner.style.setProperty('display', 'flex', 'important');
        banner.style.setProperty('visibility', 'visible', 'important');
        banner.style.setProperty('opacity', '1', 'important');
        banner.style.setProperty('pointer-events', 'auto', 'important');
        banner.style.setProperty('position', 'fixed', 'important');

        backdrop.style.setProperty('z-index', '999999998', 'important');
        backdrop.style.setProperty('display', 'block', 'important');
        backdrop.style.setProperty('visibility', 'visible', 'important');
        backdrop.style.setProperty('opacity', '1', 'important');
        backdrop.style.setProperty('pointer-events', 'auto', 'important');
        backdrop.style.setProperty('position', 'fixed', 'important');
        backdrop.style.setProperty('inset', '0', 'important');
      }
    };

    // Run immediately and on any DOM changes
    protectElements();
    const observer = new MutationObserver(protectElements);
    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'class', 'hidden']
    });

    // Also check periodically in case observer fails
    const interval = setInterval(protectElements, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Never show on legal pages — let the user read before deciding
  if (pathname === '/tos' || pathname === '/privacy-policy') return null;

  // Only hide when the user has EXPLICITLY accepted — nothing else hides this
  if (consentState === 'accepted') return null;

  const isRestricted = consentState === 'declined';

  return (
    <>
      {/* Backdrop — blocks interaction with page below */}
      <div
        className={`gdpr-backdrop ${isRestricted ? 'restricted' : ''}`}
        aria-hidden="true"
        onClick={(e) => e.stopPropagation()}
      />

      <div
        className="gdpr-banner-container"
        role="dialog"
        aria-modal="true"
        aria-label={isRestricted ? 'Access Restricted' : 'Terms of Service Agreement'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gdpr-banner-content">

          {/* Header */}
          <div className="gdpr-header">
            <div className={`gdpr-icon-wrap ${isRestricted ? 'restricted' : ''}`}>
              {isRestricted
                ? <AlertTriangle size={22} aria-hidden="true" />
                : <ShieldCheck size={22} aria-hidden="true" />}
            </div>
            <div className="gdpr-title-area">
              <h3>{isRestricted ? 'Access Restricted' : 'Before You Continue'}</h3>
              <p>
                {isRestricted
                  ? 'You declined our Terms of Service. Access is blocked until you agree.'
                  : 'We care about your privacy and want to be transparent.'}
              </p>
            </div>
          </div>

          <div className="gdpr-divider" />

          {/* Body — links open in new tab so the banner stays visible */}
          <div className="gdpr-body">
            <p className="gdpr-description">
              {isRestricted ? 'To use FreeHosts, you must accept our ' : 'By continuing, you agree to our '}
              <a href="/tos" className="gdpr-link" target="_blank" rel="noopener noreferrer">
                <FileText size={13} aria-hidden="true" />
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy-policy" className="gdpr-link" target="_blank" rel="noopener noreferrer">
                <Lock size={13} aria-hidden="true" />
                Privacy Policy
              </a>
              .{' '}
              {isRestricted
                ? 'Please read them carefully and accept to regain access.'
                : 'These outline how we handle your data and your responsibilities.'}
            </p>
          </div>

          {/* Buttons */}
          <div className="gdpr-footer">
            <button
              className="btn-gdpr secondary"
              onClick={declineConsent}
              type="button"
            >
              <X size={15} aria-hidden="true" />
              <span>{isRestricted ? 'Keep Declined' : 'Decline'}</span>
            </button>
            <button
              className="btn-gdpr primary"
              onClick={acceptConsent}
              type="button"
            >
              <span>{isRestricted ? 'Accept & Unlock' : 'Accept & Continue'}</span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Quick legal links */}
          <div className="gdpr-legal-links">
            <a href="/tos" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            <span aria-hidden="true">·</span>
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </div>

        </div>
      </div>
    </>
  );
}
