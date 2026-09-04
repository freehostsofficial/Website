import Link from '@/components/SiteLink';

// Shared centered hero (was copy-pasted in compare, saved, hosts, faq,
// categories, vs, alternatives — same blobs + hero-inner + h1 + lead).
export function PageHero({
  title,
  titleId,
  lead,
  heroClass = '',
  sectionId,
}: {
  title: string;
  titleId: string;
  lead: React.ReactNode;
  heroClass?: string;
  sectionId?: string;
}) {
  return (
    <section
      className={`hero centered-hero${heroClass ? ` ${heroClass}` : ''}`}
      id={sectionId}
      aria-labelledby={titleId}
    >
      <div className="blobs" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>
      <div className="hero-inner">
        <div className="hero-left">
          <h1 id={titleId}>{title}</h1>
          <p className="lead">{lead}</p>
        </div>
      </div>
    </section>
  );
}

// Shared empty state (was duplicated in compare + saved).
export function EmptyState({
  icon,
  title,
  children,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="compare-empty-state">
      <div className="compare-empty-icon" aria-hidden="true">
        {icon}
      </div>
      <h2 className="compare-empty-title">{title}</h2>
      <p className="compare-empty-desc">{children}</p>
      <div className="compare-empty-actions">
        {actions ?? (
          <Link href="/hosts" className="btn primary">
            Browse Hosts
          </Link>
        )}
      </div>
    </div>
  );
}
