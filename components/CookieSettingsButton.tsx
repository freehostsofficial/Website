'use client';

import { useConsent } from '@/contexts/ConsentContext';

// Footer entry that re-opens the banner straight into the preferences view,
// so visitors can review or withdraw consent at any time (GDPR Art. 7(3)).
export default function CookieSettingsButton() {
  const { openBanner } = useConsent();

  return (
    <button
      type="button"
      className="footer-cookie-btn"
      onClick={() => openBanner('customize')}
    >
      Cookie Settings
    </button>
  );
}
