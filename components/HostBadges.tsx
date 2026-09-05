import { getLanguageName } from '../lib/getLanguageName';
import { extractLocations, locationFlagSrc } from '../lib/hostContent';
import { splitTargets } from '../lib/taxonomy';
import type { Host } from '../lib/hosts';

function LocationBadges({ locations }: { locations: string[] }) {
  return (
    <>
      {locations.slice(0, 4).map((loc) => {
        const src = locationFlagSrc(loc);
        return (
          <span key={loc} className="target-badge location-badge" title={`Server location: ${loc}`}>
            {src && (
              // eslint-disable-next-line @next/next/no-img-element -- 18px decorative flag from the bundled flag-icons package
              <img
                src={src}
                alt=""
                width={18}
                height={12}
                loading="lazy"
                className="hbg-flag"
              />
            )}
            <span className="location-badge-label">{loc}</span>
          </span>
        );
      })}
      {locations.length > 4 && (
        <span className="target-badge" title={locations.slice(4).join(', ')}>
          +{locations.length - 4}
        </span>
      )}
    </>
  );
}

// Labeled badge groups in ONE wrapping row: each cluster is a small caps
// label plus its pills (status, plan, languages, focus, servers). Plain
// div/span hooks only — no element selectors, so theme CSS can never
// silently miss them. Shared by host cards (all groups) and the detail
// header (status/plan/languages — targets and locations have their own
// labeled sections there).
export default function HostBadges({
  host,
  showFocus = false,
  showLocations = false,
}: {
  host: Host;
  showFocus?: boolean;
  showLocations?: boolean;
}) {
  const online = host.status?.toLowerCase() === 'online';
  const languages = [...new Set((host.locale ?? []).map((l) => getLanguageName(String(l).trim())).filter(Boolean))];
  const targets = splitTargets(host);
  const locations = showLocations ? extractLocations(host.info) : [];

  return (
    <div className="hbg-row">
      <span className="hbg">
        <span className="hbg-l">Status</span>
        <span className={`status-badge ${online ? 'online' : 'closed'}`}>{host.status || 'Unknown'}</span>
      </span>
      <span className="hbg">
        <span className="hbg-l">Plan</span>
        <span className="host-type-badge">Free</span>
        {host.trusted && <span className="host-type-badge">Trusted</span>}
      </span>
      {languages.length > 0 && (
        <span className="hbg">
          <span className="hbg-l">{languages.length === 1 ? 'Language' : 'Languages'}</span>
          {languages.map((lang) => (
            <span key={lang} className="language-badge">{lang}</span>
          ))}
        </span>
      )}
      {showFocus && targets.length > 0 && (
        <span className="hbg">
          <span className="hbg-l">Focus</span>
          {targets.slice(0, 3).map((t) => (
            <span key={t} className="target-badge">{t}</span>
          ))}
          {targets.length > 3 && (
            <span className="target-badge" title={targets.slice(3).join(', ')}>
              +{targets.length - 3}
            </span>
          )}
        </span>
      )}
      {showLocations && locations.length > 0 && (
        <span className="hbg">
          <span className="hbg-l">{locations.length === 1 ? 'Location' : 'Locations'}</span>
          <LocationBadges locations={locations} />
        </span>
      )}
    </div>
  );
}
