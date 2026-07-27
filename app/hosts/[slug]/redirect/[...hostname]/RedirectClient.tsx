'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, X, Check } from 'lucide-react';
import { push } from '@socialgouv/matomo-next';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface RedirectClientProps {
  targetUrl: string;
  hostnameOrPath: string;
  backUrl: string;
  invalid?: boolean;
}

export default function RedirectClient({ targetUrl, hostnameOrPath, backUrl, invalid }: RedirectClientProps) {
  const [countdown, setCountdown] = useState(5);
  const [isCancelled, setIsCancelled] = useState(false);
  const [opened, setOpened] = useState(false);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  // Track the external link click once (only for valid redirects)
  useEffect(() => {
    if (invalid || !hostnameOrPath || opened) return;
    setOpened(true);
    try {
      push(['trackLink', targetUrl, 'link']);
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
      <main id="main-content" className="mx-auto flex min-h-[70vh] max-w-[560px] items-center px-4 py-12 sm:px-6">
        <Card className="w-full">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/15">
              <AlertTriangle className="size-6 text-destructive-text" />
            </div>
            <h2 className="text-destructive-text">Invalid Redirect</h2>
            <p className="text-sm text-muted-foreground">
              This link is <strong className="text-foreground">not associated</strong> with this host and has been blocked.
            </p>
            <div className="w-full break-all rounded-md border border-destructive/40 px-3 py-2 font-mono text-sm text-destructive-text">
              {hostnameOrPath}
            </div>
            <div className="w-full rounded-md border border-destructive/25 bg-destructive/10 p-4 text-left text-sm leading-relaxed text-muted-foreground">
              <strong className="mb-1.5 block text-destructive-text">⚠ Security Warning</strong>
              This URL was not registered with this host. Visiting it could expose you to:
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Phishing — a fake site designed to steal your credentials</li>
                <li>Malware — software that can harm your device</li>
                <li>Scams — fraudulent services impersonating legitimate ones</li>
              </ul>
            </div>
            <Button
              className="gap-1.5"
              onClick={() => { window.location.href = backUrl; }}
              autoFocus
            >
              <ArrowLeft className="size-4" />
              Go Back to Safety
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // ── Valid redirect countdown ───────────────────────────────────────────────
  return (
    <main id="main-content" className="mx-auto flex min-h-[70vh] max-w-[480px] items-center px-4 py-12 sm:px-6">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <ArrowRight className="size-6" />
          </div>
          <h2>Redirecting...</h2>
          <p className="text-sm text-muted-foreground">You are being redirected to</p>
          <div className="w-full break-all rounded-md border border-border px-3 py-2 font-mono text-sm">
            {hostnameOrPath}
          </div>
          <div className="font-mono text-3xl font-semibold" style={{ opacity: isCancelled ? 0.6 : 1 }}>
            {isCancelled ? (
              <span className="flex items-center gap-1.5 text-lg text-accent">
                <Check className="size-5" />
                Stopped
              </span>
            ) : (
              countdown
            )}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1.5" onClick={() => { window.location.href = backUrl; }} ref={backBtnRef}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => { setIsCancelled(true); setTimeout(() => backBtnRef.current?.focus(), 50); }}
              disabled={isCancelled}
            >
              <X className="size-4" />
              Cancel
            </Button>
          </div>
          {isCancelled && (
            <div id="redirect-focus-error" role="status">
              <div className="flex items-center justify-center gap-1.5 font-semibold text-destructive-text">
                <X className="size-3.5" />
                Redirect Cancelled
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                The automatic redirect has been stopped.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
