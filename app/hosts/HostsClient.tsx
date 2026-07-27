"use client";

import { useState, useEffect, useCallback, Suspense, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { type Host } from "../../lib/cache";
import { getLanguageName } from "../../lib/getLanguageName";
import { parseCPUValue, parseMemoryToMB } from "../../lib/parseSpecs";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
  Shuffle,
  ArrowDownAZ,
  Cpu,
  MemoryStick,
  HardDrive,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { HostCard } from "@/components/primitives/HostCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  id: string;
  value: string;
  options: DropdownOption[];
  placeholder: string;
  onChange: (value: string) => void;
}

function CustomDropdown({ id, value, options, placeholder, onChange }: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
  }, [options, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  function select(val: string) {
    onChange(val);
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="relative" ref={ref} id={id}>
      <button
        type="button"
        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={selected ? `${placeholder}: ${selected.label}` : placeholder}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full min-w-[14rem] overflow-hidden rounded-md border border-border bg-popover shadow-md" role="listbox">
          {options.length > 6 && (
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}
          <div className="max-h-64 overflow-y-auto p-1">
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-secondary",
                value === "" && "bg-secondary"
              )}
              onClick={() => select("")}
            >
              {placeholder}
            </button>
            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={cn(
                  "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-secondary",
                  value === opt.value && "bg-secondary"
                )}
                onClick={() => select(opt.value)}
              >
                {opt.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function HostsClient({ initialHosts }: { initialHosts: Host[] }) {
  return (
    <Suspense fallback={<HostsLoading />}>
      <HostsContent initialHosts={initialHosts} />
    </Suspense>
  );
}

function HostsLoading() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <section className="text-center">
        <h1>Free Hosting Directory</h1>
        <p className="mt-2 text-muted-foreground">
          Discover and compare the best free hosting providers for your projects.
        </p>
      </section>
      <div className="mt-16 flex flex-col items-center gap-3 text-muted-foreground">
        <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
        <p>Loading hosts...</p>
      </div>
    </main>
  );
}

// Main content component that uses useSearchParams
function HostsContent({ initialHosts }: { initialHosts: Host[] }) {
  const searchParams = useSearchParams();
  const [hosts] = useState<Host[]>(initialHosts);

  const SCROLL_KEY = "hosts_scroll_y";
  const RANDOM_ORDER_KEY = "hosts_random_order";
  const FILTERS_KEY = "hosts_filters";
  const PAGE_KEY = "hosts_page";

  const [currentFilters, setCurrentFilters] = useState({
    search: searchParams.get("search") || "",
    locale: searchParams.get("locale") || "",
    target: searchParams.get("target") || "",
    sort: searchParams.get("sort") || "random",
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const page = parseInt(searchParams.get("page") || "1");
    return !isNaN(page) && page > 0 ? page : 1;
  });

  const debouncedSearch = useDebounce(currentFilters.search, 300);
  const isSearching = currentFilters.search !== debouncedSearch;

  const isMounted = useRef(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const generateRandomOrder = (hostList: Host[]): Map<number, number> => {
    const map = new Map<number, number>(hostList.map((h) => [h.id, Math.random()]));
    try {
      sessionStorage.setItem(RANDOM_ORDER_KEY, JSON.stringify([...map]));
    } catch {
      // ignore storage errors
    }
    return map;
  };

  const [randomOrder, setRandomOrder] = useState<Map<number, number>>(
    () => new Map<number, number>(initialHosts.map((h) => [h.id, Math.random()])),
  );

  useEffect(() => {
    try {
      const savedOrder = sessionStorage.getItem(RANDOM_ORDER_KEY);
      if (savedOrder) {
        const parsed: [number, number][] = JSON.parse(savedOrder);
        setRandomOrder(new Map(parsed));
      } else {
        const map = randomOrder;
        sessionStorage.setItem(RANDOM_ORDER_KEY, JSON.stringify([...map]));
      }

      const savedFilters = sessionStorage.getItem(FILTERS_KEY);
      const savedPage = sessionStorage.getItem(PAGE_KEY);
      if (savedFilters) {
        setCurrentFilters(JSON.parse(savedFilters));
      }
      if (savedPage) {
        const page = parseInt(savedPage);
        if (!isNaN(page) && page > 0) {
          setCurrentPage(page);
        }
      }

      const savedScroll = sessionStorage.getItem(SCROLL_KEY);
      if (savedScroll) {
        const y = parseInt(savedScroll, 10);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, behavior: "instant" });
          });
        });
        sessionStorage.removeItem(SCROLL_KEY);
      }
    } catch {
      // sessionStorage unavailable — ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(FILTERS_KEY, JSON.stringify(currentFilters));
      sessionStorage.setItem(PAGE_KEY, String(currentPage));
    } catch {
      // ignore storage errors
    }
  }, [currentFilters, currentPage]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="/hosts/"]');
      if (link) {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const pageSize = 24;

  const locales = useMemo(() => {
    const uniqueLocales = new Set<string>();
    hosts.forEach((host) => {
      (host.locale || []).forEach((locale) => uniqueLocales.add(locale));
    });
    return Array.from(uniqueLocales).sort();
  }, [hosts]);

  const targets = useMemo(() => {
    const uniqueTargets = new Set<string>();
    hosts.forEach((host) => {
      (host.targets || []).forEach((target) => {
        if (target) {
          const targetList = target.split(",").map((t) => t.trim());
          targetList.forEach((singleTarget) => {
            if (singleTarget) {
              const displayTarget = singleTarget.replace(/\s*\([^)]*\)/g, "").trim();
              if (displayTarget) uniqueTargets.add(displayTarget);
            }
          });
        }
      });
    });
    return Array.from(uniqueTargets).sort();
  }, [hosts]);

  const sortHosts = useCallback(
    (hostsToSort: Host[], sortBy: string): Host[] => {
      return [...hostsToSort].sort((a, b) => {
        switch (sortBy) {
          case "random":
            return (randomOrder.get(a.id) ?? 0) - (randomOrder.get(b.id) ?? 0);
          case "recent":
            if (a.created_at && b.created_at)
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            return (b.id || 0) - (a.id || 0);
          case "name":
            return (a.name || "").localeCompare(b.name || "");
          case "cpu":
            return parseCPUValue(b.cpu) - parseCPUValue(a.cpu);
          case "ram":
            return parseMemoryToMB(b.ram, b.ramMB) - parseMemoryToMB(a.ram, a.ramMB);
          case "storage":
            return parseMemoryToMB(b.disk, b.diskMB) - parseMemoryToMB(a.disk, a.diskMB);
          case "reviews": {
            const totalA = (a.approvals || 0) + (a.disapprovals || 0);
            const totalB = (b.approvals || 0) + (b.disapprovals || 0);
            const ratingA = totalA > 0 ? (a.approvals || 0) / totalA : 0;
            const ratingB = totalB > 0 ? (b.approvals || 0) / totalB : 0;
            if (ratingB === ratingA) return totalB - totalA;
            return ratingB - ratingA;
          }
          default:
            return (randomOrder.get(a.id) ?? 0) - (randomOrder.get(b.id) ?? 0);
        }
      });
    },
    [randomOrder],
  );

  const filteredHosts = useMemo(() => {
    if (hosts.length === 0) return [];

    const filtered = hosts.filter((host) => {
      if (debouncedSearch) {
        const searchText = `${host.name} ${host.description || ""} ${host.info || ""} ${host.type || ""} ${(host.locale || []).join(" ")} ${(host.targets || []).join(" ")}`.toLowerCase();
        if (!searchText.includes(debouncedSearch.toLowerCase())) return false;
      }

      if (currentFilters.locale && !(host.locale || []).includes(currentFilters.locale)) {
        return false;
      }

      if (currentFilters.target) {
        let hasMatchingTarget = false;
        (host.targets || []).forEach((target) => {
          if (target) {
            const targetList = target.split(",").map((t) => t.trim().replace(/\s*\([^)]*\)/g, "").trim());
            if (targetList.includes(currentFilters.target)) hasMatchingTarget = true;
          }
        });
        if (!hasMatchingTarget) return false;
      }

      return true;
    });

    return sortHosts(filtered, currentFilters.sort);
  }, [hosts, debouncedSearch, currentFilters.locale, currentFilters.target, currentFilters.sort, sortHosts]);

  const totalPages = useMemo(() => Math.ceil(filteredHosts.length / pageSize), [filteredHosts.length, pageSize]);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (currentFilters.locale) params.set("locale", currentFilters.locale);
    if (currentFilters.target) params.set("target", currentFilters.target);
    if (currentFilters.sort && currentFilters.sort !== "random") params.set("sort", currentFilters.sort);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newURL = params.toString() ? `/hosts?${params.toString()}` : "/hosts";
    window.history.replaceState({}, "", newURL);
  }, [debouncedSearch, currentFilters.locale, currentFilters.target, currentFilters.sort, currentPage]);

  const handleFilterChange = (filter: keyof typeof currentFilters, value: string) => {
    setCurrentFilters((prev: typeof currentFilters) => ({
      ...prev,
      [filter]: value,
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    if (sort === "random" && currentFilters.sort === "random") {
      setRandomOrder(generateRandomOrder(hosts));
      setCurrentPage(1);
      return;
    }
    setCurrentFilters((prev: typeof currentFilters) => ({
      ...prev,
      sort,
    }));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isMounted.current) {
      updateURL();
    } else {
      isMounted.current = true;
    }
  }, [debouncedSearch, currentFilters.locale, currentFilters.target, currentFilters.sort, currentPage, updateURL]);

  const clearFilters = () => {
    setCurrentFilters({
      search: "",
      locale: "",
      target: "",
      sort: "random",
    });
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById("hosts-container")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isHostNew = (host: Host): boolean => {
    if (!host.created_at) return false;
    const createdDate = new Date(host.created_at);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 15;
  };

  const currentPageHosts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredHosts.length);
    return filteredHosts.slice(startIndex, endIndex);
  }, [filteredHosts, currentPage, pageSize]);

  const hasActiveFilters = useMemo(
    () => currentFilters.search || currentFilters.locale || currentFilters.target,
    [currentFilters.search, currentFilters.locale, currentFilters.target],
  );

  if (!hasMounted) {
    return <HostsLoading />;
  }

  const sortOptions = ["random", "name", "cpu", "ram", "storage", "reviews", "recent"];

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      {/* Hero */}
      <section className="text-center">
        <h1>Free Hosting Directory</h1>
        <p className="mt-2 text-muted-foreground">
          Discover and compare the best free hosting providers for your projects.
        </p>
      </section>

      {/* Search + filters */}
      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_220px_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a host..."
            value={currentFilters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            aria-label="Search hosting providers"
            className={cn("pl-9", isSearching && "opacity-70")}
          />
        </div>
        <CustomDropdown
          id="locale"
          value={currentFilters.locale}
          placeholder="All Languages"
          options={locales.map((locale) => ({
            value: locale,
            label: `${getLanguageName(locale)} (${locale})`,
          }))}
          onChange={(val) => handleFilterChange("locale", val)}
        />
        <CustomDropdown
          id="target-filter"
          value={currentFilters.target}
          placeholder="All Targets"
          options={targets.map((target) => ({ value: target, label: target }))}
          onChange={(val) => handleFilterChange("target", val)}
        />
      </div>

      {/* Sort bar */}
      <div className="mt-4 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-sm text-muted-foreground">Sort by:</span>
          {sortOptions.map((sortType) => (
            <Button
              key={sortType}
              size="sm"
              variant={currentFilters.sort === sortType ? "default" : "outline"}
              className="gap-1.5"
              onClick={() => handleSortChange(sortType)}
            >
              {getSortIcon(sortType)}
              {getSortLabel(sortType)}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {hasActiveFilters
              ? `Showing ${filteredHosts.length} of ${hosts.length} hosts`
              : `Showing all ${hosts.length} hosts`}
          </span>
          {Boolean(hasActiveFilters) && (
            <Button size="sm" variant="ghost" className="gap-1.5" onClick={clearFilters}>
              <X className="size-3.5" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Hosts grid */}
      <div id="hosts-container" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredHosts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
            <Search className="size-10 text-muted-foreground" />
            <div className="text-lg font-medium">No hosts found</div>
            <p className="text-muted-foreground">No hosts match your current filters.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Boolean(hasActiveFilters) && (
                <Button variant="outline" size="sm" className="gap-1.5" onClick={clearFilters}>
                  <X className="size-3.5" />
                  Clear all filters
                </Button>
              )}
              {currentFilters.search && (
                <Button variant="outline" size="sm" onClick={() => handleFilterChange("search", "")}>
                  Clear search
                </Button>
              )}
            </div>
          </div>
        ) : (
          currentPageHosts.map((host) => (
            <HostCard key={host.id} host={host} isNew={isHostNew(host)} />
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredHosts.length > pageSize && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => goToPage(1)} disabled={currentPage === 1}>
            <ChevronsLeft className="size-3.5" />
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-3.5" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(1, currentPage - 2);
              const pageNum = startPage + i;
              if (pageNum > totalPages) return null;

              return (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={pageNum === currentPage ? "default" : "outline"}
                  className="size-8 p-0"
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
            <ChevronsRight className="size-3.5" />
          </Button>
        </div>
      )}
    </main>
  );
}

// Helper functions for sort icons and labels
function getSortIcon(sortType: string): React.ReactNode {
  switch (sortType) {
    case "random":
      return <Shuffle className="size-3.5" />;
    case "name":
      return <ArrowDownAZ className="size-3.5" />;
    case "cpu":
      return <Cpu className="size-3.5" />;
    case "ram":
      return <MemoryStick className="size-3.5" />;
    case "storage":
      return <HardDrive className="size-3.5" />;
    case "reviews":
      return <ThumbsUp className="size-3.5" />;
    case "recent":
      return <Clock className="size-3.5" />;
    default:
      return <Shuffle className="size-3.5" />;
  }
}

function getSortLabel(sortType: string): string {
  switch (sortType) {
    case "random":
      return "Random";
    case "name":
      return "Name (A-Z)";
    case "cpu":
      return "Most CPU";
    case "ram":
      return "Most Memory";
    case "storage":
      return "Most Storage";
    case "reviews":
      return "Most Positive Reviews";
    case "recent":
      return "Recently Added";
    default:
      return "Random";
  }
}
