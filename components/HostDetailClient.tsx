'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import Link from '@/components/SiteLink'
import { type Host } from '../lib/hosts'
import { slugify } from '../lib/slugify'
import { getLanguageName } from '../lib/getLanguageName'
import { ArrowLeft, Check, Copy, Cpu, GitCompare, Crosshair, ExternalLink, Gift, HardDrive, Info, Languages, Link as LinkIcon, MapPin, MemoryStick, Settings, Star, ThumbsDown, ThumbsUp, RefreshCw, Moon, Coins, Boxes, Network, Save, Globe, Database, ShieldCheck } from 'lucide-react'
import { DiscordIcon } from './BrandIcons'
import HostFaq from './HostFaq'
import { showToast } from '../lib/toast'
import { isHttpUrl } from '../lib/url'
import { useFavorites } from '../contexts/FavoritesContext'
import { computeRating } from '../lib/comparisonRows'
import { ramDisplay, diskDisplay } from '../lib/specs'
import { providerKind, hasPublishedSpecs, splitTargets } from '../lib/taxonomy'
import { extractDomainNames } from '../lib/domains'
import HostBadges from './HostBadges'
import { classifyLinks, extractLocations, hasSubstantiveFreePlan, locationFlagSrc, detectFeatures, buildHostFaq } from '../lib/hostContent'

interface HostDetailClientProps { host: Host; related?: Host[]; alternativesCount?: number }

// Hoisted so render doesn't allocate a fresh object per host per render.
const RELATED_BADGE_STYLE = { fontSize: '10px', padding: '1px 6px' } as const;
const RELATED_EXT_LABEL_STYLE = { color: 'var(--accent-2)', fontWeight: '700', marginBottom: '2px' } as const;
const RELATED_EXT_ITEM_STYLE = { fontSize: '11px', opacity: 0.9 } as const;
const RELATED_EXT_MORE_STYLE = { fontSize: '10px', opacity: 0.7, fontStyle: 'italic', marginTop: '2px' } as const;
const RELATED_SUBDOMAIN_STYLE = { opacity: 0.7 } as const;
const RELATED_SUBDOMAIN_TEXT_STYLE = { fontStyle: 'italic' } as const;
const RELATED_TARGET_BADGE_STYLE = { fontSize: '10px', padding: '2px 8px' } as const;
const RELATED_RATING_STYLE = { marginLeft: 'auto', fontSize: '11px', color: 'var(--accent-2)', fontWeight: '800' } as const;
const DISCLAIMER_STYLE = { color: 'var(--muted)', fontSize: 'var(--font-size-sm)', margin: 'var(--space-md) 0 0', lineHeight: 1.6, textAlign: 'center' } as const;

export default function HostDetailClient({ host, related = [], alternativesCount = 0 }: HostDetailClientProps) {
  const [showDiscordModal, setShowDiscordModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const totalReviews = (host.approvals || 0) + (host.disapprovals || 0)
  // computeRating returns -1 when there are no reviews — preserve the
  // sentinel instead of clamping it to 0% (which would fake a score).
  const rawRating = computeRating(host)
  const rating = rawRating < 0 ? null : Math.round(rawRating)
  const locations = extractLocations(host.info);
  const classifiedLinks = classifyLinks(host.links || []);

  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (copyTimer.current !== null) clearTimeout(copyTimer.current)
  }, [])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      showToast('Link copied to clipboard!')
      if (copyTimer.current !== null) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Failed to copy link', 'error')
    }
  }, [])

  // Turn plain-text URLs into real anchors. Only http(s) matches, so
  // javascript:/data: can never slip through. Direct links (not the
  // /redirect/ wrapper) because info URLs aren't necessarily in the
  // host's allowlisted links.
  function linkify(text: string, keyPrefix: string): React.ReactNode {
    const parts = text.split(/(https?:\/\/[^\s`'"<>)\]]+)/g)
    if (parts.length === 1) return text
    return parts.map((p, i) =>
      isHttpUrl(p)
        ? <a key={`${keyPrefix}-${i}`} href={p} target="_blank" rel="noopener noreferrer" className="info-link">{p}</a>
        : p
    )
  }

  function formatInfoLines(text?: string): React.ReactNode {
    if (!text) return null
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l)
    const nodes: React.ReactNode[] = []
    let items: React.ReactNode[] = []
    let subItems: React.ReactNode[] = []
    let tableRows: string[][] = []

    const flushItems = () => {
      if (items.length > 0) {
        nodes.push(<ul key={`ul-${nodes.length}`}>{items}</ul>)
        items = []
      }
    }

    const flushSub = () => {
      if (subItems.length > 0) {
        items.push(<ul key={`sub-${items.length}`}>{subItems}</ul>)
        subItems = []
      }
    }

    const flushTable = () => {
      if (tableRows.length > 0) {
        flushItems()
        nodes.push(
          <table key={`table-${nodes.length}`} className="info-table">
            <tbody>
              {tableRows.map((cells, r) => (
                <tr key={r}>
                  {cells.map((cell, ci) => <td key={ci}>{linkify(cell, `t${r}-${ci}`)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )
        tableRows = []
      }
    }

    lines.forEach((line, i) => {
      // strip markdown code-fence backticks and bullet markers
      const cleaned = line.replace(/^`+/, '').replace(/`+$/, '').replace(/^[-–•*]\s*/, '').trim()
      const isBullet = /^[-–•*]/.test(line.trim())
      // pipe-delimited line with >= 2 cells → part of a table
      const cells = cleaned.split('|').map(c => c.trim()).filter(c => c)
      if (cells.length >= 2 && cleaned.includes('|')) {
        flushSub()
        tableRows.push(cells)
        return
      }
      flushTable()
      if (isBullet) {
        subItems.push(<li key={i}>{linkify(cleaned, `s${i}`)}</li>)
      } else {
        flushSub()
        items.push(<li key={i}>{linkify(cleaned, `l${i}`)}</li>)
      }
    })
    flushSub()
    flushTable()
    flushItems()

    return <>{nodes}</>
  }

  // Factual summary derived from the listing's own structured data —
  // used as the answer block under the first heading. Adapts to what the
  // provider actually publishes: full specs, partial, or none (common for
  // static platforms like Cloudflare Pages and for subdomain/domain givers).
  const kind = providerKind(host)
  const languagesText = (host.locale || []).map(l => getLanguageName(l)).filter(Boolean)
  const ramValue = ramDisplay(host)
  const diskValue = diskDisplay(host)
  const targetsText = splitTargets(host).map(t => t.toLowerCase()).join(' / ') || 'hosting'
  let aboutSummary: string
  if (kind === 'subdomains') {
    aboutSummary =
      `${host.name} gives out free subdomains under its own domain names — the quickest way to give an existing project a memorable web address. It does not provide server resources itself; pair it with any hosting provider in this directory.`
  } else if (kind === 'domains') {
    aboutSummary =
      `${host.name} registers free domain names you can point at any host. Available extensions rotate as registries change, so confirm the current list on its site before committing a project to one.`
  } else {
    const specBits: string[] = []
    if (hasPublishedSpecs(host)) {
      if (host.cpu && host.cpu !== 'Unknown') specBits.push(`${host.cpu} CPU`)
      if (ramValue !== 'Unknown') specBits.push(`${ramValue} of RAM`)
      if (diskValue !== 'Unknown') specBits.push(`${diskValue} of storage`)
    }
    const specSentence = specBits.length > 0
      ? `Its free plan publishes ${specBits.join(', ')}.`
      : `It does not publish fixed CPU, RAM, or storage numbers for its free plan — capacity is typically flexible within fair-use limits, so check its site for specifics.`
    // Only true statements from the listing itself: no filler when there are
    // no reviews, no invented meanings — the badge and places are real data.
    const extras: string[] = []
    if (host.trusted) extras.push('It carries a Trusted badge in our directory.')
    if (locations.length > 0) extras.push(`Servers are listed in ${locations.join(', ')}.`)
    if (totalReviews > 0 && rating !== null) extras.push(`It holds a ${rating}% community score across ${totalReviews} review${totalReviews === 1 ? '' : 's'}.`)
    aboutSummary =
      `${host.name} is a free ${targetsText} provider. ${specSentence}${extras.length > 0 ? ` ${extras.join(' ')}` : ''}`
  }

  // Derived per related host once (domain extraction + rating), not on
  // every render of the parent.
  const relatedCards = useMemo(() => related.map((r) => {
    const rStatusClass = r.status && r.status.toLowerCase() === 'online' ? 'online' : 'closed'
    const rValue = computeRating(r)
    const rRating = rValue < 0 ? null : Math.round(rValue)
    const isDomainHost = r.targets?.some(t => t.toLowerCase().includes('domain'))
    const isSubdomainHost = !isDomainHost && r.targets?.some(t => t.toLowerCase().includes('subdomain'))
    const combinedText = `${r.info || ''}\n${r.description || ''}\n${r.free_plan || ''}`
    const allExtractedDomains = isDomainHost ? extractDomainNames(combinedText) : []
    return {
      host: r,
      rStatusClass,
      rRating,
      isDomainHost: !!isDomainHost,
      isSubdomainHost: !!isSubdomainHost,
      extractedDomains: allExtractedDomains.slice(0, 5),
      hasMoreDomains: allExtractedDomains.length > 5,
    }
  }), [related])

  // Interstitial URL for an outbound host link, as a pure function so the
  // link renders as a real anchor (prefetchable, middle-clickable,
  // no-JS-friendly) instead of window.open().
  function redirectHref(url: string): string {
    // Normalise the URL — add scheme if missing so new URL() can parse it
    const normalised = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`

    let redirectPath: string
    try {
      const urlObj = new URL(normalised)
      // Build path as: hostname + pathname + search (query string)
      // We keep the full path so the server can validate the domain and
      // reconstruct the correct target URL including query params.
      const pathAndQuery = urlObj.pathname !== '/'
        ? urlObj.pathname + urlObj.search
        : urlObj.search
      redirectPath = urlObj.hostname + pathAndQuery
    } catch {
      // Truly malformed URL — strip scheme and use as-is
      redirectPath = url.replace(/^https?:\/\//, '')
    }

    // Each segment of the path must be individually encoded so that special
    // characters like ?, &, =, # don't get interpreted as URL syntax by the
    // browser or Next.js router before the server receives them.
    const encodedPath = redirectPath
      .split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/')

    return `/hosts/${slugify(host.name)}/redirect/${encodedPath}`
  }

  return (
    <>
      <main className="host-detail-page">
        <div className="wrap">
          <div className="host-detail-back-section">
            <Link href="/hosts" className="host-detail-back-btn">
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to All Hosts</span>
            </Link>
            {alternativesCount >= 2 && (
              <Link href={`/alternatives/${slugify(host.name)}`} className="host-detail-back-btn">
                <GitCompare size={16} aria-hidden="true" />
                <span>View {host.name} alternatives</span>
              </Link>
            )}
          </div>

          <div className="host-detail-header">
            <div className="host-detail-title-section">
              <h1 className="host-detail-title">{host.name}</h1>
              <div className="host-detail-badges">
                <HostBadges host={host} />
              </div>
            </div>
            <div className="host-detail-header-actions">
              <button
                className={`favorite-btn icon-btn${isFavorite(host.id) ? ' active' : ''}`}
                onClick={() => toggleFavorite(host.id)}
                aria-pressed={isFavorite(host.id)}
                aria-label={isFavorite(host.id) ? `Remove ${host.name} from favorites` : `Add ${host.name} to favorites`}
                title={isFavorite(host.id) ? 'Remove from saved' : 'Save host'}
                type="button"
              >
                <Star size={16} aria-hidden="true" fill={isFavorite(host.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                className="copy-link-btn"
                onClick={handleCopyLink}
                aria-label="Copy link to this host"
                title={copied ? 'Copied!' : 'Copy link'}
              >
                {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className="host-detail-grid">
            <div className="host-detail-main">
              <section className="info-section">
                <h2 className="info-title"><Info size={14} aria-hidden="true" /> About {host.name}</h2>
                <p className="host-about-summary">{aboutSummary}</p>
              </section>

              {host.info && host.info.trim() && (
                <div className="info-section">
                  <h2 className="info-title"><Info size={14} aria-hidden="true" /> Information</h2>
                  <div className="info-box">{formatInfoLines(host.info)}</div>
                </div>
              )}

              {hasSubstantiveFreePlan(host.free_plan) && (
                <div className="info-section">
                  <h2 className="info-title"><Gift size={14} aria-hidden="true" /> Free Plan</h2>
                  <div className="info-box">{formatInfoLines(host.free_plan)}</div>
                </div>
              )}

              {locations.length > 0 && (
                <div className="info-section">
                  <h2 className="info-title"><MapPin size={14} aria-hidden="true" /> Server Locations</h2>
                  <div className="targets-container">
                    {locations.map(loc => {
                      const src = locationFlagSrc(loc);
                      return (
                        <span key={loc} className="target-card server-location-card location-badge">
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
                  </div>
                </div>
              )}

                {kind === 'hosting' && (
                  <div className="info-section">
                    <h2 className="info-title"><Settings size={14} aria-hidden="true" /> Key Specifications</h2>
                   <div className="specs-grid">
                     <div className="spec-box">
                       <div className="spec-box-icon"><Cpu size={20} aria-hidden="true" /></div>
                       <div className="spec-box-label">CPU</div>
                       <div className="spec-box-value">{host.cpu || 'Unknown'}</div>
                     </div>
                     <div className="spec-box">
                       <div className="spec-box-icon"><MemoryStick size={20} aria-hidden="true" /></div>
                       <div className="spec-box-label">RAM</div>
                       <div className="spec-box-value">{ramValue !== 'Unknown' ? ramValue : host.ram || 'Unknown'}</div>
                     </div>
                     <div className="spec-box">
                       <div className="spec-box-icon"><HardDrive size={20} aria-hidden="true" /></div>
                       <div className="spec-box-label">Storage</div>
                       <div className="spec-box-value">{diskValue !== 'Unknown' ? diskValue : host.disk || 'Unknown'}</div>
                     </div>
                      <div className="spec-box">
                        <div className="spec-box-icon"><Languages size={20} aria-hidden="true" /></div>
                        <div className="spec-box-label">Languages</div>
                        <div className="spec-box-value">{languagesText.length > 0 ? languagesText.join(', ') : 'Unknown'}</div>
                      </div>
                    </div>
                    {!hasSubstantiveFreePlan(host.free_plan) && host.free_plan?.trim() && (
                      <p className="host-about-summary cmp-dim">Plan note: {host.free_plan.trim()}</p>
                    )}
                  </div>
                )}

              {host.targets && host.targets.length > 0 && (
                <div className="info-section">
                  <h2 className="info-title"><Crosshair size={14} aria-hidden="true" /> Targets</h2>
                  <div className="targets-container">
                    {(host.targets || []).flatMap(target =>
                      target.split(',').map(t => {
                        const d = t.trim()
                        const targetName = d.replace(/\s*\([^)]*\)/g, '').trim()
                        return targetName ? (
                          <Link key={d} href={`/hosts?target=${encodeURIComponent(targetName)}`} className="target-card">
                            <p className="target-name">{d}</p>
                          </Link>
                        ) : null
                      }).filter(Boolean)
                    )}
                  </div>
                </div>
              )}

              {classifiedLinks.length > 0 && (
                <div className="info-section">
                  <h2 className="info-title"><LinkIcon size={14} aria-hidden="true" /> Links</h2>
                  <div className="links-list">
                    {classifiedLinks.map((link) => (
                      <a key={link.url} className="link-item" href={redirectHref(link.url)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} aria-hidden="true" />{' '}
                        <span><strong>{link.label}</strong><span className="cmp-muted"> · {link.url}</span></span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="host-detail-sidebar">
              <div className="rating-section-fullpage">
                <div className="rating-big">{rating !== null ? `${rating}%` : 'N/A'}</div>
                <div className="rating-votes">(Based on {totalReviews} review{totalReviews === 1 ? '' : 's'})</div>
                <Link href="/methodology#votes" className="methodology-link">
                  How reviews work
                </Link>
                <div className="vote-stats">
                  <div className="vote-stat">
                    <div className="vote-count vote-up">{host.approvals || 0}</div>
                    <div className="vote-label">Upvotes</div>
                  </div>
                  <div className="vote-stat">
                    <div className="vote-count vote-down">{host.disapprovals || 0}</div>
                    <div className="vote-label">Downvotes</div>
                  </div>
                </div>
                <div className="vote-buttons">
                  <button className="vote-btn" onClick={() => setShowDiscordModal(true)}>
                    <ThumbsUp size={14} aria-hidden="true" /> Upvote
                  </button>
                  <button className="vote-btn" onClick={() => setShowDiscordModal(true)}>
                    <ThumbsDown size={14} aria-hidden="true" /> Downvote
                  </button>
                </div>
                <p style={DISCLAIMER_STYLE}>
                  Specs as published by the provider; community scores are opinions, not measurements.
                </p>
              </div>
            </div>
          </div>

          {/* Related Hosts Section */}
          {related.length > 0 && (
            <div className="related-hosts-section">
              <h2 className="section-title">Similar Hosting Providers</h2>
              <div className="related-hosts-grid">
                {relatedCards.map(({ host: r, rStatusClass, rRating, isDomainHost, isSubdomainHost, extractedDomains, hasMoreDomains }) => {
                  return (
                    <Link key={r.id} href={`/hosts/${slugify(r.name)}`} className="related-host-card">
                      <div className="related-host-icon">{r.name.charAt(0).toUpperCase()}</div>
                      <div className="related-host-info">
                        <div className="related-host-name-row">
                          <div className="related-host-name">{r.name}</div>
                          <span className={`status-badge ${rStatusClass}`} style={RELATED_BADGE_STYLE}>
                            {r.status || 'Unknown'}
                          </span>
                        </div>

                          {isDomainHost && extractedDomains.length > 0 ? (
                            <div className="related-host-meta">
                              <div className="related-host-spec" style={RELATED_EXT_LABEL_STYLE}>
                                <LinkIcon size={12} aria-hidden="true" />
                                <span>Available Extensions:</span>
                              </div>
                              {extractedDomains.map(domain => {
                                const cleanDomain = domain.replace(/^[-\s•*]+/, '');
                                return (
                                  <div key={domain} className="related-host-spec" style={RELATED_EXT_ITEM_STYLE}>
                                    • {cleanDomain}
                                  </div>
                                );
                              })}
                              {hasMoreDomains && (
                                <div className="related-host-spec" style={RELATED_EXT_MORE_STYLE}>
                                  + more extensions available
                                </div>
                              )}
                            </div>
                          ) : isSubdomainHost ? (
                            <div className="related-host-meta" style={RELATED_SUBDOMAIN_STYLE}>
                              <div className="related-host-spec" style={RELATED_SUBDOMAIN_TEXT_STYLE}>
                                Free subdomain hosting
                              </div>
                            </div>
                          ) : (
                           <div className="related-host-meta">
                             <div className="related-host-spec">
                               <Cpu size={14} aria-hidden="true" />
                               <span>{r.cpu || 'Unknown'}</span>
                             </div>
                              <div className="related-host-spec">
                                <MemoryStick size={14} aria-hidden="true" />
                                <span>{ramDisplay(r) !== 'Unknown' ? ramDisplay(r) : 'Free'}</span>
                              </div>
                              <div className="related-host-spec">
                                <HardDrive size={14} aria-hidden="true" />
                                <span>{diskDisplay(r)}</span>
                              </div>
                           </div>
                         )}

                        <div className="related-host-targets">
                          {r.targets?.slice(0, 3).map(t => (
                            <span key={t} className="target-badge" style={RELATED_TARGET_BADGE_STYLE}>
                              {t.split(',')[0]}
                            </span>
                          ))}
                          {rRating !== null && (
                            <span className="rating-badge" style={RELATED_RATING_STYLE}>
                              {rRating}%
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {showDiscordModal && (
        <>
          <div
            className="discord-overlay active"
            onClick={() => setShowDiscordModal(false)}
            role="button"
            tabIndex={0}
            aria-label="Close dialog"
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setShowDiscordModal(false); }}
          />
          <div className="discord-modal active" role="dialog" aria-modal="true" aria-label="Discord required">
            <div className="discord-icon">
              <DiscordIcon aria-hidden="true" />
            </div>
            <h3 className="discord-title">Discord Required</h3>
            <p className="discord-text">You can only vote and review hosts in the Discord server!</p>
            <button className="discord-btn" onClick={() => setShowDiscordModal(false)}>Got it</button>
          </div>
        </>
      )}
    </>
  )
}
