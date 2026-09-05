'use client';

import { useState } from 'react';
import { ChevronDown, CircleHelp } from 'lucide-react';
import { safeJsonLd } from '../lib/safeJsonLd';
import type { HostFaqItem } from '../lib/hostContent';

// Per-host FAQ accordion. Questions are generated from the listing's own
// data (see buildHostFaq) — each answer is either a matched listing sentence
// or an always-true statement, never invented. Includes FAQPage JSON-LD.
export default function HostFaq({ hostName, items }: { hostName: string; items: HostFaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q.includes(hostName) ? item.q : `${item.q} (${hostName})`,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section className="info-section" aria-labelledby="host-faq-heading">
      <h2 className="info-title" id="host-faq-heading">
        <CircleHelp size={14} aria-hidden="true" /> Frequently asked questions
      </h2>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <div className="host-faq">
        {items.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q} className="host-faq-item">
              <h3 className="host-faq-q-wrap">
                <button
                  type="button"
                  className="host-faq-q"
                  aria-expanded={open}
                  aria-controls={`host-faq-a-${i}`}
                  id={`host-faq-q-${i}`}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
              </h3>
              {open && (
                <div
                  id={`host-faq-a-${i}`}
                  role="region"
                  aria-labelledby={`host-faq-q-${i}`}
                  className="host-faq-a"
                >
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
