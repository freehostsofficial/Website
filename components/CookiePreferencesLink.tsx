'use client';

import { useConsent } from '@/contexts/ConsentContext';
import { Cookie } from 'lucide-react';

export default function CookiePreferencesLink() {
  const { openCookiePreferences } = useConsent();

  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="cookie-prefs-footer-link"
    >
      <Cookie size={14} aria-hidden="true" /> Cookie Preferences
    </button>
  );
}
