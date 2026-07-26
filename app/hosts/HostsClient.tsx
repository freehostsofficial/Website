'use client';

import { useState, useEffect, useCallback, Suspense, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { type Host } from '../../lib/cache';
import Link from '@/components/NoPrefetchLink';
import { slugify } from '../../lib/slugify';
import { getLanguageName } from '../../lib/getLanguageName';
import { parseCPUValue, parseMemoryToMB } from '../../lib/parseSpecs';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X, Shuffle, ArrowDownAZ, Cpu, MemoryStick, HardDrive, Clock, GitCompare, Star, ThumbsUp } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

interface DropdownOption {
  value: string
  label: string
}

interface CustomDropdownProps {
  id: string
  value: string
  options: DropdownOption[]
  placeholder: string
  onChange: (value: string) => void
}

function CustomDropdown({ id, value, options, placeholder, onChange }: CustomDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = options.find(o => o.value === value)

  const filtered = useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
  }, [options, search])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  function select(val: string) {
    onChange(val)
    setOpen(false)
    setSearch('')
  }

  return (
    <div className={`filter-dropdown${open ? ' open' : ''}`} ref={ref} id={id}>
      <button
        type="button"
        className="filter-dropdown-trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={selected ? `${placeholder}: ${selected.label}` : placeholder}
      >
        <span className={selected ? 'filter-dropdown-value' : 'filter-dropdown-placeholder'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className="filter-dropdown-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div className="filter-dropdown-menu" role="listbox">
          {options.length > 6 && (
            <div className="filter-dropdown-search">
              <Search size={13} aria-hidden="true" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
          )}
          <div className="filter-dropdown-list">
            <button
              type="button"
              role="option"
              aria-selected={value === ''}
              className={`filter-dropdown-item${value === '' ? ' active' : ''}`}
              onClick={() => select('')}
            >
              {placeholder}
            </button>
            {filtered.map(opt => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={`filter-dropdown-item${value === opt.value ? ' active' : ''}`}
                onClick={() => select(opt.value)}
              >
                {opt.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="filter-dropdown-empty">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}


export default function HostsClient({ initialHosts }: { initialHosts: Host[] }) {
  return (
    <Suspense fallback={<HostsLoading />}>
      <HostsContent initialHosts={initialHosts} />
    </Suspense>
  )
}

// Loading component for Suspense fallback
function HostsLoading() {
  return (
    <main id="main-content">
      <div id="hosts-page" className="wrap py-12">
        <section className="text-center mb-8">
          <h1 className="text-3xl font-bold">Free Hosting Directory</h1>
          <p className="text-muted-foreground mt-2">Discover and compare the best free hosting providers for your projects.</p>
        </section>
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-accent" />
          <p className="text-sm text-muted-foreground">Loading hosts...</p>
        </div>
      </div>
    </main>
  )
}

// Main content component that uses useSearchParams
function HostsContent({ initialHosts }: { initialHosts: Host[] }) {
  const searchParams = useSearchParams()
  const [hosts] = useState<Host[]>(initialHosts)

  const SCROLL_KEY = 'hosts_scroll_y'
  const RANDOM_ORDER_KEY = 'hosts_random_order'
  const FILTERS_KEY = 'hosts_filters'
  const PAGE_KEY = 'hosts_page'

  // sessionStorage overrides are applied in a useEffect after hydration.
  const [currentFilters, setCurrentFilters] = useState({
    search: searchParams.get('search') || '',
    locale: searchParams.get('locale') || '',
    target: searchParams.get('target') || '',
    sort: searchParams.get('sort') || 'random'
  })

  const [currentPage, setCurrentPage] = useState(() => {
    const page = parseInt(searchParams.get('page') || '1')
    return !isNaN(page) && page > 0 ? page : 1
  })

  const debouncedSearch = useDebounce(currentFilters.search, 300)
  const isSearching = currentFilters.search !== debouncedSearch

  const isMounted = useRef(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Helper to generate and persist a fresh random order
  const generateRandomOrder = (hostList: Host[]): Map<number, number> => {
    const map = new Map<number, number>(
      hostList.map(h => [h.id, Math.random()])
    )
    try {
      sessionStorage.setItem(RANDOM_ORDER_KEY, JSON.stringify([...map]))
    } catch {
      // ignore storage errors
    }
    return map
  }

  // Initialize random order with a stable value — sessionStorage restore happens in useEffect
  const [randomOrder, setRandomOrder] = useState<Map<number, number>>(() =>
    new Map<number, number>(initialHosts.map(h => [h.id, Math.random()]))
  )

  // After hydration: restore filters, page, random order, and scroll from sessionStorage.
  // This runs once and avoids any SSR/client mismatch.
  useEffect(() => {
    try {
      // Restore random order
      const savedOrder = sessionStorage.getItem(RANDOM_ORDER_KEY)
      if (savedOrder) {
        const parsed: [number, number][] = JSON.parse(savedOrder)
        setRandomOrder(new Map(parsed))
      } else {
        // Persist the initial random order
        const map = randomOrder
        sessionStorage.setItem(RANDOM_ORDER_KEY, JSON.stringify([...map]))
      }

      // Restore filters and page (back-navigation)
      const savedFilters = sessionStorage.getItem(FILTERS_KEY)
      const savedPage = sessionStorage.getItem(PAGE_KEY)
      if (savedFilters) {
         
        setCurrentFilters(JSON.parse(savedFilters))
      }
      if (savedPage) {
        const page = parseInt(savedPage)
        if (!isNaN(page) && page > 0) {
           
          setCurrentPage(page)
        }
      }

      // Restore scroll position
      const savedScroll = sessionStorage.getItem(SCROLL_KEY)
      if (savedScroll) {
        const y = parseInt(savedScroll, 10)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, behavior: 'instant' })
          })
        })
        sessionStorage.removeItem(SCROLL_KEY)
      }
    } catch {
      // sessionStorage unavailable — ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save filters and page to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(FILTERS_KEY, JSON.stringify(currentFilters))
      sessionStorage.setItem(PAGE_KEY, String(currentPage))
    } catch {
      // ignore storage errors
    }
  }, [currentFilters, currentPage])

  // Save scroll position when navigating away to a host detail
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="/hosts/"]')
      if (link) {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const pageSize = 24

  // Memoize Filter Options
  const locales = useMemo(() => {
    const uniqueLocales = new Set<string>()
    hosts.forEach(host => {
      (host.locale || []).forEach(locale => uniqueLocales.add(locale))
    })
    return Array.from(uniqueLocales).sort()
  }, [hosts])

  const targets = useMemo(() => {
    const uniqueTargets = new Set<string>()
    hosts.forEach(host => {
      ;(host.targets || []).forEach(target => {
        if (target) {
          const targetList = target.split(',').map(t => t.trim())
          targetList.forEach(singleTarget => {
            if (singleTarget) {
              const displayTarget = singleTarget.replace(/\s*\([^)]*\)/g, '').trim()
              if (displayTarget) uniqueTargets.add(displayTarget)
            }
          })
        }
      })
    })
    return Array.from(uniqueTargets).sort()
  }, [hosts])

  const sortHosts = useCallback((hostsToSort: Host[], sortBy: string): Host[] => {
    return [...hostsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'random':
          return (randomOrder.get(a.id) ?? 0) - (randomOrder.get(b.id) ?? 0)
        case 'recent':
          if (a.created_at && b.created_at) return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          return (b.id || 0) - (a.id || 0)
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'cpu':
          return parseCPUValue(b.cpu) - parseCPUValue(a.cpu)
        case 'ram':
          return parseMemoryToMB(b.ram, b.ramMB) - parseMemoryToMB(a.ram, a.ramMB)
        case 'storage':
          return parseMemoryToMB(b.disk, b.diskMB) - parseMemoryToMB(a.disk, a.diskMB)
        case 'reviews': {
          // Sort by approval percentage (most positive reviews first)
          const totalA = (a.approvals || 0) + (a.disapprovals || 0)
          const totalB = (b.approvals || 0) + (b.disapprovals || 0)
          const ratingA = totalA > 0 ? (a.approvals || 0) / totalA : 0
          const ratingB = totalB > 0 ? (b.approvals || 0) / totalB : 0
          // If ratings are equal, sort by total review count
          if (ratingB === ratingA) return totalB - totalA
          return ratingB - ratingA
        }
        default:
          return (randomOrder.get(a.id) ?? 0) - (randomOrder.get(b.id) ?? 0)
      }
    })
  }, [randomOrder])

  // Filter logic
  const filteredHosts = useMemo(() => {
    if (hosts.length === 0) return []

    const filtered = hosts.filter(host => {
      // Search filter with debounced value
      if (debouncedSearch) {
        const searchText = `${host.name} ${host.description || ''} ${host.info || ''} ${host.type || ''} ${(host.locale || []).join(' ')} ${(host.targets || []).join(' ')}`.toLowerCase()
        if (!searchText.includes(debouncedSearch.toLowerCase())) return false
      }

      if (currentFilters.locale && !(host.locale || []).includes(currentFilters.locale)) {
        return false
      }

      if (currentFilters.target) {
        let hasMatchingTarget = false
        ;(host.targets || []).forEach(target => {
          if (target) {
            const targetList = target.split(',').map(t => t.trim().replace(/\s*\([^)]*\)/g, '').trim())
            if (targetList.includes(currentFilters.target)) hasMatchingTarget = true
          }
        })
        if (!hasMatchingTarget) return false
      }

      return true
    })

    // Sort hosts
    return sortHosts(filtered, currentFilters.sort)
  }, [hosts, debouncedSearch, currentFilters.locale, currentFilters.target, currentFilters.sort, sortHosts])

  const totalPages = useMemo(() => Math.ceil(filteredHosts.length / pageSize), [filteredHosts.length, pageSize])

  // Optimize URL updates
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (currentFilters.locale) params.set('locale', currentFilters.locale)
    if (currentFilters.target) params.set('target', currentFilters.target)
    if (currentFilters.sort && currentFilters.sort !== 'random') params.set('sort', currentFilters.sort)
    if (currentPage > 1) params.set('page', currentPage.toString())

    const newURL = params.toString() ? `/hosts?${params.toString()}` : '/hosts'
    window.history.replaceState({}, '', newURL)
  }, [debouncedSearch, currentFilters.locale, currentFilters.target, currentFilters.sort, currentPage])

  const handleFilterChange = (filter: keyof typeof currentFilters, value: string) => {
    setCurrentFilters((prev: typeof currentFilters) => ({
      ...prev,
      [filter]: value
    }))
    setCurrentPage(1)
  }

  const handleSortChange = (sort: string) => {
    // Clicking "Random" while already on random reshuffles the order
    if (sort === 'random' && currentFilters.sort === 'random') {
      setRandomOrder(generateRandomOrder(hosts))
      setCurrentPage(1)
      return
    }
    setCurrentFilters((prev: typeof currentFilters) => ({
      ...prev,
      sort
    }))
    setCurrentPage(1)
  }

  // Only update URL when filters actually change (not during typing)
  useEffect(() => {
    if (isMounted.current) {
      updateURL()
    } else {
      isMounted.current = true
    }
  }, [debouncedSearch, currentFilters.locale, currentFilters.target, currentFilters.sort, currentPage, updateURL])

  const clearFilters = () => {
    setCurrentFilters({
      search: '',
      locale: '',
      target: '',
      sort: 'random'
    })
    setCurrentPage(1)
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    // Scroll to top of results
    document.getElementById('hosts-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }



  const isHostNew = (host: Host): boolean => {
    if (!host.created_at) return false
    const createdDate = new Date(host.created_at)
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 15
  }

  const formatSize = (mb?: number): string => {
    if (!mb) return 'Unknown'
    if (mb >= 1024) return (mb / 1024).toFixed(1) + 'GB'
    return Math.round(mb) + 'MB'
  }

  const currentPageHosts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, filteredHosts.length)
    return filteredHosts.slice(startIndex, endIndex)
  }, [filteredHosts, currentPage, pageSize])

  const hasActiveFilters = useMemo(() => 
    currentFilters.search || currentFilters.locale || currentFilters.target,
    [currentFilters.search, currentFilters.locale, currentFilters.target]
  )

  // Final check for hydration loading
  if (!hasMounted) {
    return <HostsLoading />
  }

  return (
    <main id="main-content">
      <div id="hosts-page">
        <div className="wrap">
          {/* Hero Section */}
          <section className="hero centered-hero" id="home" aria-labelledby="hero-title">
            <div className="blobs" aria-hidden="true">
              <div className="blob b1"></div>
              <div className="blob b2"></div>
              <div className="blob b3"></div>
            </div>
            <div className="hero-inner">
              <div className="hero-left">
                <h1 id="hero-title">Free Hosting Directory</h1>
                <p className="lead">Discover and compare the best free hosting providers for your projects.</p>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                id="search"
                placeholder="Search for a host..."
                value={currentFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                aria-label="Search hosting providers"
                className="pl-9"
              />
            </div>
            <CustomDropdown
              id="locale"
              value={currentFilters.locale}
              placeholder="All Languages"
              options={locales.map(locale => ({
                value: locale,
                label: `${getLanguageName(locale)} (${locale})`
              }))}
              onChange={(val) => handleFilterChange('locale', val)}
            />
            <CustomDropdown
              id="target-filter"
              value={currentFilters.target}
              placeholder="All Targets"
              options={targets.map(target => ({
                value: target,
                label: target
              }))}
              onChange={(val) => handleFilterChange('target', val)}
            />
          </div>

          {/* Sort Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort by:</span>
              <div className="flex flex-wrap gap-1">
                {['random', 'name', 'cpu', 'ram', 'storage', 'reviews', 'recent'].map(sortType => (
                  <Button
                    key={sortType}
                    variant={currentFilters.sort === sortType ? 'default' : 'ghost'}
                    size="xs"
                    onClick={() => handleSortChange(sortType)}
                  >
                    {getSortIcon(sortType)}
                    {getSortLabel(sortType)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground" id="results-info">
                {hasActiveFilters ? (
                  `Showing ${filteredHosts.length} of ${hosts.length} hosts`
                ) : (
                  `Showing all ${hosts.length} hosts`
                )}
              </span>
              {hasActiveFilters && (
                <Button variant="ghost" size="xs" onClick={clearFilters}>
                  <X size={14} aria-hidden="true" /> Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Hosts Grid */}
          <div id="hosts-container" className="hosts-grid">
            {filteredHosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Search size={48} aria-hidden="true" />
                </div>
                <div className="empty-title">No hosts found</div>
                <p style={{ color: 'var(--muted)', marginBottom: 'var(--space-md)' }}>
                  No hosts match your current filters.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="xs" onClick={clearFilters}>
                      <X size={14} aria-hidden="true" /> Clear all filters
                    </Button>
                  )}
                  {currentFilters.search && (
                    <Button variant="ghost" size="xs" onClick={() => handleFilterChange('search', '')}>
                      Clear search
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              currentPageHosts.map(host => (
                <HostCard 
                  key={host.id} 
                  host={host} 
                  isNew={isHostNew(host)}
                  formatSize={formatSize}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredHosts.length > pageSize && (
            <div className="flex items-center justify-center gap-2 mt-8" id="pagination">
              <Button variant="outline" size="xs" onClick={() => goToPage(1)} disabled={currentPage === 1}>
                <ChevronsLeft size={14} aria-hidden="true" /> First
              </Button>
              <Button variant="outline" size="xs" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft size={14} aria-hidden="true" /> Previous
              </Button>
              
              <div className="flex gap-1" id="page-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const startPage = Math.max(1, currentPage - 2)
                  const pageNum = startPage + i
                  if (pageNum > totalPages) return null
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? 'default' : 'outline'}
                      size="xs"
                      onClick={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button variant="outline" size="xs" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next <ChevronRight size={14} aria-hidden="true" />
              </Button>
              <Button variant="outline" size="xs" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
                Last <ChevronsRight size={14} aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// Host Card Component
interface HostCardProps {
  host: Host
  isNew: boolean
  formatSize: (mb?: number) => string
}

function HostCard({ host, isNew, formatSize }: HostCardProps) {
  const { isSelected, addHost, removeHost, isFull } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();
  const ramDisplay = host.ramMB ? formatSize(host.ramMB) : host.ram || 'Unknown'
  const storageDisplay = host.diskMB ? formatSize(host.diskMB) : host.disk || 'Unknown'
  const totalReviews = (host.approvals || 0) + (host.disapprovals || 0)
  const rating = totalReviews > 0 ? Math.round(((host.approvals || 0) / totalReviews) * 100) : 0
  const iconLetter = host.name ? host.name.charAt(0).toUpperCase() : '?'
  const isOnline = host.status && host.status.toLowerCase() === 'online'
  const typeDisplay = host.type ? host.type.split(',').map(t => t.trim().replace(/\s*\([^)]*\)/g, '').trim()) : []

  return (
    <Card className="relative">
      {isNew && <Badge variant="default" className="absolute -top-2 -right-2 z-10">NEW</Badge>}

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
            {iconLetter}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm truncate">{host.name}</div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <Badge variant={isOnline ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                {host.status || 'Unknown'}
              </Badge>
              {typeDisplay.map(type => (
                <Badge key={type} variant="outline" className="text-[10px] px-1.5 py-0">{type}</Badge>
              ))}
              {(host.locale || []).map(locale => (
                <Badge key={locale} variant="secondary" className="text-[10px] px-1.5 py-0">{getLanguageName(locale)}</Badge>
              ))}
              {(host.targets || []).flatMap(target =>
                target.split(',').map(t => {
                  const d = t.trim()
                  return d ? <Badge key={d} variant="outline" className="text-[10px] px-1.5 py-0">{d}</Badge> : null
                }).filter(Boolean)
              )}
            </div>
            {host.description && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{host.description}</p>
            )}
          </div>
        </div>

        {(() => {
          const isDomainHost = host.targets?.some(t => t.toLowerCase().includes('domain'));
          const combinedText = `${host.info || ''}\n${host.description || ''}\n${host.free_plan || ''}`;
          const allExtractedDomains = isDomainHost ? Array.from(new Set(combinedText.split('\n')
            .map(l => l.trim())
            .filter(l => /^\s*[-–•*\s]*[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+[\r\n]*$/.test(l))
            .map(l => l.replace(/^[-–•*\s]+/, '').trim().split(/\s/)[0])
          )) : [];
          const extractedDomains = allExtractedDomains.slice(0, 10);
          const hasMoreDomains = allExtractedDomains.length > 10;

           if (isDomainHost && extractedDomains.length > 0) {
             return (
               <div className="flex flex-col gap-1 py-2 min-h-[60px] justify-center">
                 <div className="text-[11px] font-bold text-accent flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                   Extensions:
                 </div>
                 <div className="flex flex-wrap gap-1.5">
                   {extractedDomains.map(domain => {
                     const cleanDomain = domain.replace(/^[-\s•*]+/, '');
                     return (
                       <Badge key={domain} variant="outline" className="text-[10px] px-1.5 py-0 text-accent border-accent/30 bg-accent/5">
                         {cleanDomain}
                       </Badge>
                     );
                   })}
                 </div>
                 {hasMoreDomains && (
                   <div className="text-[10px] text-muted-foreground italic">
                     + {allExtractedDomains.length - 10} more available
                   </div>
                 )}
               </div>
             );
           } else if (host.targets?.some(t => t.toLowerCase().includes('subdomain'))) {
             return null;
           }

           return (
             <div className="grid grid-cols-3 gap-2">
               <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-muted-foreground shrink-0"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M9 2v2M2 15h2M2 9h2M15 20v2M9 20v2M20 15h2M20 9h2"/></svg>
                 <div className="min-w-0">
                   <div className="text-xs font-medium truncate">{host.cpu || 'Unknown'}</div>
                   <div className="text-[10px] text-muted-foreground">CPU</div>
                 </div>
               </div>
               <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-muted-foreground shrink-0"><path d="M6 19v-3"/><path d="M10 19v-3"/><path d="M14 19v-3"/><path d="M18 19v-3"/><path d="M8 11V9"/><path d="M16 11V9"/><path d="M12 11V9"/><path d="M2 15h20"/><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z"/></svg>
                 <div className="min-w-0">
                   <div className="text-xs font-medium truncate">{ramDisplay}</div>
                   <div className="text-[10px] text-muted-foreground">Memory</div>
                 </div>
               </div>
               <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-muted-foreground shrink-0"><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>
                 <div className="min-w-0">
                   <div className="text-xs font-medium truncate">{storageDisplay}</div>
                   <div className="text-[10px] text-muted-foreground">Storage</div>
                 </div>
               </div>
             </div>
           );
        })()}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 border-t border-border px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold">{rating}%</span>
          <span className="text-[11px] text-muted-foreground">{totalReviews} reviews</span>
          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-accent" style={{ width: `${rating}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => isSelected(host.id) ? removeHost(host.id) : addHost(host)}
            disabled={isFull && !isSelected(host.id)}
            aria-pressed={isSelected(host.id)}
            aria-label={isSelected(host.id) ? `Remove ${host.name} from comparison` : `Add ${host.name} to comparison`}
            data-active={isSelected(host.id) ? '' : undefined}
            className="data-[active]:text-accent"
          >
            <GitCompare size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => toggleFavorite(host.id)}
            aria-pressed={isFavorite(host.id)}
            aria-label={isFavorite(host.id) ? `Remove ${host.name} from favorites` : `Add ${host.name} to favorites`}
            data-active={isFavorite(host.id) ? '' : undefined}
            className="data-[active]:text-yellow-500"
          >
            <Star size={14} fill={isFavorite(host.id) ? 'currentColor' : 'none'} />
          </Button>
          <Link href={`/hosts/${slugify(host.name)}`}>
            <Button variant="outline" size="xs">
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

// Helper functions for sort icons and labels
function getSortIcon(sortType: string): React.ReactNode {
  switch (sortType) {
    case 'random': return <Shuffle size={13} aria-hidden="true" />
    case 'name': return <ArrowDownAZ size={13} aria-hidden="true" />
    case 'cpu': return <Cpu size={13} aria-hidden="true" />
    case 'ram': return <MemoryStick size={13} aria-hidden="true" />
    case 'storage': return <HardDrive size={13} aria-hidden="true" />
    case 'reviews': return <ThumbsUp size={13} aria-hidden="true" />
    case 'recent': return <Clock size={13} aria-hidden="true" />
    default: return <Shuffle size={13} aria-hidden="true" />
  }
}

function getSortLabel(sortType: string): string {
  switch (sortType) {
    case 'random': return 'Random'
    case 'name': return 'Name (A-Z)'
    case 'cpu': return 'Most CPU'
    case 'ram': return 'Most Memory'
    case 'storage': return 'Most Storage'
    case 'reviews': return 'Most Positive Reviews'
    case 'recent': return 'Recently Added'
    default: return 'Random'
  }
}