import Link from '@/components/SiteLink';

// Shared closing CTA (was copy-pasted in vs, alternatives, categories,
// methodology with different copy but identical markup).
export default function FaqCta({
  title,
  text,
  buttons,
}: {
  title: string;
  text: React.ReactNode;
  buttons: { href: string; label: string; primary?: boolean }[];
}) {
  return (
    <div className="faq-cta">
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="faq-cta-buttons">
        {buttons.map((b) => (
          <Link
            key={b.href + b.label}
            className={`faq-cta-btn${b.primary ? ' primary' : ' secondary'}`}
            href={b.href}
          >
            {b.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
