'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface RedirectClientProps {
  targetUrl: string;
  hostnameOrPath: string;
  backUrl: string;
  invalid?: boolean;
}

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

export default function RedirectClient({ targetUrl, hostnameOrPath, backUrl, invalid }: RedirectClientProps) {
  const [countdown, setCountdown] = useState(5);
  const [isCancelled, setIsCancelled] = useState(false);
  const [opened, setOpened] = useState(false);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  // Track the external link click once (only for valid redirects)
  useEffect(() => {
    if (invalid || !hostnameOrPath || opened) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot "fired" guard keyed to mount-time props, not derived state
    setOpened(true);
    try {
      window._paq?.push(['trackLink', targetUrl, 'link']);
    } catch {
      // Matomo not loaded yet — ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostnameOrPath, invalid]);

  // Countdown (only for valid redirects)
  useEffect(() => {
    if (invalid || isCancelled || !hostnameOrPath) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [invalid, isCancelled, hostnameOrPath, targetUrl]);

  const progress = (countdown / 5) * 100;

  // ── Invalid redirect warning ───────────────────────────────────────────────
  if (invalid) {
    return (
      <main id="main-content">
        <div className="redirect-container">
          <div className="redirect-box">
            <div className="redirect-icon" style={{ color: '#ef4444' }}>
              <AlertTriangle size={24} aria-hidden="true" />
            </div>
            <h2 className="redirect-title" style={{ color: '#ef4444' }}>Invalid Redirect</h2>
            <p className="redirect-text">
              This link is <strong>not associated</strong> with this host and has been blocked.
            </p>
            <div className="redirect-url" style={{ borderColor: '#ef4444', color: '#ef4444', wordBreak: 'break-all' }}>
              {hostnameOrPath}
            </div>
            <div style={{
              margin: 'var(--space-md) 0',
              padding: 'var(--space-md)',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--muted)',
              textAlign: 'left',
              lineHeight: 1.6,
            }}>
              <strong style={{ color: '#ef4444', display: 'block', marginBottom: '6px' }}>
                ⚠ Security Warning
              </strong>
              This URL was not registered with this host. Visiting it could expose you to:
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '1.2em' }}>
                <li>Phishing — a fake site designed to steal your credentials</li>
                <li>Malware — software that can harm your device</li>
                <li>Scams — fraudulent services impersonating legitimate ones</li>
              </ul>
            </div>
            <div className="redirect-actions">
              <button
                className="redirect-cancel-btn"
                onClick={() => { window.location.href = backUrl; }}
                autoFocus
              >
                <ArrowLeft size={14} aria-hidden="true" /> Go Back to Safety
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Valid redirect countdown ───────────────────────────────────────────────
  return (
    <main id="main-content">
      <div className="redirect-container">
        <div className="redirect-box">
          <div className="redirect-icon">
            <ArrowRight size={24} aria-hidden="true" />
          </div>
          <h2 className="redirect-title">Redirecting...</h2>
          <p className="redirect-text">You are being redirected to</p>
          <div className="redirect-url">{hostnameOrPath}</div>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)', margin: 'var(--space-sm) 0 0', lineHeight: 1.6 }}>
            FreeHosts doesn&apos;t control or endorse external sites — proceed at your own risk.
          </p>
          <div className="redirect-timer">
            <span className="redirect-timer-number" style={{ opacity: isCancelled ? 0.6 : 1 }}>
              {isCancelled ? '✓ Stopped' : countdown}
            </span>
          </div>
          <div className="redirect-progress">
            <div className="redirect-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="redirect-actions">
            <button className="redirect-cancel-btn" onClick={() => { window.location.href = backUrl; }} ref={backBtnRef}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <button
              className="redirect-cancel-btn"
              onClick={() => { setIsCancelled(true); setTimeout(() => backBtnRef.current?.focus(), 50); }}
              disabled={isCancelled}
            >
              <X size={14} aria-hidden="true" /> Cancel
            </button>
          </div>
          {isCancelled && (
            <div id="redirect-focus-error">
              <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
                <X size={14} aria-hidden="true" /> Redirect Cancelled
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                The automatic redirect has been stopped.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
