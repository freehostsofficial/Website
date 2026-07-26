'use client'

import React, { useState, useCallback } from 'react'
import Link from '@/components/NoPrefetchLink'
import { type Host } from '../lib/cache'
import { slugify } from '../lib/slugify'
import { getLanguageName } from '../lib/getLanguageName'
import { ArrowLeft, Check, Copy, Cpu, Crosshair, ExternalLink, Gift, HardDrive, Info, Languages, Link as LinkIcon, MemoryStick, Settings, Star, ThumbsDown, ThumbsUp } from 'lucide-react'
import { showToast } from './Toast'
import { useFavorites } from '../contexts/FavoritesContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface HostDetailClientProps { host: Host; related?: Host[] }

export default function HostDetailClient({ host, related = [] }: HostDetailClientProps) {
  const [showDiscordModal, setShowDiscordModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const totalReviews = (host.approvals || 0) + (host.disapprovals || 0)
  const rating = totalReviews > 0 ? Math.round(((host.approvals || 0) / totalReviews) * 100) : 0
  const isOnline = host.status && host.status.toLowerCase() === 'online'
  const typeDisplay = host.type ? host.type.split(',').map(t => t.trim().replace(/\s*\([^)]*\)/g, '').trim()).join(', ') : 'Unknown'

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      showToast('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Failed to copy link', 'error')
    }
  }, [])

  function formatInfoLines(text?: string): React.ReactNode {
    if (!text) return null
    const lines = text.split('\n').filter(l => l.trim())
    const items: React.ReactNode[] = []
    let subItems: React.ReactNode[] = []

    const flushSub = () => {
      if (subItems.length > 0) {
        items.push(<ul key={`sub-${items.length}`} className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">{subItems}</ul>)
        subItems = []
      }
    }

    lines.forEach((line, i) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('-')) {
        subItems.push(<li key={i}>{trimmed.substring(1).trim()}</li>)
      } else {
        flushSub()
        items.push(<li key={i} className="text-sm text-muted-foreground">{trimmed}</li>)
      }
    })
    flushSub()

    return <ul className="space-y-1">{items}</ul>
  }

  function formatSize(mb?: number): string {
    if (!mb) return 'Unknown'
    if (mb >= 1024) return (mb / 1024).toFixed(1) + 'GB'
    return Math.round(mb) + 'MB'
  }

  const handleRedirect = useCallback((url: string) => {
    if (typeof window === 'undefined') return
    const normalised = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
    let redirectPath: string
    try {
      const urlObj = new URL(normalised)
      const pathAndQuery = urlObj.pathname !== '/' ? urlObj.pathname + urlObj.search : urlObj.search
      redirectPath = urlObj.hostname + pathAndQuery
    } catch {
      redirectPath = url.replace(/^https?:\/\//, '')
    }
    const encodedPath = redirectPath.split('/').map(segment => encodeURIComponent(segment)).join('/')
    window.open(`/hosts/${slugify(host.name)}/redirect/${encodedPath}`, '_blank', 'noopener,noreferrer')
  }, [host.name])

  return (
    <main className="wrap py-6">
      <Link href="/hosts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={16} />
        <span>Back to All Hosts</span>
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{host.name}</h1>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="outline">{typeDisplay}</Badge>
            <Badge variant={isOnline ? "default" : "secondary"}>{host.status}</Badge>
            {(host.locale || []).map(locale => (
              <Badge key={locale} variant="secondary">{getLanguageName(locale)}</Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => toggleFavorite(host.id)}
            aria-pressed={isFavorite(host.id)}
            aria-label={isFavorite(host.id) ? `Remove ${host.name} from favorites` : `Add ${host.name} to favorites`}
            data-active={isFavorite(host.id) ? '' : undefined}
            className="data-[active]:text-yellow-500"
          >
            <Star size={16} fill={isFavorite(host.id) ? 'currentColor' : 'none'} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleCopyLink} aria-label={copied ? 'Copied!' : 'Copy link'}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          {host.info && host.info.trim() && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold"><Info size={14} /> Information</h3>
                <div className="text-sm">{formatInfoLines(host.info)}</div>
              </CardContent>
            </Card>
          )}

          {host.free_plan && host.free_plan.trim() && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold"><Gift size={14} /> Free Plan</h3>
                <div className="text-sm">{formatInfoLines(host.free_plan)}</div>
              </CardContent>
            </Card>
          )}

          {!host.targets?.some(t => t.toLowerCase().includes('subdomain')) && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold"><Settings size={14} /> Key Specifications</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <Cpu size={20} className="mx-auto text-muted-foreground" />
                    <div className="text-[10px] text-muted-foreground mt-1">CPU</div>
                    <div className="text-sm font-medium">{host.cpu}</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <MemoryStick size={20} className="mx-auto text-muted-foreground" />
                    <div className="text-[10px] text-muted-foreground mt-1">RAM</div>
                    <div className="text-sm font-medium">{host.ramMB ? formatSize(host.ramMB) : host.ram}</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <HardDrive size={20} className="mx-auto text-muted-foreground" />
                    <div className="text-[10px] text-muted-foreground mt-1">Storage</div>
                    <div className="text-sm font-medium">{host.diskMB ? formatSize(host.diskMB) : host.disk}</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <Languages size={20} className="mx-auto text-muted-foreground" />
                    <div className="text-[10px] text-muted-foreground mt-1">Languages</div>
                    <div className="text-sm font-medium">{(host.locale || []).map(l => getLanguageName(l)).join(', ') || 'Unknown'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {host.targets && host.targets.length > 0 && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold"><Crosshair size={14} /> Targets</h3>
                <div className="flex flex-wrap gap-2">
                  {(host.targets || []).flatMap(target =>
                    target.split(',').map(t => {
                      const d = t.trim()
                      return d ? <Badge key={d} variant="outline">{d}</Badge> : null
                    }).filter(Boolean)
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {host.links && host.links.length > 0 && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold"><LinkIcon size={14} /> Links</h3>
                <div className="space-y-2">
                  {(host.links || []).map((link, index) => (
                    <a key={index} href="#" className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm hover:bg-muted/50 transition-colors" onClick={(e) => { e.preventDefault(); handleRedirect(link) }}>
                      <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                      <span className="truncate">{link}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 text-center space-y-3">
              <div className="text-3xl font-bold text-accent">{rating}%</div>
              <div className="text-xs text-muted-foreground">Based on {totalReviews} reviews</div>
              <div className="flex justify-center gap-6">
                <div>
                  <div className="text-lg font-semibold">{host.approvals || 0}</div>
                  <div className="text-[10px] text-muted-foreground">Upvotes</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{host.disapprovals || 0}</div>
                  <div className="text-[10px] text-muted-foreground">Downvotes</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowDiscordModal(true)}>
                  <ThumbsUp size={14} /> Upvote
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowDiscordModal(true)}>
                  <ThumbsDown size={14} /> Downvote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Similar Hosting Providers</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, idx) => {
              const rIsOnline = r.status && r.status.toLowerCase() === 'online'
              const rRating = (r.approvals + r.disapprovals) > 0
                ? Math.round((r.approvals / (r.approvals + r.disapprovals)) * 100)
                : null
              const isDomainHost = r.targets?.some(t => t.toLowerCase().includes('domain'))
              const combinedText = `${r.info || ''}\n${r.description || ''}\n${r.free_plan || ''}`
              const allExtractedDomains = isDomainHost ? Array.from(new Set(combinedText.split('\n')
                .map(l => l.trim())
                .filter(l => l.includes('.') && !l.includes(':') && !l.toLowerCase().includes('available domains') && !l.toLowerCase().includes('available extensions'))
              )) : []
              const extractedDomains = allExtractedDomains.slice(0, 5)
              const hasMoreDomains = allExtractedDomains.length > 5

              return (
                <Link key={r.id} href={`/hosts/${slugify(r.name)}`}>
                  <Card className="h-full hover:border-accent/50 transition-colors">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">{r.name}</div>
                          <Badge variant={rIsOnline ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">{r.status || 'Unknown'}</Badge>
                        </div>
                      </div>

                      {isDomainHost && extractedDomains.length > 0 ? (
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          <div className="font-semibold text-accent">Available Extensions:</div>
                          {extractedDomains.map(domain => {
                            const cleanDomain = domain.replace(/^[-\s•*]+/, '')
                            return <div key={domain}>• {cleanDomain}</div>
                          })}
                          {hasMoreDomains && <div className="italic">+ more extensions available</div>}
                        </div>
                      ) : r.targets?.some(t => t.toLowerCase().includes('subdomain')) ? (
                        <div className="text-xs text-muted-foreground italic">Free subdomain hosting</div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="rounded bg-muted/50 p-1.5 text-center">
                            <div className="text-[10px] text-muted-foreground">CPU</div>
                            <div className="text-xs font-medium truncate">{r.cpu || 'Unknown'}</div>
                          </div>
                          <div className="rounded bg-muted/50 p-1.5 text-center">
                            <div className="text-[10px] text-muted-foreground">RAM</div>
                            <div className="text-xs font-medium truncate">{r.ramMB ? formatSize(r.ramMB) : r.ram || 'Free'}</div>
                          </div>
                          <div className="rounded bg-muted/50 p-1.5 text-center">
                            <div className="text-[10px] text-muted-foreground">Storage</div>
                            <div className="text-xs font-medium truncate">{r.diskMB ? formatSize(r.diskMB) : r.disk || 'Unknown'}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1">
                        {r.targets?.slice(0, 3).map(t => (
                          <Badge key={t} variant="outline" className="text-[10px] px-1.5 py-0">{t.split(',')[0]}</Badge>
                        ))}
                        {rRating !== null && (
                          <span className="ml-auto text-xs font-bold text-accent">{rRating}%</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <Dialog open={showDiscordModal} onOpenChange={setShowDiscordModal}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#5865F2" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0741.0741 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.1776-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
            </div>
            <DialogTitle>Discord Required</DialogTitle>
            <DialogDescription>You can only vote and review hosts in the Discord server!</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowDiscordModal(false)}>Got it</Button>
        </DialogContent>
      </Dialog>
    </main>
  )
}
