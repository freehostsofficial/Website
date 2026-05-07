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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0a0f1e',
            backgroundImage: 'linear-gradient(to bottom right, #0a0f1e, #141824)',
            padding: '80px',
          }}
        >
          {/* Left Side: Host Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {/* Host Name */}
            <div
              style={{
                display: 'flex',
                fontSize: '84px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '24px',
                maxWidth: '700px',
              }}
            >
              <span>{name}</span>
            </div>

            {/* Targets */}
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                color: '#94a3b8',
                marginBottom: '48px',
                flexWrap: 'wrap',
              }}
            >
              <span>{targets}</span>
            </div>

            {/* Specs Row */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '40px',
                marginBottom: '48px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', fontSize: '18px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                  <span>CPU</span>
                </div>
                <div style={{ display: 'flex', fontSize: '28px', color: 'white', fontWeight: 600 }}>
                  <span>{cpu}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', fontSize: '18px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                  <span>RAM</span>
                </div>
                <div style={{ display: 'flex', fontSize: '28px', color: 'white', fontWeight: 600 }}>
                  <span>{ram}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', fontSize: '18px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                  <span>Disk</span>
                </div>
                <div style={{ display: 'flex', fontSize: '28px', color: 'white', fontWeight: 600 }}>
                  <span>{disk}</span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', fontSize: '32px', fontWeight: 800, color: '#4ade80', marginRight: '12px' }}>
                  <span>{rating}%</span>
                </div>
                <div style={{ display: 'flex', fontSize: '18px', color: '#4ade80', fontWeight: 600 }}>
                  <span>Positive Reviews</span>
                </div>
              </div>
              <div style={{ display: 'flex', fontSize: '18px', color: '#64748b' }}>
                <span>Based on {totalReviews} community reviews</span>
              </div>
            </div>
          </div>

          {/* Right Side: Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '40px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="FreeHosts Logo"
              width={320}
              height={320}
              style={{
                display: 'flex',
                filter: 'drop-shadow(0 0 30px rgba(99, 102, 241, 0.3))',
              }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.log(`${(e as Error).message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
