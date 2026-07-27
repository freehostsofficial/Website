import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { fetchHostBySlug, fetchHostById } from '../../../../lib/cache';

export const runtime = 'edge';

// Literal hex values mirroring the site's design tokens (defined in
// app/src/css/globals.css). Satori (next/og) renders outside the browser
// and cannot read CSS custom properties, so the palette is duplicated here
// intentionally — keep these in sync if the token values ever change.
const COLORS = {
  background: '#0a0a0a',
  card: '#121212',
  border: 'rgba(255,255,255,0.10)',
  borderSubtle: 'rgba(255,255,255,0.08)',
  foreground: '#fafafa',
  muted: '#a3a3a3',
  mutedDim: '#71717a',
  accent: '#3ecf6d',
  accentDim: 'rgba(62,207,109,0.12)',
  accentBorder: 'rgba(62,207,109,0.30)',
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    let host;

    if (/^\d+$/.test(slug)) {
      host = await fetchHostById(slug);
    } else {
      host = await fetchHostBySlug(slug);
    }

    if (!host) {
      return new Response('Host not found', { status: 404 });
    }

    // Parse data from host object
    const name = host.name || 'Hosting Provider';
    const cpu = host.cpu || 'Unknown';
    const ram = host.ram || 'Unknown';
    const disk = host.disk || 'Unknown';

    const totalReviews = (host.approvals || 0) + (host.disapprovals || 0);
    const rating = totalReviews > 0 ? Math.round(((host.approvals || 0) / totalReviews) * 100) : 0;
    const isOnline = host.status?.toLowerCase() === 'online';

    // Base URL for assets
    const host_header = req.headers.get('host') || 'freehosts.space';
    const protocol = host_header.includes('localhost') ? 'http' : 'https';
    const siteUrl = `${protocol}://${host_header}`;
    const logoUrl = `${siteUrl}/Src/icons/icon-transparent.png`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: COLORS.background,
            padding: '56px 64px',
            position: 'relative',
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '44px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 600, color: COLORS.muted, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '3px' }}>
                <span style={{ display: 'flex', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS.accent }} />
                <span>Free Hosting Directory</span>
              </div>
              <div style={{ display: 'flex', fontSize: '76px', fontWeight: 700, color: COLORS.foreground, lineHeight: 1.1, letterSpacing: '-2px' }}>
                <span>{name}</span>
              </div>
            </div>
            {/* Logo */}
            <div style={{ display: 'flex', backgroundColor: COLORS.card, padding: '18px', borderRadius: '16px', border: `1px solid ${COLORS.border}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo" width={88} height={88} />
            </div>
          </div>

          {/* Status + Targets Pills */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '44px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                backgroundColor: isOnline ? COLORS.accentDim : 'rgba(229,72,77,0.12)',
                borderRadius: '8px',
                border: `1px solid ${isOnline ? COLORS.accentBorder : 'rgba(229,72,77,0.3)'}`,
                color: isOnline ? COLORS.accent : '#f2777a',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              <span style={{ display: 'flex', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isOnline ? COLORS.accent : '#f2777a' }} />
              {host.status || 'Unknown'}
            </div>
            {host.targets?.slice(0, 4).map(t => (
              <div key={t} style={{ display: 'flex', padding: '9px 18px', backgroundColor: COLORS.card, borderRadius: '8px', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: '18px', fontWeight: 500 }}>
                {t}
              </div>
            ))}
          </div>

          {/* Specs / Content Section */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }}>
            {(() => {
              const combinedText = `${host.info || ''}\n${host.description || ''}\n${host.free_plan || ''}`;
              const allExtractedDomains = combinedText.split('\n')
                .map(l => l.trim())
              .filter(l => /^\s*[-–•*\s]*[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+[\r\n]*$/.test(l))
                .map(l => l.replace(/^[-–•*\s]+/, '').trim().split(/\s/)[0])
              const extractedDomains = allExtractedDomains.slice(0, 8)
              const hasMoreDomains = allExtractedDomains.length > 8

              if (host.targets?.some(t => t.toLowerCase().includes('domain')) && extractedDomains.length > 0) {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'flex', fontSize: '18px', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '2px' }}>
                      <span>Available Extensions</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', maxWidth: '900px' }}>
                      {extractedDomains.map(domain => {
                        const cleanDomain = domain.replace(/^[-\s•*]+/, '');
                        return (
                          <div key={domain} style={{ display: 'flex', padding: '9px 16px', backgroundColor: COLORS.accentDim, border: `1px solid ${COLORS.accentBorder}`, borderRadius: '10px', color: COLORS.accent, fontSize: '20px', fontWeight: 700 }}>
                            {cleanDomain}
                          </div>
                        );
                      })}
                      {hasMoreDomains && (
                        <div style={{ display: 'flex', color: COLORS.mutedDim, fontSize: '20px', fontWeight: 500, marginLeft: '6px', fontStyle: 'italic' }}>
                          + more available
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else if (host.targets?.some(t => t.toLowerCase().includes('subdomain'))) {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'flex', fontSize: '18px', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '2px' }}>
                      <span>Free Subdomain Hosting</span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <SpecBox label="CPU" value={cpu} />
                    <SpecBox label="RAM" value={ram} />
                    <SpecBox label="Disk" value={disk} />
                  </div>
                );
              }
            })()}

            {/* Rating Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', padding: '14px 26px', backgroundColor: COLORS.foreground, borderRadius: '10px', color: COLORS.background, fontSize: '34px', fontWeight: 800 }}>
                <span>{rating}%</span>
              </div>
              <span style={{ fontSize: '16px', color: COLORS.mutedDim, marginTop: '12px', fontWeight: 500 }}>{totalReviews} community reviews</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 675,
      }
    );
  } catch (e: unknown) {
    console.log(`${(e as Error).message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '190px', padding: '22px', backgroundColor: COLORS.card, borderRadius: '14px', border: `1px solid ${COLORS.border}` }}>
      <span style={{ fontSize: '15px', color: COLORS.mutedDim, fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
      <span style={{ fontSize: '30px', color: COLORS.foreground, fontWeight: 700 }}>{value}</span>
    </div>
  );
}
