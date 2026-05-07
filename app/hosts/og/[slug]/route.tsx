import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { fetchHostBySlug, fetchHostById } from '../../../../lib/cache';

export const runtime = 'edge';

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
    const targets = host.targets && host.targets.length > 0
      ? host.targets.join(', ')
      : 'Websites, Bots, Apps';

    const totalReviews = (host.approvals || 0) + (host.disapprovals || 0);
    const rating = totalReviews > 0 ? Math.round(((host.approvals || 0) / totalReviews) * 100) : 0;

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
            backgroundColor: '#050a18',
            padding: '40px 50px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Decorative Blobs */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)', display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0) 70%)', display: 'flex' }} />

          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', fontSize: '20px', fontWeight: 700, color: '#6366f1', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                <span>Free Hosting Directory</span>
              </div>
              <div style={{ display: 'flex', fontSize: '84px', fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-2px' }}>
                <span>{name}</span>
              </div>
            </div>
            {/* Logo */}
            <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo" width={100} height={100} />
            </div>
          </div>

          {/* Targets Pills */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {host.targets?.slice(0, 5).map(t => (
              <div key={t} style={{ display: 'flex', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '18px', fontWeight: 600 }}>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', fontSize: '20px', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <span>Available Extensions</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', maxWidth: '900px' }}>
                      {extractedDomains.map(domain => {
                        const cleanDomain = domain.replace(/^[-\s•*]+/, '');
                        return (
                          <div key={domain} style={{ display: 'flex', padding: '8px 14px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', color: '#818cf8', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
                            {cleanDomain}
                          </div>
                        );
                      })}
                      {hasMoreDomains && (
                        <div style={{ display: 'flex', color: '#64748b', fontSize: '20px', fontWeight: 600, marginLeft: '10px', fontStyle: 'italic' }}>
                          + more available
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else if (host.targets?.some(t => t.toLowerCase().includes('subdomain'))) {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', fontSize: '20px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <span>Free Subdomain Hosting</span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '200px', padding: '24px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>CPU</span>
                      <span style={{ fontSize: '32px', color: 'white', fontWeight: 800 }}>{cpu}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '200px', padding: '24px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>RAM</span>
                      <span style={{ fontSize: '32px', color: 'white', fontWeight: 800 }}>{ram}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '200px', padding: '24px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Disk</span>
                      <span style={{ fontSize: '32px', color: 'white', fontWeight: 800 }}>{disk}</span>
                    </div>
                  </div>
                );
              }
            })()}

            {/* Rating Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', padding: '12px 24px', background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)', borderRadius: '16px', color: 'white', fontSize: '36px', fontWeight: 900, boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)' }}>
                <span>{rating}%</span>
              </div>
              <span style={{ fontSize: '16px', color: '#64748b', marginTop: '12px', fontWeight: 600 }}>{totalReviews} community reviews</span>
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