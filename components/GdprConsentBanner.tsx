'use client';

import { useConsent } from '@/contexts/ConsentContext';
import { ShieldCheck, Lock, ChevronRight, X, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function GdprConsentBanner({className}: {className: string}) {
  const { agreeToLegal, declineLegal, legalConsent } = useConsent();

  if (legalConsent === 'agreed') return null;

  const isRestricted = legalConsent === 'declined';

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[9998] pointer-events-all",
          isRestricted ? "bg-black/85 backdrop-blur-md" : "bg-black/55 backdrop-blur-sm",
          className
        )}
        aria-hidden="true"
        onClick={(e) => e.stopPropagation()}
      />

      <div
        className="fixed top-1/2 left-1/2 z-[9999] w-[92%] max-w-[520px] -translate-x-1/2 -translate-y-1/2"
        role="dialog"
        aria-modal="true"
        aria-label={isRestricted ? 'Access Restricted' : 'Terms of Service Agreement'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-5 rounded-2xl border border-border/80 bg-card/95 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex size-13 shrink-0 items-center justify-center rounded-xl border",
              isRestricted
                ? "border-destructive/30 bg-destructive/10 text-destructive-text"
                : "border-accent/25 bg-accent/10 text-accent"
            )}>
              {isRestricted
                ? <AlertTriangle className="size-5" />
                : <ShieldCheck className="size-5" />}
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {isRestricted ? 'Access Restricted' : 'Before You Continue'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isRestricted
                  ? 'You declined our Terms of Service. Access is blocked until you agree.'
                  : 'Please review and agree to our legal terms to use FreeHosts.'}
              </p>
            </div>
          </div>

          <Separator className="opacity-30" />

          <div className="rounded-xl border border-border/10 bg-muted/30 p-4">
            <p className="text-sm leading-relaxed text-foreground">
              {isRestricted ? 'To use FreeHosts, you must agree to our ' : 'By continuing, you agree to our '}
              <a href="/tos" className="inline-flex items-center gap-1 font-semibold text-accent underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
                <FileText className="size-3" />
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy-policy" className="inline-flex items-center gap-1 font-semibold text-accent underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
                <Lock className="size-3" />
                Privacy Policy
              </a>
              .{' '}
              {isRestricted
                ? 'Please read them carefully and agree to regain access.'
                : 'These outline how we handle your data and your responsibilities.'}
            </p>
          </div>

          <div className="flex gap-2.5 max-sm:flex-col-reverse">
            <Button
              variant="ghost"
              className="flex-1 gap-1.5 text-muted-foreground"
              onClick={declineLegal}
            >
              <X className="size-4" />
              {isRestricted ? 'Keep Declined' : 'Decline'}
            </Button>
            <Button
              className="flex-1 gap-1.5"
              onClick={agreeToLegal}
            >
              {isRestricted ? 'Agree & Unlock' : 'Agree & Continue'}
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2.5 text-xs text-muted-foreground">
            <a href="/tos" className="hover:text-accent">Terms of Service</a>
            <span className="opacity-40">·</span>
            <a href="/privacy-policy" className="hover:text-accent">Privacy Policy</a>
          </div>
        </div>
      </div>
    </>
  );
}
