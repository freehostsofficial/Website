'use client';

import { useState, useEffect, useCallback, Suspense, useRef, useMemo, useDeferredValue } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { type Host } from '../../lib/hosts';
import { getLanguageName } from '../../lib/getLanguageName';
import { parseCPUValue, parseMemoryToMB } from '../../lib/parseSpecs';
import { computeRating } from '../../lib/comparisonRows';
import { Search, X, Shuffle, ArrowDownAZ, Cpu, MemoryStick, HardDrive, Clock, ThumbsUp } from 'lucide-react';
import HostCard from '@/components/HostCard';
import { PageHero } from '@/components/PageHero';

// ─── Filter select (native) ───────────────────────────────────────────────────
// Was CustomDropdown (~100 lines: outside-click + search input + listbox
// roles). A native <select> does the job; browsers provide type-ahead.

interface FilterOption {
  value: string
  label: string
}

function FilterSelect({ id, value, options, placeholder, onChange }: {
  id: string
  value: string
  options: FilterOption[]
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">{placeholder}</label>
      <select
        id={id}
        className="filter-dropdown-trigger"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </>
  )
}

// Sort display metadata (was twin getSortIcon/getSortLabel switches).
const SORT_META: Record<string, { label: string; icon: React.ReactNode }> = {
  random: { label: 'Random', icon: <Shuffle size={13} aria-hidden="true" /> },
  name: { label: 'Name', icon: <ArrowDownAZ size={13} aria-hidden="true" /> },
  cpu: { label: 'CPU', icon: <Cpu size={13} aria-hidden="true" /> },
  ram: { label: 'Memory', icon: <MemoryStick size={13} aria-hidden="true" /> },
  storage: { label: 'Storage', icon: <HardDrive size={13} aria-hidden="true" /> },
  reviews: { label: 'Reviews', icon: <ThumbsUp size={13} aria-hidden="true" /> },
  recent: { label: 'Recent', icon: <Clock size={13} aria-hidden="true" /> },
}

export default function HostsClient({ initialHosts }: { initialHosts: Host[] }) {
  return (
    <Suspense fallback={<HostsLoading />}>
      <HostsContent initialHosts={initialHosts} />
    </Suspense>
  )
}

// Loading component for Suspense fallback
// NOTE: deliberately avoids the real page's ids (main-content, hosts-page,
// home, hero-title) and its <h1> — when Next streams this fallback alongside
// the resolved content, duplicated ids/headings used to land in the served
// HTML. This copy is transient chrome, not document structure.
function HostsLoading() {
  return (
    <main id="main-content-loading">
      <div id="hosts-page-loading">
        <div className="wrap">
          <section className="hero centered-hero" id="home-loading" aria-hidden="true">
            <div className="blobs" aria-hidden="true">
              <div className="blob b1"></div>
              <div className="blob b2"></div>
              <div className="blob b3"></div>
            </div>
            <div className="hero-inner">
              <div className="hero-left">
                <p className="hero-title lead">Free Hosting Directory</p>
                <p className="lead">Discover and compare the best free hosting providers for your projects.</p>
              </div>
            </div>
          </section>
          <div className="loading">
            <div className="spinner"></div>
            <p style={{ color: 'var(--muted)' }}>Loading hosts...</p>
          </div>
        </div>
      </div>
    </main>
  )
}

// Deterministic shuffle seed (see randomOrder below): id hash, stable on
// server, client, and every visit.
function hashSeed(id: number): number {
  let h = (id * 2654435761) >>> 0;
  h ^= h >>> 15;
  h = (h * 2246822519) >>> 0;
  return h;
}

// Main content component that uses useSearchParams
function HostsContent({ initialHosts }: { initialHosts: Host[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [hosts] = useState<Host[]>(initialHosts)

  // Filters live in the URL (shared/back-button-safe); no sessionStorage copy.
  const [currentFilters, setCurrentFilters] = useState({
    search: searchParams.get('search') || '',
    locale: searchParams.get('locale') || '',
    target: searchParams.get('target') || '',
    sort: searchParams.get('sort') || 'random'
  })

  // Back/forward navigation changes searchParams without remounting — adjust
  // state during render (React-endorsed store-previous-render pattern, no effect).
  // Our own debounced pushes are tracked in state (not a ref — refs can't be
  // read during render): when one lands, local state is newer than the URL,
  // so resetting from it would eat keystrokes.
  const [pushedKeys, setPushedKeys] = useState<string[]>([]);
  const paramsKey = searchParams.toString();
  const [lastParamsKey, setLastParamsKey] = useState(paramsKey);
  if (lastParamsKey !== paramsKey) {
    setLastParamsKey(paramsKey);
    if (pushedKeys.includes(paramsKey)) {
      // Our own push landing late — consume the key, keep local state.
      setPushedKeys((keys) => keys.filter((k) => k !== paramsKey));
    } else {
      setCurrentFilters({
        search: searchParams.get('search') || '',
        locale: searchParams.get('locale') || '',
        target: searchParams.get('target') || '',
        sort: searchParams.get('sort') || 'random'
      });
    }
  }

  // Stdlib debounce: defer filtering until typing pauses (was useDebounce).
  const debouncedSearch = useDeferredValue(currentFilters.search)
  const isSearching = currentFilters.search !== debouncedSearch

  const isMounted = useRef(false)

  // Card order: a hash of the id, NOT Math.random(). Random here re-runs on
  // hydration with different values, reordering cards client-side and
  // crashing hydration (server "T" vs client "B"). Hash order looks random
  // but is identical everywhere; the Random button below reshuffles per click.
  const [randomOrder, setRandomOrder] = useState<Map<number, number>>(() =>
    new Map<number, number>(initialHosts.map(h => [h.id, hashSeed(h.id)]))
  )

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
          const ratingA = computeRating(a)
          const ratingB = computeRating(b)
          // If ratings are equal, sort by total review count
          if (ratingB === ratingA) {
            return ((b.approvals || 0) + (b.disapprovals || 0)) - ((a.approvals || 0) + (a.disapprovals || 0))
          }
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

  // URL follows the filters, debounced: one replace per typing pause instead
  // of one per keystroke (each replace is a full server round-trip). Skips
  // pushes that match the live URL so repeats never hit the network.
  const pushURL = useCallback(() => {
    const params = new URLSearchParams()
    if (currentFilters.search) params.set('search', currentFilters.search)
    if (currentFilters.locale) params.set('locale', currentFilters.locale)
    if (currentFilters.target) params.set('target', currentFilters.target)
    if (currentFilters.sort && currentFilters.sort !== 'random') params.set('sort', currentFilters.sort)

    const key = params.toString()
    const live = typeof window === 'undefined'
      ? null
      : window.location.search.startsWith('?')
        ? window.location.search.slice(1)
        : window.location.search;
    if (live === null || live === key) return;
    setPushedKeys((keys) => [...keys.slice(-20), key]);
    router.replace(key ? `/hosts?${key}` : '/hosts', { scroll: false })
  }, [currentFilters.search, currentFilters.locale, currentFilters.target, currentFilters.sort, router])

  const handleFilterChange = (filter: keyof typeof currentFilters, value: string) => {
    setCurrentFilters((prev: typeof currentFilters) => ({
      ...prev,
      [filter]: value
    }))
  }

  const handleSortChange = (sort: string) => {
    // Clicking "Random" while already on random reshuffles the order
    if (sort === 'random' && currentFilters.sort === 'random') {
      setRandomOrder(new Map(hosts.map(h => [h.id, Math.random()])))
      return
    }
    setCurrentFilters((prev: typeof currentFilters) => ({
      ...prev,
      sort
    }))
  }

  // Push the URL only after typing pauses (500ms). The textbox stays fully
  // controlled by local state, so fast keystrokes always register; the list
  // filters instantly via useDeferredValue above, the URL just follows.
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    const timer = setTimeout(() => pushURL(), 500)
    return () => clearTimeout(timer)
  }, [currentFilters.search, currentFilters.locale, currentFilters.target, currentFilters.sort, pushURL])

  const clearFilters = () => {
    setCurrentFilters({
      search: '',
      locale: '',
      target: '',
      sort: 'random'
    })
  }

  const isHostNew = (host: Host): boolean => {
    if (!host.created_at) return false
    const createdDate = new Date(host.created_at)
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 15
  }

  const hasActiveFilters = useMemo(() => 
    currentFilters.search || currentFilters.locale || currentFilters.target,
    [currentFilters.search, currentFilters.locale, currentFilters.target]
  )

  return (
    <main id="main-content">
      <div id="hosts-page">
        <div className="wrap">
          {/* Hero Section */}
          <PageHero
            title="Free Hosting Directory"
            titleId="hero-title"
            sectionId="home"
            lead="Discover and compare the best free hosting providers for your projects."
          />

          {/* Search Section */}
          <div className="search-section">
            <div className="search-grid">
              <div className="search-input-wrapper">
                <Search size={16} aria-hidden="true" className="search-icon" />
                <label htmlFor="search" className="sr-only">Search hosting providers</label>
                <input
                  type="text"
                  id="search"
                  className={`search-input${isSearching ? ' search-input--loading' : ''}`}
                  placeholder="Search for a host..."
                  value={currentFilters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  aria-label="Search hosting providers"
                />
              </div>
              <FilterSelect
                id="locale"
                value={currentFilters.locale}
                placeholder="All Languages"
                options={locales.map(locale => ({
                  value: locale,
                  label: `${getLanguageName(locale)} (${locale})`
                }))}
                onChange={(val) => handleFilterChange('locale', val)}
              />
              <FilterSelect
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
          </div>

          {/* Sort Bar */}
          <div className="sort-bar">
            <div className="sort-left">
              <div className="sort-label">Sort by:</div>
              <div className="sort-buttons">
                {Object.entries(SORT_META).map(([sortType, meta]) => (
                  <button
                    key={sortType}
                    type="button"
                    className={`sort-btn ${currentFilters.sort === sortType ? 'active' : ''}`}
                    onClick={() => handleSortChange(sortType)}
                    aria-pressed={currentFilters.sort === sortType}
                  >
                    {meta.icon}
                    {meta.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sort-right">
              {/* Results Info */}
              <div className="results-info" id="results-info" aria-live="polite" role="status">
                {hasActiveFilters ? (
                  `Showing ${filteredHosts.length} of ${hosts.length} hosts`
                ) : (
                  `Showing all ${hosts.length} hosts`
                )}
              </div>
              <button 
                type="button"
                className={`clear-filters-btn ${hasActiveFilters ? 'active' : ''}`}
                onClick={clearFilters}
              >
                <X size={14} aria-hidden="true" /> Clear Filters
              </button>
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
                    <button type="button" className="btn ghost" onClick={clearFilters}>
                      <X size={14} aria-hidden="true" /> Clear all filters
                    </button>
                  )}
                  {currentFilters.search && (
                    <button type="button" className="btn ghost" onClick={() => handleFilterChange('search', '')}>
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredHosts.map(host => (
                <HostCard
                  key={host.id}
                  host={host}
                  isNew={isHostNew(host)}
                  showDomains
                />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
