'use client';

import { useState } from 'react';
import { useConsent } from '@/contexts/ConsentContext';
import type { ConsentSelection, PreferenceSelection } from '@/lib/cookies';
import {
  Cookie,
  ArrowLeft,
  SlidersHorizontal,
  ShieldCheck,
  Settings,
  Activity,
  ChevronDown,
} from 'lucide-react';

// Two-layer consent card: compact choice first, per-category + per-cookie
// control on demand. Non-modal — the page stays fully usable behind it.

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="ck-switch"
      onClick={() => onChange(!checked)}
    />
  );
}

function CategoryCard({
  id,
  icon,
  title,
  note,
  master,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  note: string;
  master: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `ck-subs-${id}`;

  return (
    <div className="ck-cat">
      <div className="ck-cat-top">
        <span className="ck-cat-icon" aria-hidden="true">
          {icon}
        </span>
        <button
          type="button"
          className="ck-cat-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="ck-cat-title">
            {title}
            <ChevronDown size={14} aria-hidden="true" className="ck-chev" />
          </span>
          <span className="ck-cat-note">{note}</span>
        </button>
        {master}
      </div>
      {open && (
        <div className="ck-subs" id={panelId}>
          {children}
        </div>
      )}
    </div>
  );
}

function SubRow({
  name,
  meta,
  control,
}: {
  name: string;
  meta: string;
  control?: React.ReactNode;
}) {
  return (
    <div className="ck-sub">
      <div className="ck-row-text">
        <span className="ck-cookie-name">{name}</span>
        <span className="ck-cookie-meta">{meta}</span>
      </div>
      {control}
    </div>
  );
}

function FirstRun({ onCustomize }: { onCustomize: () => void }) {
  const { acceptAll, rejectAll } = useConsent();
  return (
    <>
      <div className="ck-head">
        <span className="ck-icon" aria-hidden="true">
          <Cookie size={20} />
        </span>
        <h2 className="ck-title">We value your privacy</h2>
      </div>
      <p className="ck-text">
        We use cookies to run this site and — with your permission — remember
        your preferences and measure visits.{' '}
        <a className="ck-link" href="/cookies">
          Cookie Policy
        </a>
      </p>
      <div className="ck-actions">
        <button type="button" className="ck-btn ck-reject" onClick={rejectAll}>
          Reject all
        </button>
        <button type="button" className="ck-btn ck-accept" onClick={acceptAll}>
          Accept all
        </button>
      </div>
      <button type="button" className="ck-customize" onClick={onCustomize}>
        <SlidersHorizontal size={13} aria-hidden="true" /> Customize
      </button>
    </>
  );
}

function Preferences({ onBack }: { onBack: () => void }) {
  const { selection, acceptAll, rejectAll, saveSelection } = useConsent();
  const [prefs, setPrefs] = useState<PreferenceSelection>(
    selection?.preferences ?? { theme: false, favorites: false, comparison: false },
  );
  const [statistics, setStatistics] = useState(selection?.statistics ?? false);

  const setPref = (key: keyof PreferenceSelection) => (next: boolean) =>
    setPrefs((prev) => ({ ...prev, [key]: next }));

  const allPrefsOn = prefs.theme && prefs.favorites && prefs.comparison;
  const setAllPrefs = (next: boolean) =>
    setPrefs({ theme: next, favorites: next, comparison: next });

  const save = () =>
    saveSelection({ preferences: prefs, statistics } satisfies ConsentSelection);

  return (
    <>
      <div className="ck-head">
        <span className="ck-icon" aria-hidden="true">
          <Cookie size={20} />
        </span>
        <h2 className="ck-title">Cookie preferences</h2>
      </div>
      <p className="ck-text">
        Toggle a whole category, or expand it and allow cookies one by one.
      </p>

      <div className="ck-rows">
        <CategoryCard
          id="necessary"
          icon={<ShieldCheck size={15} aria-hidden="true" />}
          title="Strictly necessary"
          note="Required for the site to function"
          master={<span className="ck-locked">Always on</span>}
        >
          <SubRow
            name="fh_consent"
            meta="Remembers your privacy choice · 6 months"
            control={<span className="ck-locked">Always on</span>}
          />
        </CategoryCard>

        <CategoryCard
          id="preferences"
          icon={<Settings size={15} aria-hidden="true" />}
          title="Preferences"
          note="Convenience features, stored on this device only"
          master={
            <Switch
              checked={allPrefsOn}
              onChange={setAllPrefs}
              label="All preference cookies"
            />
          }
        >
          <SubRow
            name="fh_theme"
            meta="Remembers dark / light mode · Until cleared"
            control={
              <Switch checked={prefs.theme} onChange={setPref('theme')} label="Remember theme" />
            }
          />
          <SubRow
            name="fh_favorites"
            meta="Remembers your saved hosts · 90 days"
            control={
              <Switch
                checked={prefs.favorites}
                onChange={setPref('favorites')}
                label="Remember saved hosts"
              />
            }
          />
          <SubRow
            name="fh_comparison"
            meta="Remembers your comparison list · Session only"
            control={
              <Switch
                checked={prefs.comparison}
                onChange={setPref('comparison')}
                label="Remember comparison list"
              />
            }
          />
        </CategoryCard>

        <CategoryCard
          id="statistics"
          icon={<Activity size={15} aria-hidden="true" />}
          title="Statistics"
          note="One tracker, one choice — set only when enabled"
          master={
            <Switch
              checked={statistics}
              onChange={setStatistics}
              label="Statistics cookies"
            />
          }
        >
          <SubRow
            name="Matomo _pk_id.*"
            meta="Counts visits, recognizes returners · 13 months"
          />
          <SubRow
            name="Matomo _pk_ses.*"
            meta="Detects repeat visits within minutes · 30 minutes"
          />
        </CategoryCard>
      </div>

      <button type="button" className="ck-btn ck-accept ck-save" onClick={save}>
        Save choices
      </button>
      <div className="ck-pair">
        <button type="button" className="ck-btn ck-reject" onClick={rejectAll}>
          Reject all
        </button>
        <button type="button" className="ck-btn ck-reject" onClick={acceptAll}>
          Accept all
        </button>
      </div>
      <p className="ck-fineprint">
        Stored for 6 months, then we ask again. Change your mind anytime via
        Cookie Settings in the footer.{' '}
        <a className="ck-link" href="/cookies">
          Cookie Policy
        </a>
      </p>
      <button type="button" className="ck-customize" onClick={onBack}>
        <ArrowLeft size={13} aria-hidden="true" /> Back
      </button>
    </>
  );
}

export default function GdprConsentBanner() {
  const { bannerOpen, bannerView, openBanner } = useConsent();

  if (!bannerOpen) return null;

  return (
    <section className="ck-banner" role="region" aria-label="Cookie consent">
      {bannerView === 'main' ? (
        <FirstRun onCustomize={() => openBanner('customize')} />
      ) : (
        <Preferences onBack={() => openBanner('main')} />
      )}
    </section>
  );
}
