'use client';

import { useState } from 'react';
import { useConsent } from '@/contexts/ConsentContext';
import { Cookie, Settings2, Check, ChevronRight, Lock, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
      className="fixed bottom-5 left-5 right-5 z-[9990] max-w-[480px] animate-in slide-in-from-bottom-2 fade-in"
      role="dialog"
      aria-modal="false"
      aria-label="Cookie preferences"
    >
      <div className="flex flex-col gap-5 rounded-2xl border border-border/80 bg-card/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-13 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
            {showManage ? <Settings2 className="size-5" /> : <Cookie className="size-5" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-extrabold tracking-tight text-foreground">
              {showManage ? 'Cookie preferences' : 'We use cookies'}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {showManage
                ? 'Choose which optional cookies you&apos;re okay with. You can change this anytime from the footer.'
                : 'We use necessary cookies to make FreeHosts work, and optional analytics cookies (Matomo) to understand how the site is used. Analytics cookies are off by default.'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCookieBanner}
            className="shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>

        <Separator className="opacity-30" />

        {showManage ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/10 bg-muted/30 p-4">
              <div>
                <strong className="block text-sm text-foreground">Necessary</strong>
                <p className="text-xs text-muted-foreground">Required for the site to function. Always on.</p>
              </div>
              <div className="shrink-0">
                <div className="flex h-[22px] w-[38px] cursor-default items-center rounded-full border border-accent/30 bg-accent/60">
                  <div className="ml-[18px] size-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/10 bg-muted/30 p-4">
              <div>
                <strong className="block text-sm text-foreground">Analytics</strong>
                <p className="text-xs text-muted-foreground">Helps us understand site usage via Matomo. Optional.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={analyticsDraft}
                aria-label="Toggle analytics cookies"
                className={cn(
                  "shrink-0 flex h-[22px] w-[38px] items-center rounded-full border transition-colors",
                  analyticsDraft
                    ? "border-accent/30 bg-accent"
                    : "border-border bg-muted"
                )}
                onClick={() => setAnalyticsDraft((v) => !v)}
              >
                <div className={cn(
                  "size-4 rounded-full bg-white shadow-sm transition-transform",
                  analyticsDraft ? "translate-x-[18px]" : "translate-x-[2px]"
                )} />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border/10 bg-muted/30 p-4">
            <p className="text-sm leading-relaxed text-foreground">
              We use <strong>necessary cookies</strong> to make FreeHosts work, and optional analytics
              cookies (Matomo) to understand how the site is used. Analytics cookies are off by default.
              See our{' '}
              <a href="/cookies" className="inline-flex items-center gap-1 font-semibold text-accent underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
                Cookie Policy
              </a>{' '}
              for details.
            </p>
          </div>
        )}

        <div className="flex gap-2.5 max-sm:flex-col-reverse">
          {!showManage ? (
            <>
              <Button variant="ghost" className="flex-1 gap-1.5 text-muted-foreground" onClick={() => setShowManage(true)}>
                <Settings2 className="size-4" />
                Manage
              </Button>
              <Button variant="ghost" className="flex-1 gap-1.5 text-muted-foreground" onClick={rejectNonEssentialCookies}>
                <X className="size-4" />
                Reject non-essential
              </Button>
              <Button className="flex-1 gap-1.5" onClick={acceptAllCookies}>
                <Check className="size-4" />
                Accept all
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="flex-1 text-muted-foreground" onClick={() => setShowManage(false)}>
                Back
              </Button>
              <Button className="flex-1 gap-1.5" onClick={handleSave}>
                Save preferences
                <ChevronRight className="size-4" />
              </Button>
            </>
          )}
        </div>

        <Separator className="opacity-30" />

        <div className="flex items-center justify-center gap-2.5 text-xs text-muted-foreground">
          <a href="/cookies" className="inline-flex items-center gap-1 hover:text-accent">
            <Cookie className="size-3" /> Cookie Policy
          </a>
          <span className="opacity-40">·</span>
          <a href="/privacy-policy" className="inline-flex items-center gap-1 hover:text-accent">
            <Lock className="size-3" /> Privacy Policy
          </a>
          <span className="opacity-40">·</span>
          <a href="/tos" className="inline-flex items-center gap-1 hover:text-accent">
            <FileText className="size-3" /> Terms
          </a>
        </div>
      </div>
    </div>
  );
}
