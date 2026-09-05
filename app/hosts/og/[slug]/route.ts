import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import React from 'react';
import { fetchHosts } from '../../../../lib/hosts';
import { slugify } from '../../../../lib/slugify';
import { ramDisplay, diskDisplay } from '../../../../lib/specs';
import { computeRating } from '../../../../lib/comparisonRows';
import { extractDomainNames } from '../../../../lib/domains';
import { SITE_URL } from '../../../../lib/site';

// OG images render from fetchHosts()' cached data; the versioned URL (?v=)
// plus the immutable CDN tier in next.config.ts govern freshness.
type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const all = await fetchHosts();
    const host = /^\d+$/.test(slug)
      ? all.find(h => h.id === Number(slug))
      : all.find(h => slugify(h.name) === slug);

    if (!host) {
      return new Response('Host not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

    // Parse data from host object
    const name = host.name || 'Hosting Provider';
    const cpu = host.cpu || 'Unknown';
    const ram = ramDisplay(host);
    const disk = diskDisplay(host);

    const totalVotes = (host.approvals || 0) + (host.disapprovals || 0);
    const rawRating = computeRating(host);
    const rating = rawRating < 0 ? 0 : Math.round(rawRating);

    // Base URL for assets — canonical origin, not the Host header.
    const siteUrl = SITE_URL;
    const logoUrl = `${siteUrl}/Src/icons/icon-transparent.png`;

    const h = React.createElement;

    const allExtractedDomains = extractDomainNames(`${host.info || ''}\n${host.description || ''}\n${host.free_plan || ''}`);
    const extractedDomains = allExtractedDomains.slice(0, 8);
    const hasMoreDomains = allExtractedDomains.length > 8;

    const isDomainHost = host.targets?.some(t => t.toLowerCase().includes('domain')) && extractedDomains.length > 0;
    const isSubdomainHost = !isDomainHost && host.targets?.some(t => t.toLowerCase().includes('subdomain'));

    const specsContent = isDomainHost
      ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
          h('div', { style: { display: 'flex', fontSize: '20px', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '1px' } },
            h('span', null, 'Available Extensions')),
          h('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', maxWidth: '900px' } },
            ...extractedDomains.map(domain => {
              const cleanDomain = domain.replace(/^[-\s•*]+/, '');
              return h('div', { key: domain, style: { display: 'flex', padding: '8px 14px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', color: '#818cf8', fontSize: '20px', fontWeight: 700, marginBottom: '6px' } }, cleanDomain);
            }),
            ...(hasMoreDomains ? [h('div', { style: { display: 'flex', color: '#64748b', fontSize: '20px', fontWeight: 600, marginLeft: '10px', fontStyle: 'italic' } }, '+ more available')] : [])))
      : isSubdomainHost
        ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
            h('div', { style: { display: 'flex', fontSize: '20px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px' } },
              h('span', null, 'Free Subdomain Hosting')))
        : h('div', { style: { display: 'flex', gap: '30px' } },
            h('div', { style: { display: 'flex', flexDirection: 'column', width: '200px', padding: '24px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' } },
              h('span', { style: { fontSize: '16px', color: '#64748b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' } }, 'CPU'),
              h('span', { style: { fontSize: '32px', color: 'white', fontWeight: 800 } }, cpu)),
            h('div', { style: { display: 'flex', flexDirection: 'column', width: '200px', padding: '24px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' } },
              h('span', { style: { fontSize: '16px', color: '#64748b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' } }, 'RAM'),
              h('span', { style: { fontSize: '32px', color: 'white', fontWeight: 800 } }, ram)),
            h('div', { style: { display: 'flex', flexDirection: 'column', width: '200px', padding: '24px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' } },
              h('span', { style: { fontSize: '16px', color: '#64748b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' } }, 'Disk'),
              h('span', { style: { fontSize: '32px', color: 'white', fontWeight: 800 } }, disk)));

    const ratingBadge = totalVotes === 0
      ? h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' } },
          h('div', { style: { display: 'flex', padding: '12px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', color: '#94a3b8', fontSize: '28px', fontWeight: 800 } },
            h('span', null, 'No votes yet')))
      : h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' } },
          h('div', { style: { display: 'flex', padding: '12px 24px', background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)', borderRadius: '16px', color: 'white', fontSize: '36px', fontWeight: 900, boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)' } },
            h('span', null, `${rating}%`)),
          h('span', { style: { fontSize: '16px', color: '#64748b', marginTop: '12px', fontWeight: 600 } }, `${totalVotes} community reviews`));

    const element = h('div',
      {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#050a18',
          padding: '40px 50px',
          position: 'relative',
          overflow: 'hidden',
        },
      },
      h('div', { style: { position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)', display: 'flex' } }),
      h('div', { style: { position: 'absolute', bottom: '-150px', left: '-150px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0) 70%)', display: 'flex' } }),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', width: '100%' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1 } },
          h('div', { style: { display: 'flex', fontSize: '20px', fontWeight: 700, color: '#6366f1', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' } },
            h('span', null, 'Free Hosting Directory')),
          h('div', { style: { display: 'flex', fontSize: '84px', fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-2px' } },
            h('span', null, name))),
        h('div', { style: { display: 'flex', backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' } },
          h('img', { src: logoUrl, alt: `${name} logo`, width: 100, height: 100 }))),
      h('div', { style: { display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' } },
        ...(host.targets?.slice(0, 5).map(t =>
          h('div', { key: t, style: { display: 'flex', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '18px', fontWeight: 600 } }, t),
        ) ?? [])),
      h('div', { style: { display: 'flex', flex: 1, alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' } },
        specsContent,
        ratingBadge),
    );

    return new ImageResponse(
      element,
      {
        width: 1200,
        height: 675,
        // Cache-Control comes from next.config.ts (/hosts/og/:slug source) —
        // the single place CDN tiers are defined.
      }
    );
  } catch (e: unknown) {
    console.log(`${(e as Error).message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
      // Cache-Control is set globally in next.config.ts — CDNs do not cache
      // 5xx responses by default, so no header override is needed here.
    });
  }
}
