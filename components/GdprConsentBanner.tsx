'use client';

import { useConsent } from '@/contexts/ConsentContext';
import { ShieldCheck, Lock, ChevronRight, X, FileText, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function GdprConsentBanner({className}: {className: string}) {
  const { acceptConsent, declineConsent, consentState } = useConsent();

  if (consentState === 'accepted') return null;

  const isRestricted = consentState === 'declined';
  const open = consentState === 'unknown' || consentState === 'declined';

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex size-10 items-center justify-center rounded-lg ${isRestricted ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'}`}>
              {isRestricted ? <AlertTriangle size={22} /> : <ShieldCheck size={22} />}
            </div>
            <div>
              <DialogTitle>{isRestricted ? 'Access Restricted' : 'Before You Continue'}</DialogTitle>
              <DialogDescription>
                {isRestricted
                  ? 'You declined our Terms of Service. Access is blocked until you agree.'
                  : 'We care about your privacy and want to be transparent.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {isRestricted ? 'To use FreeHosts, you must accept our ' : 'By continuing, you agree to our '}
            <a href="/tos" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              <FileText size={13} className="inline mr-0.5" />
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy-policy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              <Lock size={13} className="inline mr-0.5" />
              Privacy Policy
            </a>
            .{' '}
            {isRestricted
              ? 'Please read them carefully and accept to regain access.'
              : 'These outline how we handle your data and your responsibilities.'}
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={declineConsent} type="button">
              <X size={15} aria-hidden="true" />
              {isRestricted ? 'Keep Declined' : 'Decline'}
            </Button>
            <Button onClick={acceptConsent} type="button">
              {isRestricted ? 'Accept & Unlock' : 'Accept & Continue'}
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
