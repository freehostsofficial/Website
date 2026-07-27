'use client';

import { useState } from 'react';
import { useConsent } from '@/contexts/ConsentContext';
import { Cookie, Settings2, Check, ChevronRight, Lock, FileText } from 'lucide-react';

export default function CookieConsentBanner() {
  const {
    showCookieBanner,
    acceptAllCookies,
    rejectNonEssentialCookies,
    saveCookiePrefs,
    cookiePrefs,
    closeCookieBanner,
  } = useConsent();

  const [showManage, setShowManage] = useState(false);
  const [analyticsDraft, setAnalyticsDraft] = useState(cookiePrefs.analytics);

  if (!showCookieBanner) return null;

  const handleSave = () => {
    saveCookiePrefs({ analytics: analyticsDraft });
  };

  return (
    <div
      className="cookie-banner-container"
      role="dialog"
      aria-modal="false"
      aria-label="Cookie preferences"
    >
      <div className="cookie-banner-content">
        {!showManage ? (
          <>
            <div className="cookie-banner-main">
              <div className="cookie-icon-wrap" aria-hidden="true">
                <Cookie size={20} />
              </div>
              <div className="cookie-text">
                <h4>We use cookies</h4>
                <p>
                  We use necessary cookies to make FreeHosts work, and optional
                  analytics cookies (Matomo) to understand how the site is used.
                  Analytics cookies are off by default — we only turn them on
                  if you say yes. See our{' '}
                  <a href="/cookies" target="_blank" rel="noopener noreferrer">
                    Cookie Policy
                  </a>{' '}
                  for details.
                </p>
              </div>
            </div>

            <div className="cookie-banner-actions">
              <button
                type="button"
                className="btn-gdpr secondary cookie-manage-btn"
                onClick={() => setShowManage(true)}
              >
                <Settings2 size={15} aria-hidden="true" />
                <span>Manage preferences</span>
              </button>
              <button
                type="button"
                className="btn-gdpr secondary"
                onClick={rejectNonEssentialCookies}
              >
                <span>Reject non-essential</span>
              </button>
              <button
                type="button"
                className="btn-gdpr primary"
                onClick={acceptAllCookies}
              >
                <Check size={15} aria-hidden="true" />
                <span>Accept all</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cookie-banner-main">
              <div className="cookie-icon-wrap" aria-hidden="true">
                <Settings2 size={20} />
              </div>
              <div className="cookie-text">
                <h4>Cookie preferences</h4>
                <p>Choose which optional cookies you&apos;re okay with. You can change this anytime from the footer.</p>
              </div>
            </div>

            <div className="cookie-pref-list">
              <div className="cookie-pref-row">
                <div className="cookie-pref-info">
                  <strong>Necessary</strong>
                  <p>Required for the site to function (e.g. remembering your legal agreement, theme, and saved hosts). Always on.</p>
                </div>
                <div className="cookie-toggle disabled" aria-hidden="true">
                  <div className="cookie-toggle-track on">
                    <div className="cookie-toggle-thumb" />
                  </div>
                </div>
              </div>

              <div className="cookie-pref-row">
                <div className="cookie-pref-info">
                  <strong>Analytics</strong>
                  <p>Helps us understand site usage via Matomo (self-hosted, no ad networks). Optional.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analyticsDraft}
                  aria-label="Toggle analytics cookies"
                  className="cookie-toggle"
                  onClick={() => setAnalyticsDraft((v) => !v)}
                >
                  <div className={`cookie-toggle-track ${analyticsDraft ? 'on' : ''}`}>
                    <div className="cookie-toggle-thumb" />
                  </div>
                </button>
              </div>
            </div>

            <div className="cookie-banner-actions">
              <button
                type="button"
                className="btn-gdpr secondary"
                onClick={() => setShowManage(false)}
              >
                <span>Back</span>
              </button>
              <button
                type="button"
                className="btn-gdpr primary"
                onClick={handleSave}
              >
                <span>Save preferences</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </>
        )}

        <div className="cookie-banner-links">
          <a href="/cookies" target="_blank" rel="noopener noreferrer">
            <Cookie size={13} aria-hidden="true" /> Cookie Policy
          </a>
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            <Lock size={13} aria-hidden="true" /> Privacy Policy
          </a>
          <a href="/tos" target="_blank" rel="noopener noreferrer">
            <FileText size={13} aria-hidden="true" /> Terms
          </a>
        </div>

        <button
          type="button"
          className="cookie-banner-dismiss"
          aria-label="Dismiss (keeps necessary cookies only until you choose)"
          onClick={closeCookieBanner}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
