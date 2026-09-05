'use client';

import { useState, useEffect, useRef } from 'react';
import Link from '@/components/SiteLink';
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
  // One-shot "fired" guard for the tracking effect — a ref, not state, since
  // nothing renders from it.
  const trackedRef = useRef(false);
  const backBtnRef = useRef<HTMLAnchorElement>(null);

  // Track the external link click once (only for valid redirects)
  useEffect(() => {
    if (invalid || !hostnameOrPath || trackedRef.current) return;
    trackedRef.current = true;
    try {
      window._paq?.push(['trackLink', targetUrl, 'link']);
    } catch {
      // Matomo not loaded yet — ignore
    }
  }, [hostnameOrPath, invalid, targetUrl]);

  // Countdown (only for valid redirects)
  useEffect(() => {
    if (invalid || isCancelled || !hostnameOrPath) return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [invalid, isCancelled, hostnameOrPath]);

  useEffect(() => {
    if (!invalid && !isCancelled && hostnameOrPath && countdown === 0) {
      window.location.href = targetUrl;
    }
  }, [countdown, invalid, isCancelled, hostnameOrPath, targetUrl]);

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
            <h1 className="redirect-title" style={{ color: '#ef4444' }}>Invalid Redirect</h1>
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
              <Link
                className="redirect-cancel-btn"
                href={backUrl}
                autoFocus
              >
                <ArrowLeft size={14} aria-hidden="true" /> Go Back to Safety
              </Link>
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
          <h1 className="redirect-title">Redirecting...</h1>
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
            <Link className="redirect-cancel-btn" href={backUrl} ref={backBtnRef}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </Link>
            <button
              className="redirect-cancel-btn"
              onClick={() => { setIsCancelled(true); setTimeout(() => backBtnRef.current?.focus(), 50); }}
              disabled={isCancelled}
            >
              <X size={14} aria-hidden="true" /> Cancel
            </button>
          </div>
          {isCancelled && (
            <div id="redirect-focus-error" role="alert">
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
